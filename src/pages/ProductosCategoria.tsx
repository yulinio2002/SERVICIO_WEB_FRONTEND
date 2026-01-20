import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductsListGrid from "@components/product/ProductsListGrid";
import type { ProductItem } from "@interfaces/product/ProductTypes";
import { listarProductosPorCategoria } from "@services/producto/Producto";

const ProductosCategoria: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const [products, setProducts] = useState<ProductItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProducts = async () => {
			if (!slug) return;

			setLoading(true);
			setError(null);

			try {
				// Convertir slug a formato enum (ej: "accesorios-hidraulicos" -> "ACCESORIOS_HIDRAULICOS")
				const enumCategoria = slug.toUpperCase().replace("-", "_");
				const data = await listarProductosPorCategoria(enumCategoria);
				setProducts(data);
			} catch (err) {
				console.error("Error al cargar productos:", err);
				setError(
					"No se pudieron cargar los productos. Por favor intente nuevamente.",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [slug]);

	const categoryTitle =
		products[0]?.categoryTitle ??
		(slug
			? slug
					.split("-")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ")
			: "Categoría");

	// Manejar estados de carga y error
	if (loading) {
		return (
			<div className="bg-white pt-20">
				<div className="container">
					<div className="text-center py-16">
						<p className="text-lg">Cargando productos...</p>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white pt-20">
				<section className="mt-5 md:mt-15">
					<div className="container">
						<div className="mb-8">
							<Link
								to="/productos"
								className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
							>
								<i className="las la-arrow-left mr-2"></i>
								Volver a categorías
							</Link>
						</div>

						<div className="text-center py-16">
							<h3 className="text-xl font-bold mb-2">Error</h3>
							<p className="text-gray-600 mb-6">{error}</p>
							<Link
								to="/productos"
								className="inline-flex items-center px-6 py-3 bg-blue-primary text-white rounded-lg"
							>
								Volver a categorías
							</Link>
						</div>
					</div>
				</section>
			</div>
		);
	}
	return (
		<div className="bg-white pt-20">
			<section className="mt-5 md:mt-15">
				<div className="container">
					<div className="mb-8">
						<Link
							to="/productos"
							className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
						>
							<i className="las la-arrow-left mr-2"></i>
							Volver a categorías
						</Link>
					</div>

					<p className="mt-6 text-center text-lg font-extrabold tracking-widest">
						PRODUCTOS
					</p>

					<p className="mt-6 text-center font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-5xl mx-auto">
						{categoryTitle}
					</p>

					<p className="mt-6 text-center text-slate-600 max-w-3xl mx-auto">
						Selección de productos disponibles para esta categoría.
					</p>
				</div>
			</section>

			<section className="pt-10 md:pt-14 pb-10">
				<div className="container">
					{products.length > 0 ? (
						<ProductsListGrid products={products} />
					) : (
						<div className="text-center py-16">
							<h3 className="text-xl font-bold mb-2">
								No hay productos en esta categoría
							</h3>
							<p className="text-gray-600 mb-6">
								Próximamente agregaremos más productos.
							</p>
							<Link
								to="/productos"
								className="inline-flex items-center px-6 py-3 bg-blue-primary text-white rounded-lg"
							>
								Ver categorías
							</Link>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default ProductosCategoria;
