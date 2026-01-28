import Api from "@services/api";
import { cacheGetOrSet } from "@services/cache";

export type Marca = {
	id: number;
	nombre: string;
	imagenUrl: string;
};

const TTL = 1 * 60 * 1000;
{/*}
export async function listarMarcas(): Promise<Marca[]> {
	return cacheGetOrSet(
		"marcas:list",
		async () => {
			const api = await Api.getInstance();
			const res = await api.get<null, Marca[]>({ url: "/api/marcas" });
			return res.data;
		},
		TTL,
	);
}
*/}

// Crear una nueva marca
export const crearMarca = async (formData: FormData): Promise<Marca> => {
	const api = await Api.getInstance();
	const response = await api.post(formData,{
		url: "/api/marcas",
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return mapMarcaBackendToMarca(response.data);
};

export const editarMarca = async (
	id: number,
	formData: FormData,
): Promise<Marca> => {
	const api = await Api.getInstance();
	const response = await api.put(formData,{
		url: `/api/marcas/${id}`,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return mapMarcaBackendToMarca(response.data);
};

export const listarMarcas = async (): Promise<Marca[]> => {
	const api = await Api.getInstance();
	const response = await api.get<null, unknown[]>({ url: "/api/marcas" });
	return mapMarcasBackendToMarcas(response.data);
};

// Eliminar una marca
export async function eliminarMarca(id: number): Promise<void> {
	const api = await Api.getInstance();
	await api.delete({ url: `/api/marcas/${id}` });
}

export function mapMarcasBackendToMarcas (list: any[]): Marca[]{
	return list.map(mapMarcaBackendToMarca);
}

export function mapMarcaBackendToMarca (b: any): Marca{
	return {
		id: b.id,
		nombre: b.nombre,
		imagenUrl: b.imagenUrl,
	};
}


