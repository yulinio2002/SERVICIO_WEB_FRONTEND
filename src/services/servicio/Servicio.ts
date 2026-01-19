import Api from "@services/api";
import { ServiceSummary, Service } from "@interfaces/servicio/Service";
import {
	mapearServicioABackendAFrontend,
	mapearListaServicioBackendAServiceSummary,
} from "@interfaces/servicio/Mapper.ts";

export async function listarServicios(): Promise<ServiceSummary[]> {
	const Apis = await Api.getInstance();
	const response = await Apis.get<null, unknown[]>({ url: `/api/servicios` });

	return mapearListaServicioBackendAServiceSummary(response.data);
}

export async function obtenerServicio(id: number): Promise<Service> {
	const Apis = await Api.getInstance();
	const response = await Apis.get<null, unknown>({
		url: `/api/servicios/${id}`,
	});
	return mapearServicioABackendAFrontend(response.data);
}

export async function crearServicio(servicio: Service): Promise<ServiceSummary> {
	const Apis = await Api.getInstance();
	const response = await Apis.post<Service, ServiceSummary>(servicio, {
		url: `/api/servicios`,
	});
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
	return response.data;
}

export async function eliminarServicio(id: number): Promise<void> {
	const Apis = await Api.getInstance();
	await Apis.delete({ url: `/api/servicios/${id}` });
}

export async function getTop5Servicios(): Promise<ServiceSummary[]> {
	const Apis = await Api.getInstance();
	const response = await Apis.get<null, ServiceSummary[]>({
		url: `/api/servicios/top/5`,
	});
	return response.data;
}
