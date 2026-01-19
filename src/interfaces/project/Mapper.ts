import { ProjectType } from "@interfaces/project/ProjectTypes";

// slug igual que en Servicios (pero sin depender del archivo de Servicios)
const generarSlug = (nombre: string): string =>
	nombre
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(/-{2,}/g, "-")
		.trim();

export const mapearProyectoBackendAProjectType = (
	proyectoBackend: unknown,
	index = 0,
): ProjectType => {
	const pb = proyectoBackend as {
		id?: number;
		nombre?: string;
		descripcion?: string;
		foto?: { imagenUrl?: string; alt?: string } | null;
		// por si luego agregas un campo directo:
		imagenUrl?: string;
	};

	const nombre = pb.nombre ?? "";
	const imageSrc = pb.foto?.imagenUrl ?? pb.imagenUrl ?? "/images/img1.jpg";
	const imageAlt = pb.foto?.alt ?? nombre;

	return {
		id: pb.id ?? 0,
		slug: generarSlug(nombre),
		title: nombre,
		description: pb.descripcion ?? "",
		image: { src: imageSrc, alt: imageAlt },
		layout: index % 2 === 0 ? "imageRight" : "imageLeft", // UI-only
	};
};

export const mapearListaProyectosBackendAProjectTypes = (
	proyectosBackend: unknown[],
): ProjectType[] =>
	proyectosBackend.map((p, idx) => mapearProyectoBackendAProjectType(p, idx));
