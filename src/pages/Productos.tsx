import { useMemo, useState, useEffect} from "react";
import ProductCategoriesGrid from "@components/product/ProductCategoriesGrid";
import type { ProductCategoryCard } from "@interfaces/product/ProductTypes";
import { usePagination } from "@hooks/usePagination";
import Pagination from "@components/common/Pagination";
import type { PaginationMeta } from "@interfaces/product/ProductTypes";
import { listarProductos } from "@services/producto/Producto.ts";
import { buildCategoryCards } from "@interfaces/product/Mapper.ts";


export default function Productos() {
	const [categories, setCategories] = useState<ProductCategoryCard[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			const products = await listarProductos();
			setCategories(buildCategoryCards(products));
			setLoading(false);
		})();
	}, []);

	const pageSize = 6;

	const { meta, goTo } = usePagination({
		totalItems: categories.length,
		pageSize,
		initialPage: 1,
	});

	const visibleItems = useMemo(
		() => categories.slice(meta.startIndex, meta.endIndex),
		[categories, meta.startIndex, meta.endIndex],
	);

	const paginationMeta: PaginationMeta = {
		page: meta.page,
		pageSize: meta.pageSize,
		totalItems: meta.totalItems,
		totalPages: meta.totalPages,
	};

	if (loading) return <div className="pt-20 text-center">Cargando...</div>;

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
