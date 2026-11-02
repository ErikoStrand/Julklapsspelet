import { fail, redirect } from '@sveltejs/kit';
import { hashPassword } from '#lib/server/crypto.js';
import {
	cleanName,
	createAdminSession,
	getDb,
	MAX_NAMES,
	MIN_NAMES
} from '#lib/server/game.js';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const db = getDb();
		const form = await request.formData();
		const title = String(form.get('title') ?? '').trim();
		const password = String(form.get('password') ?? '');
		const rawNames = form.getAll('name').map(String);
		const values = { title, names: rawNames };

		if (!title) return fail(400, { ...values, error: 'Ge spelet ett namn.' });
		if (title.length > 80) return fail(400, { ...values, error: 'Spelets namn är för långt.' });
		if (password.length < 4)
			return fail(400, { ...values, error: 'Lösenordet måste vara minst 4 tecken.' });

		const names: string[] = [];
		const seen = new Set<string>();
		for (const line of rawNames) {
			if (!line.trim()) continue;
			const result = cleanName(line);
			if ('error' in result) return fail(400, { ...values, error: result.error });
			const key = result.name.toLocaleLowerCase('sv');
			if (seen.has(key))
				return fail(400, { ...values, error: `"${result.name}" finns med flera gånger.` });
			seen.add(key);
			names.push(result.name);
		}
		if (names.length < MIN_NAMES)
			return fail(400, { ...values, error: `Lägg till minst ${MIN_NAMES} namn.` });
		if (names.length > MAX_NAMES)
			return fail(400, { ...values, error: `Max ${MAX_NAMES} namn per spel.` });

		const id = crypto.randomUUID();
		const now = Date.now();
		await db.batch([
			db
				.prepare('INSERT INTO games (id, title, password_hash, created_at) VALUES (?, ?, ?, ?)')
				.bind(id, title, await hashPassword(password), now),
			...names.map((name, i) =>
				db
					.prepare('INSERT INTO participants (id, game_id, name, position) VALUES (?, ?, ?, ?)')
					.bind(crypto.randomUUID(), id, name, i)
			)
		]);

		await createAdminSession(db, cookies, id);
		redirect(303, `/spel/${id}/admin?ny=1`);
	}
};
