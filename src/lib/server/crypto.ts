const enc = new TextEncoder();
// stays well under the Workers free-plan CPU limit (10 ms); old hashes store their own count
const ITERATIONS = 20_000;

const toHex = (buf: ArrayBuffer | Uint8Array) =>
	[...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

const fromHex = (hex: string) => Uint8Array.from(hex.match(/../g)!.map((h) => parseInt(h, 16)));

export function randomToken() {
	return toHex(crypto.getRandomValues(new Uint8Array(32)));
}

export function randomInt(max: number) {
	return crypto.getRandomValues(new Uint32Array(1))[0] % max;
}

export async function sha256(value: string) {
	return toHex(await crypto.subtle.digest('SHA-256', enc.encode(value)));
}

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
	const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
		'deriveBits'
	]);
	const bits = await crypto.subtle.deriveBits(
		{ name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
		key,
		256
	);
	return toHex(bits);
}

export async function hashPassword(password: string) {
	const salt = crypto.getRandomValues(new Uint8Array(new ArrayBuffer(16)));
	return `pbkdf2$${ITERATIONS}$${toHex(salt)}$${await pbkdf2(password, salt, ITERATIONS)}`;
}

export async function verifyPassword(password: string, stored: string) {
	const [, iterations, salt, hash] = stored.split('$');
	return (await pbkdf2(password, fromHex(salt), Number(iterations))) === hash;
}
