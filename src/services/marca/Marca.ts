import Api from "@services/api";
import { cacheGetOrSet } from "@services/cache";

export type Marca = {
	id: number;
	nombre: string;
	imagenUrl: string;
};

const TTL = 1 * 60 * 1000;

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

// Crear una nueva marca
export async function crearMarca(marca: Omit<Marca, "id">): Promise<Marca> {
	const api = await Api.getInstance();
	const res = await api.post<Omit<Marca, "id">, Marca>(marca, {
		url: `/api/marcas`
	});
	return res.data;
}

// Editar una marca
export async function editarMarca(marca: Marca): Promise<Marca> {
	const api = await Api.getInstance();
	const res = await api.put<Marca, Marca>(marca, {
		url: `/api/marcas/${marca.id}`
	});
	return res.data;
}

// Eliminar una marca
export async function eliminarMarca(id: number): Promise<void> {
	const api = await Api.getInstance();
	await api.delete({ url: `/api/marcas/${id}` });
}
