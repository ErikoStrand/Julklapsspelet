import { error, fail, redirect, type Cookies } from '@sveltejs/kit';
import { verifyPassword } from '#lib/server/crypto.js';
import {
	cleanName,
	createAdminSession,
	endAdminSession,
	getDb,
	getGame,
	getParticipants,
	isAdmin,
	MAX_NAMES,
	MIN_NAMES
} from '#lib/server/game.js';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, cookies, url }) => {
	const db = getDb();
	const game = await getGame(db, params.id);

	if (!(await isAdmin(db, cookies, game.id))) return { authed: false as const, title: game.title };

	const participants = await getParticipants(db, game.id);
	return {
		authed: true as const,
		title: game.title,
		isNew: url.searchParams.has('ny'),
		shareUrl: `${url.origin}/spel/${game.id}`,
		// who gives to whom is kept secret, even from the admin
		participants: participants.map((p) => ({ id: p.id, name: p.name, drawn: !!p.gives_to })),
		anyDrawn: participants.some((p) => p.gives_to),
		maxNames: MAX_NAMES
	};
};

async function requireAdmin(cookies: Cookies, id: string) {
	const db = getDb();
	const game = await getGame(db, id);
	if (!(await isAdmin(db, cookies, game.id))) error(401, 'Du är inte inloggad som admin.');
	return { db, game };
}

const isUniqueError = (e: unknown) => String(e).includes('UNIQUE');

export const actions: Actions = {
	login: async ({ params, cookies, request }) => {
		const db = getDb();
		const game = await getGame(db, params.id);
		const password = String((await request.formData()).get('password') ?? '');
		if (!(await verifyPassword(password, game.password_hash)))
			return fail(401, { error: 'Fel lösenord.' });
		await createAdminSession(db, cookies, game.id);
		return { success: 'Inloggad!' };
	},

	logout: async ({ params, cookies }) => {
		await endAdminSession(getDb(), cookies, params.id);
		redirect(303, `/spel/${params.id}`);
	},

	title: async ({ params, cookies, request }) => {
		const { db, game } = await requireAdmin(cookies, params.id);
		const title = String((await request.formData()).get('title') ?? '').trim();
		if (!title || title.length > 80)
			return fail(400, { error: 'Spelets namn måste vara 1–80 tecken.' });
		await db.prepare('UPDATE games SET title = ? WHERE id = ?').bind(title, game.id).run();
		return { success: 'Namnet på spelet är ändrat.' };
	},

	add: async ({ params, cookies, request }) => {
		const { db, game } = await requireAdmin(cookies, params.id);
		const result = cleanName((await request.formData()).get('name'));
		if ('error' in result) return fail(400, { error: result.error });

		const participants = await getParticipants(db, game.id);
		if (participants.some((p) => p.gives_to))
			return fail(409, {
				error: 'Någon har redan dragit. Nollställ dragningen innan du lägger till namn.'
			});
		if (participants.length >= MAX_NAMES)
			return fail(400, { error: `Max ${MAX_NAMES} namn per spel.` });

		const position = Math.max(-1, ...participants.map((p) => p.position)) + 1;
		try {
			await db
				.prepare('INSERT INTO participants (id, game_id, name, position) VALUES (?, ?, ?, ?)')
				.bind(crypto.randomUUID(), game.id, result.name, position)
				.run();
		} catch (e) {
			if (isUniqueError(e)) return fail(409, { error: `"${result.name}" finns redan.` });
			throw e;
		}
		return { success: `${result.name} är tillagd.` };
	},

	rename: async ({ params, cookies, request }) => {
		const { db, game } = await requireAdmin(cookies, params.id);
		const form = await request.formData();
		const result = cleanName(form.get('name'));
		if ('error' in result) return fail(400, { error: result.error });
		try {
			await db
				.prepare('UPDATE participants SET name = ? WHERE id = ? AND game_id = ?')
				.bind(result.name, String(form.get('id')), game.id)
				.run();
		} catch (e) {
			if (isUniqueError(e)) return fail(409, { error: `"${result.name}" finns redan.` });
			throw e;
		}
		return { success: 'Namnet är ändrat.' };
	},

	remove: async ({ params, cookies, request }) => {
		const { db, game } = await requireAdmin(cookies, params.id);
		const id = String((await request.formData()).get('id'));
		const participants = await getParticipants(db, game.id);
		if (participants.some((p) => p.gives_to))
			return fail(409, {
				error: 'Någon har redan dragit. Nollställ dragningen innan du tar bort namn.'
			});
		if (participants.length <= MIN_NAMES)
			return fail(400, { error: `Ett spel måste ha minst ${MIN_NAMES} namn.` });
		await db
			.prepare('DELETE FROM participants WHERE id = ? AND game_id = ?')
			.bind(id, game.id)
			.run();
		return { success: 'Namnet är borttaget.' };
	},

	reset: async ({ params, cookies, request }) => {
		const { db, game } = await requireAdmin(cookies, params.id);
		const id = String((await request.formData()).get('id'));
		await db
			.prepare(
				`UPDATE participants SET gives_to = NULL, token_hash = NULL, drawn_at = NULL
				 WHERE id = ? AND game_id = ?`
			)
			.bind(id, game.id)
			.run();
		return { success: 'Personen kan nu dra ett nytt namn.' };
	},

	resetAll: async ({ params, cookies }) => {
		const { db, game } = await requireAdmin(cookies, params.id);
		await db
			.prepare(
				'UPDATE participants SET gives_to = NULL, token_hash = NULL, drawn_at = NULL WHERE game_id = ?'
			)
			.bind(game.id)
			.run();
		return { success: 'All dragning är nollställd.' };
	},

	delete: async ({ params, cookies }) => {
		const { db, game } = await requireAdmin(cookies, params.id);
		await db.batch([
			db.prepare('DELETE FROM participants WHERE game_id = ?').bind(game.id),
			db.prepare('DELETE FROM admin_sessions WHERE game_id = ?').bind(game.id),
			db.prepare('DELETE FROM games WHERE id = ?').bind(game.id)
		]);
		redirect(303, '/');
	}
};
