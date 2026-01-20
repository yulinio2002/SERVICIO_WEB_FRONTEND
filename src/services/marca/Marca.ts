import Api from "@services/api";
import { cacheGetOrSet } from "@services/cache";

export type Marca = {
	id: number;
	nombre: string;
	imagenUrl: string;
};

const TTL = 5 * 60 * 1000;

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
