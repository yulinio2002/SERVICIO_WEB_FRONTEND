import { useState, useEffect } from "react";
import {
	listarProductosDestacados,
	eliminarProductoDestacado,
} from "@services/producto/Producto.ts";
import Alert from "./Alert";
import type { ProductItem } from "@interfaces/product/ProductTypes";

export default function ProductosDestacadosSection() {
	const [productos, setProductos] = useState<ProductItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [productoAEliminar, setProductoAEliminar] = useState<number | null>(
		null,
	);

	useEffect(() => {
		loadProductosDestacados();
	}, []);

	const loadProductosDestacados = async () => {
		try {
			setLoading(true);
			const data = await listarProductosDestacados();
			setProductos(data);
			setError(null);
		} catch (err) {
			setError("Error al cargar productos destacados");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleEliminarDestacado = async (productoId: number) => {
		try {
			setIsSubmitting(true);
			const success = await eliminarProductoDestacado(productoId);

			if (success) {
				setProductos((prev) => prev.filter((p) => p.id !== productoId));
				setSuccess("Producto eliminado de destacados");
				setProductoAEliminar(null);
			} else {
				setError("No se pudo eliminar el producto de destacados");
			}
		} catch (err: any) {
			setError(err.message || "Error al eliminar producto destacado");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleConfirmEliminar = (productoId: number) => {
		setProductoAEliminar(productoId);
	};

	const handleCancelarEliminar = () => {
		setProductoAEliminar(null);
	};

	if (loading) {
		return (
			<div className="text-center py-8">
				<div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
				<p className="mt-2 text-gray-600">Cargando productos destacados...</p>
			</div>
		);
	}

	return (
		<div>
			{error && (
				<Alert type="error" message={error} onClose={() => setError(null)} />
			)}
			{success && (
				<Alert
					type="success"
					message={success}
					onClose={() => setSuccess(null)}
				/>
			)}

			<div className="flex justify-between items-center mb-6">
				<div>
					<h2 className="text-2xl font-bold">Productos Destacados</h2>
					<p className="text-gray-600 mt-1">
						Gestiona los productos que aparecen en la sección destacada de la
						página principal
					</p>
				</div>

			</div>

			{productos.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-lg">
					<i className="las la-star text-5xl text-gray-300 mb-4"></i>
					<h3 className="text-xl font-semibold text-gray-700 mb-2">
						No hay productos destacados
					</h3>
					<p className="text-gray-600 mb-4">
						Agrega productos destacados desde la sección de productos
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{productos.map((producto) => (
						<div
							key={producto.id}
							className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
						>
							{/* Imagen del producto */}
							<div className="relative h-48 overflow-hidden">
								<img
									src={producto.image?.src || "/images/placeholder.jpg"}
									alt={producto.image?.alt || producto.title}
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
									onError={(e) => {
										(e.currentTarget as HTMLImageElement).src =
											"/images/placeholder.jpg";
									}}
								/>
								<div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
									DESTACADO
								</div>
							</div>

							{/* Contenido */}
							<div className="p-4">
								<h3 className="font-bold text-lg mb-2 line-clamp-1">
									{producto.title}
								</h3>

								{producto.marca && (
									<p className="text-sm text-gray-600 mb-2">
										<strong>Marca:</strong> {producto.marca}
									</p>
								)}

								{producto.description && (
									<p className="text-sm text-gray-500 mb-4 line-clamp-2">
										{producto.description}
									</p>
								)}

								<div className="flex gap-2 mt-4">
									<a
										href={`/producto/${producto.slug}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-3 rounded text-sm text-center"
									>
										Ver en sitio
									</a>
									<button
										onClick={() => handleConfirmEliminar(producto.id)}
										disabled={isSubmitting}
										className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-3 rounded text-sm"
									>
										Quitar destacado
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Modal de confirmación */}
			{productoAEliminar && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<div className="mb-4">
							<i className="las la-exclamation-triangle text-4xl text-yellow-500 mb-2"></i>
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								¿Quitar de destacados?
							</h3>
							<p className="text-gray-600">
								El producto dejará de aparecer en la sección destacada de la
								página principal. Esta acción se puede revertir.
							</p>
						</div>

						<div className="flex gap-3 mt-6">
							<button
								onClick={handleCancelarEliminar}
								className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded"
								disabled={isSubmitting}
							>
								Cancelar
							</button>
							<button
								onClick={() => handleEliminarDestacado(productoAEliminar)}
								disabled={isSubmitting}
								className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
							>
								{isSubmitting ? (
									<>
										<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
										Procesando...
									</>
								) : (
									"Quitar destacado"
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
