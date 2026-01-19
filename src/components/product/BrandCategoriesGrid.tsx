import type { ProductCategoryCard } from "@interfaces/product/ProductTypes";
import ProductCategoryCardItem from "@components/product/ProductCategoryCard";

export default function BrandCategoriesGrid({
	items,
	brandSlug,
}: {
	items: ProductCategoryCard[];
	brandSlug: string;
}) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
			{items.map((item) => (
				<ProductCategoryCardItem
					key={item.id}
					item={item}
					linkTo={`/marcas/${brandSlug}/${item.slug}`}
				/>
			))}
		</div>
	);
}
