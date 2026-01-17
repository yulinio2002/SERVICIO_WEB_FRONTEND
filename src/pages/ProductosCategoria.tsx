// src/pages/ProductosCategoria.tsx
import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import ProductsGrid from "@components/product/ProductsGrid";
import Pagination from "@components/common/Pagination";
import { usePagination } from "@hooks/usePagination";
import type { PaginationMeta } from "@interfaces/product/ProductTypes";
import { getProductsByCategory, getAllCategories } from "src/data/Products";

const ProductosCategoria: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();

	// Obtener productos de la categoría
	const categoryProducts = useMemo(() => {
		return getProductsByCategory(slug || "");
	}, [slug]);

	// Obtener información de la categoría
	const category = useMemo(() => {
		const categories = getAllCategories();
		return categories.find((cat) => cat.slug === slug);
	}, [slug]);

	// Configurar paginación
	const pageSize = 6;
	const { meta, goTo } = usePagination({
		totalItems: categoryProducts.length,
		pageSize,
		initialPage: 1,
	});

	const visibleProducts = useMemo(
		() => categoryProducts.slice(meta.startIndex, meta.endIndex),
		[categoryProducts, meta.startIndex, meta.endIndex],
	);

	const paginationMeta: PaginationMeta = {
		page: meta.page,
		pageSize: meta.pageSize,
		totalItems: meta.totalItems,
		totalPages: meta.totalPages,
	};

	if (!category) {
		return (
			<div className="min-h-screen flex items-center justify-center pt-20">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">Categoría no encontrada</h2>
					<p className="text-gray-600 mb-4">
						La categoría que buscas no existe.
					</p>
					<Link
						to="/productos"
						className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
					>
						Volver a productos
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white pt-20">
			{/* Hero Section */}
			<section className="py-8 md:py-12">
				<div className="container">
					<div className="mb-6">
						<Link
							to="/productos"
							className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
						>
							<i className="las la-arrow-left mr-2"></i>
							Volver a todas las categorías
						</Link>
					</div>

					<p className="text-center text-lg font-extrabold tracking-widest text-orange-500">
						CATEGORÍA
					</p>

					<h1 className="mt-4 text-center font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-5xl mx-auto">
						{category.title}
					</h1>

					<p className="mt-6 text-center text-slate-600 max-w-3xl mx-auto">
						Explora nuestra selección de productos de{" "}
						{category.title.toLowerCase()}. Ofrecemos componentes de alta
						calidad para tus sistemas oleohidráulicos.
					</p>

					<div className="mt-8 flex flex-wrap justify-center gap-4">
						<div className="bg-orange-50 px-4 py-2 rounded-lg">
							<span className="font-semibold text-orange-700">
								{categoryProducts.length} productos disponibles
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Grid de Productos */}
			<section className="py-10 md:py-14">
				<div className="container">
					{visibleProducts.length > 0 ? (
						<>
							<ProductsGrid
								products={visibleProducts}
								categoryTitle={category.title}
							/>

							{categoryProducts.length > pageSize && (
								<Pagination
									meta={paginationMeta}
									onPageChange={goTo}
									className="mt-14"
									siblingCount={1}
								/>
							)}
						</>
					) : (
						<div className="text-center py-16">
							<i className="las la-box-open text-6xl text-gray-300 mb-4"></i>
							<h3 className="text-xl font-bold mb-2">
								No hay productos en esta categoría
							</h3>
							<p className="text-gray-600 mb-6">
								Próximamente agregaremos más productos a esta categoría.
							</p>
							<Link
								to="/productos"
								className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
							>
								Ver todas las categorías
							</Link>
						</div>
					)}
				</div>
			</section>
		</div>
	);
};

export default ProductosCategoria;
