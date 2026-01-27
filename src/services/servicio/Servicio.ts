import Api from "@services/api";
import { ServiceSummary, Service } from "@interfaces/servicio/Service";
import {
	mapearServicioABackendAFrontend,
	mapearListaServicioBackendAServiceSummary,
} from "@interfaces/servicio/Mapper.ts";

import { cacheGetOrSet, cacheDel, DEFAULT_TTL_MS } from "@services/cache";

const TTL_5_MIN = DEFAULT_TTL_MS; //  5 minutos

// Clases para manejar carga de archivos
type ServicioCreateMultipartArgs = {
	nombre: string;
	descripcion: string;
	content: string;
	/**
	 * Texto tal como lo espera el backend. Ejemplo: "A;B;C" o "A\nB\nC".
	 */
	features?: string;
	/** Al menos 1 archivo */
	files: File[];
	/** Lista opcional de alts (mismo orden que files). */
	alt?: string[];
};

type ServicioUpdateMultipartArgs = {
	nombre: string;
	descripcion: string;
	content: string;
	features?: string;
	/** IDs de fotos existentes a conservar */
	idImages: number[];
	/** Archivos nuevos a agregar */
	files?: File[];
	alt?: string[];
};

export async function listarServicios(): Promise<ServiceSummary[]> {
	return cacheGetOrSet(
		"servicios:list",
		async () => {
			const Apis = await Api.getInstance();
			const response = await Apis.get<null, unknown[]>({
				url: `/api/servicios`,
			});
			return mapearListaServicioBackendAServiceSummary(response.data);
		},
		TTL_5_MIN,
	);
}

export async function obtenerServicio(id: number): Promise<Service> {
	return cacheGetOrSet(
		`servicios:${id}`,
		async () => {
			const Apis = await Api.getInstance();
			const response = await Apis.get<null, unknown>({
				url: `/api/servicios/${id}`,
			});
			return mapearServicioABackendAFrontend(response.data);
		},
		TTL_5_MIN,
	);
}

export async function crearServicio(
	args: ServicioCreateMultipartArgs,
): Promise<ServiceSummary> {
	const api = await Api.getInstance();
	const fd = new FormData();

	fd.append("nombre", args.nombre);
	fd.append("descripcion", args.descripcion);
	fd.append("content", args.content);
	if (args.features !== undefined) {
		fd.append("features", args.features);
	}

	args.files.forEach((file) => fd.append("files", file));
	args.alt?.forEach((a) => fd.append("alt", a));

	const res = await api.post<FormData, ServiceSummary>(fd, {
		url: `/api/servicios`,
	});

	cacheDel("servicios:list");
	cacheDel("servicios:top5");

	return res.data;
}

export async function actualizarServicio(
	id: number,
	args: ServicioUpdateMultipartArgs,
): Promise<Service> {
	const api = await Api.getInstance();
	const fd = new FormData();

	// El backend espera un string JSON en el part "data"
	fd.append(
		"data",
		JSON.stringify({
			id,
			nombre: args.nombre,
			descripcion: args.descripcion,
			content: args.content,
			features: args.features,
			idImages: args.idImages,
		}),
	);

	args.files?.forEach((file) => fd.append("files", file));
	args.alt?.forEach((a) => fd.append("alt", a));

	await api.put<FormData, unknown>(fd, {
		url: `/api/servicios/${id}`,
	});

	cacheDel("servicios:list");
	cacheDel(`servicios:${id}`);
	cacheDel("servicios:top5");

	// GET devuelve entity (shape estable); PUT devuelve DTO distinto.
	// Para mantener consistencia retornamos el detalle actualizado.
	return obtenerServicio(id);
}

export async function eliminarServicio(id: number): Promise<void> {
	const Apis = await Api.getInstance();
	await Apis.delete({ url: `/api/servicios/${id}` });

	cacheDel("servicios:list");
	cacheDel(`servicios:${id}`);
	cacheDel("servicios:top5");
}

export async function getTop5Servicios(): Promise<ServiceSummary[]> {
	return cacheGetOrSet(
		"servicios:top5",
		async () => {
			const Apis = await Api.getInstance();
			const response = await Apis.get<null, ServiceSummary[]>({
				url: `/api/servicios/top/5`,
			});
			return response.data;
		},
		TTL_5_MIN,
	);
}

export async function obtenerServicioPorSlug(slug: string): Promise<Service> {
	return cacheGetOrSet(
		`servicios:slug:${slug}`,
		async () => {
			// Obtener la lista de servicios (ya está cacheada)
			const servicios = await listarServicios();
			// Buscar el servicio por slug en la lista cacheada
			const servicioResumen = servicios.find((s) => s.slug === slug);

			if (!servicioResumen) {
				throw new Error(`Servicio con slug "${slug}" no encontrado`);
			}
			// Obtener el detalle usando el ID encontrado
			return await obtenerServicio(servicioResumen.id);
		},
		TTL_5_MIN,
	);
}
