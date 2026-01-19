import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
	getBrandBySlug,
	getCategoriesByBrandSlug,
} from "src/data/productsCatalog";

import BrandCategoriesGrid from "@components/product/BrandCategoriesGrid.tsx";



const MarcaCategorias: React.FC = () => {
	const { marcaSlug } = useParams<{ marcaSlug: string }>();

	const brand = useMemo(
		() => (marcaSlug ? getBrandBySlug(marcaSlug) : null),
		[marcaSlug],
	);
	const categories = useMemo(
		() => (marcaSlug ? getCategoriesByBrandSlug(marcaSlug) : []),
		[marcaSlug],
	);

	if (!brand) {
		return (
			<div className="pt-20">
				<section className="container py-16">
					<h1 className="text-2xl font-extrabold">Marca no encontrada</h1>
					<Link className="mt-6 inline-block text-blue-600" to="/marcas">
						Ver marcas
					</Link>
				</section>
			</div>
		);
	}

	return (
		<div className="bg-white pt-20">
			<section className="mt-5 md:mt-15">
				<div className="container">
					<Link
						to="/marcas"
						className="text-blue-600 hover:text-blue-800 inline-flex items-center"
					>
						<i className="las la-arrow-left mr-2"></i>
						Volver a marcas
					</Link>

					<p className="mt-6 text-center text-lg font-extrabold tracking-widest">
						MARCAS
					</p>
					<p className="mt-6 text-center font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-5xl mx-auto">
						{brand.name}
					</p>
					<p className="mt-6 text-center text-slate-600 max-w-3xl mx-auto">
						Categorías disponibles para esta marca.
					</p>
				</div>
			</section>

			<section className="pt-10 md:pt-14 pb-10">
				<div className="container">
					{/* Reutilizamos la misma grilla de categorías, pero el link debe ir a vista 4 */}
					<BrandCategoriesGrid items={categories} brandSlug={brand.slug} />

					{/* IMPORTANTE:
              ProductCategoriesGrid hoy linkea a /productos/:slug (vista 2).
              Para vista 4, queremos /marcas/:marcaSlug/:categorySlug.
              La forma más limpia: pasarle linkTo al card (como hicimos antes) o crear un grid específico.
              Si ya implementaste linkTo en el card, usa el grid “custom” abajo.
          */}
				</div>
			</section>
		</div>
	);
};

export default MarcaCategorias;
