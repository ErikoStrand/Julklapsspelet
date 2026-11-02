import { env } from 'cloudflare:workers';
import { error, type Cookies } from '@sveltejs/kit';
import { randomInt, randomToken, sha256 } from './crypto';

export const MAX_NAMES = 50;
export const MIN_NAMES = 3;
export const MAX_NAME_LENGTH = 40;

export type Game = { id: string; title: string; password_hash: string; created_at: number };
export type Participant = {
	id: string;
	game_id: string;
	name: string;
	position: number;
	gives_to: string | null;
	token_hash: string | null;
	drawn_at: number | null;
};

const COOKIE_MAX_AGE = 60 * 60 * 24 * 120;

export function getDb() {
	return env.DB;
}

export async function getGame(db: D1Database, id: string) {
	const game = await db.prepare('SELECT * FROM games WHERE id = ?').bind(id).first<Game>();
	if (!game) error(404, 'Spelet hittades inte');
	return game;
}

export async function getParticipants(db: D1Database, gameId: string) {
	const { results } = await db
		.prepare('SELECT * FROM participants WHERE game_id = ? ORDER BY position, name')
		.bind(gameId)
		.all<Participant>();
	return results;
}

/** Splits, trims and validates a name. Returns an error message or the clean name. */
export function cleanName(raw: unknown): { name: string } | { error: string } {
	const name = String(raw ?? '')
		.replace(/\s+/g, ' ')
		.trim();
	if (!name) return { error: 'Namnet får inte vara tomt.' };
	if (name.length > MAX_NAME_LENGTH)
		return { error: `Namn får vara högst ${MAX_NAME_LENGTH} tecken.` };
	return { name };
}

// --- admin sessions ---

const adminCookie = (gameId: string) => `jka_${gameId}`;

export async function createAdminSession(db: D1Database, cookies: Cookies, gameId: string) {
	const token = randomToken();
	await db
		.prepare('INSERT INTO admin_sessions (token_hash, game_id, created_at) VALUES (?, ?, ?)')
		.bind(await sha256(token), gameId, Date.now())
		.run();
	cookies.set(adminCookie(gameId), token, {
		path: `/spel/${gameId}`,
		httpOnly: true,
		sameSite: 'lax',
		maxAge: COOKIE_MAX_AGE
	});
}

export async function isAdmin(db: D1Database, cookies: Cookies, gameId: string) {
	const token = cookies.get(adminCookie(gameId));
	if (!token) return false;
	const row = await db
		.prepare('SELECT 1 FROM admin_sessions WHERE token_hash = ? AND game_id = ?')
		.bind(await sha256(token), gameId)
		.first();
	return !!row;
}

export async function endAdminSession(db: D1Database, cookies: Cookies, gameId: string) {
	const token = cookies.get(adminCookie(gameId));
	if (token)
		await db
			.prepare('DELETE FROM admin_sessions WHERE token_hash = ?')
			.bind(await sha256(token))
			.run();
	cookies.delete(adminCookie(gameId), { path: `/spel/${gameId}` });
}

// --- guest identity ---

const guestCookie = (gameId: string) => `jk_${gameId}`;

export async function getMe(cookies: Cookies, gameId: string, participants: Participant[]) {
	const token = cookies.get(guestCookie(gameId));
	if (!token) return null;
	const hash = await sha256(token);
	return participants.find((p) => p.token_hash === hash) ?? null;
}

export function setGuestCookie(cookies: Cookies, gameId: string, token: string) {
	cookies.set(guestCookie(gameId), token, {
		path: `/spel/${gameId}`,
		httpOnly: true,
		sameSite: 'lax',
		maxAge: COOKIE_MAX_AGE
	});
}

/**
 * Picks a receiver for `giver`. Everyone left must still be able to draw someone
 * other than themselves, which only fails if the final giver is also the final
 * receiver — so when two givers remain and the other one is still undrawn as a
 * receiver, they must be picked now.
 */
export function pickReceiver(giver: Participant, participants: Participant[]) {
	const taken = new Set(participants.map((p) => p.gives_to).filter(Boolean));
	const givers = participants.filter((p) => !p.gives_to);
	let candidates = participants.filter((p) => p.id !== giver.id && !taken.has(p.id));

	if (givers.length === 2) {
		const other = givers.find((p) => p.id !== giver.id)!;
		if (candidates.some((p) => p.id === other.id)) candidates = [other];
	}
	if (candidates.length === 0) return null;
	return candidates[randomInt(candidates.length)];
}
