import Api from "@services/api";
import { cacheDel, cacheGetOrSet } from "@services/cache";
import type { ProductItem } from "@interfaces/product/ProductTypes";
import { mapProductosBackendToProductItems } from "@interfaces/product/Mapper";

const TTL = 1 * 60 * 1000;

export async function crearProductoFormData(
	formData: FormData,
): Promise<ProductItem> {
	const api = await Api.getInstance();
	const response = await api.post<FormData, ProductItem>(formData, {
		url: `/api/productos`,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	cacheDel("productos:list");
	return response.data;
}

export async function actualizarProductoFormData(
	id: number,
	formData: FormData,
): Promise<ProductItem> {
	const api = await Api.getInstance();
	const response = await api.put<FormData, ProductItem>(formData, {
		url: `/api/productos/${id}`,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	cacheDel("productos:list");
	cacheDel(`productos:${id}`);
	return response.data;
}

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

export async function listarProductosDestacados(): Promise<ProductItem[]> {
	return cacheGetOrSet(
		"productos:destacados",
		async () => {
			try {
				const api = await Api.getInstance();
				const res = await api.get<null, unknown[]>({
					url: `/api/productosDestacados`,
				});
				return mapProductosBackendToProductItems(res.data);
			} catch (error) {
				console.error('Error obteniendo productos destacados:', error);
				return [];
			}
		},
		TTL,
	);
}

export async function agregarProductoDestacado(idProducto: number): Promise<boolean> {
	try {
		const api = await Api.getInstance();

		// Tu endpoint POST espera solo el ID (Long) en el body
		const response = await api.post<number, boolean>(
			idProducto,{url: `/api/productosDestacados`,});

		cacheDel('productos:destacados');

		return response.data;
	} catch (error: any) {
		console.error('Error agregando producto a destacados:', error);

		// Manejo específico basado en los códigos HTTP de tu backend
		if (error.response) {
			switch (error.response.status) {
				case 404:
					console.error('Producto no encontrado');
					throw new Error('Producto no encontrado');
				case 409:
					console.error('El producto ya está en destacados');
					throw new Error('El producto ya está en destacados');
				default:
					console.error('Error del servidor:', error.response.status);
					throw new Error('Error del servidor');
			}
		}

		throw new Error('Error de conexión');
	}
}

export async function eliminarProductoDestacado(idProducto: number): Promise<boolean> {
	try {
		const api = await Api.getInstance();

		// Tu endpoint DELETE usa path variable
		const response = await api.delete<boolean>({
			url: `/api/productosDestacados/${idProducto}`
		});

		// Invalida la caché
		cacheDel('productos:destacados');

		// Tu backend devuelve Boolean directamente
		return response.data;
	} catch (error: any) {
		console.error('Error eliminando producto de destacados:', error);

		if (error.response?.status === 404) {
			console.error('Producto destacado no encontrado');
			throw new Error('Producto destacado no encontrado');
		}

		throw new Error('Error eliminando producto');
	}
}

export async function estaProductoDestacado(idProducto: number): Promise<boolean> {
	try {
		const destacados = await listarProductosDestacados();

		return destacados.some(producto => producto.id === idProducto);

	} catch (error) {
		console.error('Error verificando producto destacado:', error);
		return false;
	}
}

export async function toggleProductoDestacado(idProducto: number): Promise<boolean> {
	try {
		const yaDestacado = await estaProductoDestacado(idProducto);

		if (yaDestacado) {
			return await eliminarProductoDestacado(idProducto);
		} else {
			return await agregarProductoDestacado(idProducto);
		}
	} catch (error) {
		console.error('Error alternando producto destacado:', error);
		throw error;
	}
}