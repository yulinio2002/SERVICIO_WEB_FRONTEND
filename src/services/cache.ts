
// src/services/cache.ts
type CacheEntry<T> = {
	value: T;
	expiresAt: number;
};

const mem = new Map<string, CacheEntry<unknown>>();

// 5 minutos (esto controla “no consultar al backend”)
export const DEFAULT_TTL_MS = 5 * 60 * 1000;

const now = () => Date.now();
const keyLS = (k: string) => `cache:${k}`;

function readLS<T>(key: string): CacheEntry<T> | null {
	try {
		const raw = localStorage.getItem(keyLS(key));
		if (!raw) return null;
		const parsed = JSON.parse(raw) as CacheEntry<T>;
		if (!parsed?.expiresAt) return null;

		if (parsed.expiresAt <= now()) {
			localStorage.removeItem(keyLS(key));
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

function writeLS<T>(key: string, entry: CacheEntry<T>) {
	try {
		localStorage.setItem(keyLS(key), JSON.stringify(entry));
	} catch {
		// ignore
	}
}

export function cacheDel(key: string) {
	mem.delete(key);
	try {
		localStorage.removeItem(keyLS(key));
	} catch {
		// ignore
	}
}

export function cacheGet<T>(key: string): T | null {
	const m = mem.get(key);
	if (m) {
		if (m.expiresAt > now()) return m.value as T;
		mem.delete(key);
	}

	const ls = readLS<T>(key);
	if (!ls) return null;

	mem.set(key, ls);
	return ls.value;
}

export function cacheSet<T>(
	key: string,
	value: T,
	ttlMs: number = DEFAULT_TTL_MS,
) {
	const entry: CacheEntry<T> = { value, expiresAt: now() + ttlMs };
	mem.set(key, entry);
	writeLS(key, entry);
}

export async function cacheGetOrSet<T>(
	key: string,
	fetcher: () => Promise<T>,
	ttlMs: number = DEFAULT_TTL_MS,
): Promise<T> {
	const cached = cacheGet<T>(key);
	if (cached !== null) return cached;

	const fresh = await fetcher();
	cacheSet(key, fresh, ttlMs);
	return fresh;
}

export function cacheInvalidate(key: string) {
	try {
		localStorage.removeItem(key);
	} catch {}
}
