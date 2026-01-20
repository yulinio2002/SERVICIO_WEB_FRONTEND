import Api from "@services/api";
import { cacheGetOrSet } from "@services/cache";
import type { ProductItem } from "@interfaces/product/ProductTypes";
import { mapProductosBackendToProductItems } from "@interfaces/product/Mapper";

const TTL = 1 * 60 * 1000;

export async function listarProductos(): Promise<ProductItem[]> {
	return cacheGetOrSet(
		"productos:list",
		async () => {
			const api = await Api.getInstance();
			const res = await api.get<null, unknown[]>({ url: "/api/productos" });
			return mapProductosBackendToProductItems(res.data);
		},
		TTL,
	);
}

export async function listarProductosPorCategoria(
	enumCategoria: string,
): Promise<ProductItem[]> {
	return cacheGetOrSet(
		`productos:categoria:${enumCategoria}`,
		async () => {
			const api = await Api.getInstance();
			const res = await api.get<null, unknown[]>({
				url: `/api/productos?categoria=${enumCategoria}`,
			});
			return mapProductosBackendToProductItems(res.data);
		},
		TTL,
	);
}

export async function listarProductosPorMarca(
	marca: string,
): Promise<ProductItem[]> {
	return cacheGetOrSet(
		`productos:marca:${marca}`,
		async () => {
			const api = await Api.getInstance();
			const res = await api.get<null, unknown[]>({
				url: `/api/productos?marca=${marca}`,
			});
			return mapProductosBackendToProductItems(res.data);
		},
		TTL,
	);
}
