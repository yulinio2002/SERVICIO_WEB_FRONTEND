import { useMemo } from "react";
import ProductCategoriesGrid from "@components/product/ProductCategoriesGrid";
import type { ProductCategoryCard } from "@interfaces/product/ProductTypes";
import { usePagination } from "@hooks/usePagination";
import Pagination from "@components/common/Pagination";
import type { PaginationMeta } from "@interfaces/product/ProductTypes";

const productCategories: ProductCategoryCard[] = [
	{
		id: 1,
		slug: "abrazaderas",
		title: "Abrazaderas",
		marca: "D'ONOFRIO",
		image: { src: "/images/products/abrazaderas.jpg", alt: "Abrazaderas" },
	},
	{
		id: 2,
		slug: "accesorios-hidraulicos",
		title: "Accesorios Hidráulicos",
		image: {
			src: "/images/products/accesorios.jpg",
			alt: "Accesorios Hidráulicos",
		},
	},
	{
		id: 3,
		slug: "acumuladores-hidraulicos",
		title: "Acumuladores Hidráulicos",
		image: {
			src: "/images/products/acumuladores.jpg",
			alt: "Acumuladores Hidráulicos",
		},
	},
	// agrega más...
];

export default function Productos() {
	const pageSize = 6; // 3 columnas x 2 filas (como tu captura). Ajusta si quieres.

	const { meta, goTo } = usePagination({
		totalItems: productCategories.length,
		pageSize,
		initialPage: 1,
	});

	const visibleItems = useMemo(
		() => productCategories.slice(meta.startIndex, meta.endIndex),
		[meta.startIndex, meta.endIndex],
	);

	// Adaptamos meta interno al PaginationMeta que definiste
	const paginationMeta: PaginationMeta = {
		page: meta.page,
		pageSize: meta.pageSize,
		totalItems: meta.totalItems,
		totalPages: meta.totalPages,
	};

	return (
		<div className="bg-white">
			<section className="mt-5 md:mt-15">
				<div className="container">
					<p className="mt-6 text-center text-lg font-extrabold tracking-widest">
						NUESTROS PRODUCTOS
					</p>

					<p className="mt-6 text-center font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-5xl mx-auto">
						Venta de Equipos Oleohidráulicos a nivel nacional
					</p>

					<p className="mt-6 text-center text-slate-600 max-w-3xl mx-auto">
						Ofrecemos una amplia gama de componentes y repuestos originales para
						diversos sectores industriales.
					</p>
				</div>
			</section>

			<section className="pt-10 md:pt-14">
				<div className="container">

					<ProductCategoriesGrid items={visibleItems} />

					<Pagination
						meta={paginationMeta}
						onPageChange={goTo}
						className="mt-14"
						siblingCount={1}
					/>
				</div>
			</section>
		</div>
	);
}
