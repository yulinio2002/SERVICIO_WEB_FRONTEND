import { Service, ServiceSummary } from "@interfaces/servicio/Service";

// Función para generar el slug a partir del nombre
const generarSlug = (nombre: string): string => {
	return nombre
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
		.replace(/\s+/g, "-") // Reemplazar espacios con guiones
		.replace(/[^\w-]+/g, "") // Eliminar caracteres no alfanuméricos
		.replace(/-{2,}/g, "-") // Reemplazar múltiples guiones por uno solo
		.trim();
};

// Mapper principal
export const mapearServicioABackendAFrontend = (servicioBackend: unknown): Service => {
	const sb = servicioBackend as {
		fotos?: { id?: number; imagenUrl: string , alt: string}[];
		imagenUrl?: string;
		nombre: string;
		descripcion: string;
		content: string;
		features: string;
		id: number;
	};

	const images =
		sb.fotos && sb.fotos.length > 0
			? [sb.fotos[0].imagenUrl]
			: [sb.imagenUrl ?? ""];

	// Mapear galleryImages
	const galleryImages = (sb.fotos || []).map((foto) => ({
		id: foto?.id ?? 0,
		url: foto.imagenUrl,
		alt: foto.alt,
	}));

	const featuresArray = sb.features
		? sb.features.split(";").map((f) => f.trim())
		: [];
	return {
		id: sb.id ?? 0,
		title: sb.nombre,
		slug: generarSlug(sb.nombre),
		description: sb.descripcion,
		content: sb.content ?? "",
		features: featuresArray,
		images,
		galleryImages,
	};
};

// Mapper para lista de servicios
export const mapearListaServiciosBackendAFrontend = (
	serviciosBackend: unknown[],
): Service[] => {
	return serviciosBackend.map((servicio) =>
		mapearServicioABackendAFrontend(servicio),
	);
};

export const mapearServicioBackendAServiceSummary = (
	servicioBackend: unknown,
): ServiceSummary => {
	const sb = servicioBackend as {
		image: string | "";
		title: string;
		id: number;
	};

	return {
		id: sb.id ?? 0,
		title: sb.title,
		slug: generarSlug(sb.title),
		image: sb.image,
	};
};

export const mapearListaServicioBackendAServiceSummary = (
	serviciosBackend: unknown[],
): ServiceSummary[] => {
	return serviciosBackend.map((servicio) =>
		mapearServicioBackendAServiceSummary(servicio),
	);
}
