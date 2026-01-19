import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ProductsListGrid from "@components/product/ProductsListGrid";
import {
	getBrandBySlug,
	getCategoriesByBrandSlug,
	getProductsByBrandAndCategory,
} from "src/data/productsCatalog";
import QuoteForm from "@components/servicios/QuoteForm";

const MarcaCategoriaProductos: React.FC = () => {
	const { marcaSlug, categorySlug } = useParams<{
		marcaSlug: string;
		categorySlug: string;
	}>();

	const brand = useMemo(
		() => (marcaSlug ? getBrandBySlug(marcaSlug) : null),
		[marcaSlug],
	);
	const category = useMemo(() => {
		if (!marcaSlug || !categorySlug) return null;
		return (
			getCategoriesByBrandSlug(marcaSlug).find(
				(c) => c.slug === categorySlug,
			) ?? null
		);
	}, [marcaSlug, categorySlug]);

	const products = useMemo(() => {
		if (!marcaSlug || !categorySlug) return [];
		return getProductsByBrandAndCategory(marcaSlug, categorySlug);
	}, [marcaSlug, categorySlug]);

	if (!brand || !category) {
		return (
			<div className="pt-20">
				<section className="container py-16">
					<h1 className="text-2xl font-extrabold">No encontrado</h1>
					<Link className="mt-6 inline-block text-blue-600" to="/marcas">
						Ir a marcas
					</Link>
				</section>
			</div>
		);
	}

	// Para el formulario: si quieres mantenerlo “siempre visible”, usa el primero como fallback
	const fallback = products[0]
		? { title: products[0].title, id: products[0].id }
		: null;

	return (
		<div className="bg-white pt-20">
			<section className="mt-5 md:mt-15">
				<div className="container">
					<Link
						to={`/marcas/${brand.slug}`}
						className="text-blue-600 hover:text-blue-800 inline-flex items-center"
					>
						<i className="las la-arrow-left mr-2"></i>
						Volver a categorías de {brand.name}
					</Link>

					<p className="mt-6 text-center text-lg font-extrabold tracking-widest">
						PRODUCTOS
					</p>
					<p className="mt-6 text-center font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-5xl mx-auto">
						{category.title}
					</p>
					<p className="mt-6 text-center text-slate-600 max-w-3xl mx-auto">
						Productos de {brand.name} para esta categoría.
					</p>
				</div>
			</section>

			<section className="pt-10 md:pt-14 pb-10">
				<div className="container">
					{products.length ? (
						<ProductsListGrid products={products} />
					) : (
						<div className="text-center py-16">
							<h3 className="text-xl font-bold mb-2">
								Sin productos por ahora
							</h3>
							<p className="text-gray-600 mb-6">
								Próximamente agregaremos más productos.
							</p>
							<Link
								to={`/marcas/${brand.slug}`}
								className="inline-flex items-center px-6 py-3 bg-blue-primary text-white rounded-lg"
							>
								Ver categorías
							</Link>
						</div>
					)}
				</div>
			</section>

			{fallback && (
				<QuoteForm serviceTitle={fallback.title} serviceId={fallback.id} />
			)}
		</div>
	);
};

export default MarcaCategoriaProductos;
