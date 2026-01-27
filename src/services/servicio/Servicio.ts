import Api from "@services/api";
import { ServiceSummary, Service } from "@interfaces/servicio/Service";
import {
	mapearServicioABackendAFrontend,
	mapearListaServicioBackendAServiceSummary,
} from "@interfaces/servicio/Mapper.ts";

import { cacheGetOrSet, cacheDel, DEFAULT_TTL_MS } from "@services/cache";

const TTL_5_MIN = DEFAULT_TTL_MS;

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

// Nueva función para crear servicio con FormData
export async function crearServicioFormData(
	formData: FormData,
): Promise<ServiceSummary> {
	const Apis = await Api.getInstance();

	const response = await Apis.post<FormData, ServiceSummary>(formData, {
		url: `/api/servicios`,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	cacheDel("servicios:list");
	cacheDel("servicios:top5");

	return response.data;
}

// Nueva función para actualizar servicio con FormData
export async function actualizarServicioFormData(
	id: number,
	formData: FormData,
): Promise<Service> {
	const Apis = await Api.getInstance();

	const response = await Apis.put<FormData, Service>(formData, {
		url: `/api/servicios/${id}`,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	cacheDel("servicios:list");
	cacheDel(`servicios:${id}`);
	cacheDel("servicios:top5");

	return response.data;
}

// Mantén las funciones existentes por compatibilidad
export async function crearServicio(
	servicio: Service,
): Promise<ServiceSummary> {
	// Crear FormData desde el objeto Service
	const formData = new FormData();
	formData.append("nombre", servicio.title);
	formData.append("descripcion", servicio.description || "");
	formData.append("content", servicio.content || "");
	formData.append("features", servicio.features?.join(";") || "");

	// Si hay imágenes, agregarlas como archivos (en una app real se necesitaría convertir URLs a archivos)
	// Por ahora, esta función es solo para compatibilidad
	return crearServicioFormData(formData);
}

export async function actualizarServicio(
	id: number,
	servicio: Service,
): Promise<Service> {
	const formData = new FormData();
	formData.append(
		"data",
		JSON.stringify({
			nombre: servicio.title,
			descripcion: servicio.description,
			content: servicio.content,
			features: servicio.features?.join(";"),
			idImages: servicio.galleryImages?.map((img) => img.id) || [],
		}),
	);

	return actualizarServicioFormData(id, formData);
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
			const servicios = await listarServicios();
			const servicioResumen = servicios.find((s) => s.slug === slug);

			if (!servicioResumen) {
				throw new Error(`Servicio con slug "${slug}" no encontrado`);
			}
			return await obtenerServicio(servicioResumen.id);
		},
		TTL_5_MIN,
	);
}
