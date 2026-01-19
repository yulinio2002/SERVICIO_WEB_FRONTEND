import Api from "@services/api";
import { Empresa } from "@interfaces/empresa/Empresa.ts";

export async function listarEmpresas(): Promise<Empresa[]> {
	const Apis = await Api.getInstance();
	const response = await Apis.get<null, Empresa[]>({ url: `/api/empresas` });
	return response.data;
}

export async function obtenerEmpresa(id: number): Promise<Empresa> {
	const Apis = await Api.getInstance();
	const response = await Apis.get<null, Empresa>({
		url: `/api/empresas/${id}`,
	});
	return response.data;
}

export async function crearEmpresa(empresa: Empresa): Promise<Empresa> {
	const Apis = await Api.getInstance();
	const response = await Apis.post<Empresa, Empresa>(empresa, {
		url: `/api/empresas`,
	});
	return response.data;
}

export async function actualizarEmpresa(
	id: number,
	empresa: Empresa,
): Promise<Empresa> {
	const Apis = await Api.getInstance();
	const response = await Apis.put<Empresa, Empresa>(empresa, {
		url: `/api/empresas/${id}`,
	});
	return response.data;
}

export async function eliminarEmpresa(id: number): Promise<void> {
	const Apis = await Api.getInstance();
	await Apis.delete({ url: `/api/empresas/${id}` });
}
