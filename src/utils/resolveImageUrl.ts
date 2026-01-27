// src/utils/resolveImageUrl.ts
/**
 * Normaliza URLs de imágenes devueltas por el backend.
 * - Si ya es absoluta (http/https), se retorna tal cual.
 * - Si es relativa (p. ej. /api/images/public/...), se prefija con el host del backend.
 */
export function resolveImageUrl(url?: string | null): string | undefined {
	if (!url) return undefined;

	const trimmed = url.trim();
	if (!trimmed) return undefined;

	if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
		return trimmed;
	}

	const base = `http://${import.meta.env.VITE_BASE_URL}:8081`;

	if (trimmed.startsWith("/")) {
		return `${base}${trimmed}`;
	}

	return `${base}/${trimmed}`;
}
