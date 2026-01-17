// src/components/product/ProductsGrid.tsx
import type { ProductItem } from "@interfaces/product/ProductTypes";
import ProductCard from "./ProductCard";

type Props = {
	products: ProductItem[];
	categoryTitle?: string;
	onQuoteClick?: (product: ProductItem) => void;
};

export default function ProductsGrid({
	products,
	categoryTitle,
	onQuoteClick,
}: Props) {
	return (
		<>
			{categoryTitle && (
				<div className="mb-10">
					<h2 className="text-2xl font-bold text-gray-800">
						Productos en{" "}
						<span className="text-orange-500">{categoryTitle}</span>
					</h2>
					<div className="h-1 w-20 bg-orange-500 mt-2"></div>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-16">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						onQuoteClick={() => onQuoteClick && onQuoteClick(product)}
					/>
				))}
			</div>
		</>
	);
}
