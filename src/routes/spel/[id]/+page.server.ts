import { fail } from '@sveltejs/kit';
import { randomToken, sha256 } from '#lib/server/crypto.js';
import {
	getDb,
	getGame,
	getMe,
	getParticipants,
	pickReceiver,
	setGuestCookie
} from '#lib/server/game.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies }) => {
	const db = getDb();
	const game = await getGame(db, params.id);
	const participants = await getParticipants(db, game.id);
	const me = await getMe(cookies, game.id, participants);

	return {
		title: game.title,
		// who has drawn is not exposed; a taken name only errors when drawing
		participants: participants.map((p) => ({ id: p.id, name: p.name })),
		drawnCount: participants.filter((p) => p.gives_to).length,
		me: me && {
			name: me.name,
			receiver: participants.find((p) => p.id === me.gives_to)?.name ?? null
		}
	};
};

export const actions: Actions = {
	draw: async ({ params, cookies, request }) => {
		const db = getDb();
		const game = await getGame(db, params.id);
		const participantId = String((await request.formData()).get('participant') ?? '');

		// Retry a few times in case someone else draws the same receiver at the same moment
		for (let attempt = 0; attempt < 5; attempt++) {
			const participants = await getParticipants(db, game.id);
			if (await getMe(cookies, game.id, participants))
				return fail(400, { error: 'Du har redan dragit ett namn i det här spelet.' });

			const giver = participants.find((p) => p.id === participantId);
			if (!giver) return fail(400, { error: 'Välj vem du är i listan.' });
			if (giver.gives_to) return fail(409, { error: `${giver.name} har redan dragit ett namn.` });

			const receiver = pickReceiver(giver, participants);
			if (!receiver)
				return fail(409, {
					error:
						'Det finns ingen kvar att dra. Be den som skapade spelet att nollställa dragningen.'
				});

			const token = randomToken();
			try {
				const result = await db
					.prepare(
						`UPDATE participants SET gives_to = ?, token_hash = ?, drawn_at = ?
						 WHERE id = ? AND game_id = ? AND gives_to IS NULL`
					)
					.bind(receiver.id, await sha256(token), Date.now(), giver.id, game.id)
					.run();
				if (result.meta.changes === 0)
					return fail(409, { error: `${giver.name} har redan dragit ett namn.` });
			} catch (e) {
				// unique index on gives_to: receiver was taken concurrently, try again
				if (String(e).includes('UNIQUE')) continue;
				throw e;
			}

			setGuestCookie(cookies, game.id, token);
			return { receiverId: receiver.id };
		}
		return fail(409, { error: 'Många drar samtidigt just nu – försök igen.' });
	}
};
