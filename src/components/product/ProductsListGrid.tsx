import type { ProductItem } from "@interfaces/product/ProductTypes";
import ProductCategoryCard from "@components/product/ProductCategoryCard.tsx";

type Props = {
	products: ProductItem[];
};

export default function ProductsListGrid({ products }: Props) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
			{products.map((p) => (
				<ProductCategoryCard
					key={p.id}
					item={{ ...p, subtitle: p.marca }}
					linkTo={`/producto/${p.slug}`}
				/>
			))}
		</div>
	);
}
