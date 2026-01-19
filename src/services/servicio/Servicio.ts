import Api from "@services/api";
import { ServiceSummary, Service } from "@interfaces/servicio/Service";
import {
	mapearServicioABackendAFrontend,
	mapearListaServicioBackendAServiceSummary,
} from "@interfaces/servicio/Mapper.ts";

import { cacheGetOrSet, cacheDel, DEFAULT_TTL_MS } from "@services/cache";

const TTL_5_MIN = DEFAULT_TTL_MS; //  5 minutos

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
	servicio: Service,
): Promise<ServiceSummary> {
	const Apis = await Api.getInstance();
	const response = await Apis.post<Service, ServiceSummary>(servicio, {
		url: `/api/servicios`,
	});

	// invalida cache (lista y opcionalmente el top)
	cacheDel("servicios:list");
	cacheDel("servicios:top5");

	return response.data;
}

export async function actualizarServicio(
	id: number,
	servicio: Service,
): Promise<Service> {
	const Apis = await Api.getInstance();
	const response = await Apis.put<Service, Service>(servicio, {
		url: `/api/servicios/${id}`,
	});

	// invalida cache de lista + detalle
	cacheDel("servicios:list");
	cacheDel(`servicios:${id}`);
	cacheDel("servicios:top5");

	return response.data;
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
