import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ProductsListGrid from "@components/product/ProductsListGrid";
import type { ProductItem } from "@interfaces/product/ProductTypes";

const ProductosCategoria: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();

	// ✅ data estática por categoría (usa imágenes locales)
	const productsByCategory: Record<string, ProductItem[]> = {
		"accesorios-hidraulicos": [
			{
				id: 1,
				slug: "omt-campanas-motor-bomba",
				marca: "OMT",
				title: "CAMPANAS DE MOTOR BOMBA DESDE 0.75 HP -150 HP",
				description: "",
				content: "",
				features: [],
				image: { src: "/images/img1.jpg", alt: "OMT - Campanas motor bomba" },
				categorySlug: "accesorios-hidraulicos",
				categoryTitle: "Accesorios Hidráulicos",
			},
			{
				id: 2,
				slug: "atos-conectores",
				marca: "Atos",
				title: "Conectores",
				description: "",
				content: "",
				features: [],
				image: { src: "/images/img2.jpg", alt: "Atos - Conectores" },
				categorySlug: "accesorios-hidraulicos",
				categoryTitle: "Accesorios Hidráulicos",
			},
			{
				id: 3,
				slug: "atos-e-atr-8",
				marca: "Atos",
				title: "E-ATR-8",
				description: "",
				content: "",
				features: [],
				image: { src: "/images/img3.jpg", alt: "Atos - E-ATR-8" },
				categorySlug: "accesorios-hidraulicos",
				categoryTitle: "Accesorios Hidráulicos",
			},
		],
	};

	const products = useMemo(() => {
		if (!slug) return [];
		return productsByCategory[slug] ?? [];
	}, [slug]);

	const categoryTitle = useMemo(() => {
		if (!slug) return "Categoría";
		// simple: capitaliza o usa el título del primer producto
		return products[0]?.categoryTitle ?? "Categoría";
	}, [slug, products]);

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
