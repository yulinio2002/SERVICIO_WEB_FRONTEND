// src/components/product/ProductCard.tsx
import { Link } from "react-router-dom";
import type { ProductItem } from "@interfaces/product/ProductTypes";

type Props = {
	product: ProductItem;
	onQuoteClick?: () => void;
};

export default function ProductCard({ product, onQuoteClick }: Props) {
	// Función para redirigir a la página de detalles
	const handleQuoteClick = (e: React.MouseEvent) => {
		if (onQuoteClick) {
			e.preventDefault();
			onQuoteClick();
		}
	};

	return (
		<article className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
			{/* Imagen */}
			<div className="relative overflow-hidden h-64">
				<img
					src={product.image.src}
					alt={product.image.alt}
					loading="lazy"
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				{/* Badge de categoría */}
				<div className="absolute top-4 left-4">
					<span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
						{product.categoryTitle}
					</span>
				</div>
			</div>

			{/* Contenido */}
			<div className="p-6">
				{/* Marca */}
				{product.marca && (
					<div className="mb-2">
						<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-orange-500 border border-blue-200">
							<i className="las la-tag mr-1"></i>
							{product.marca}
						</span>
					</div>
				)}

				{/* Título */}
				<h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
					{product.title}
				</h3>

				{/* Descripción */}
				<p className="text-gray-600 text-sm mb-4 line-clamp-2">
					{product.description}
				</p>

				{/* Características principales */}
				<div className="mb-6">
					<ul className="space-y-1">
						{product.features.slice(0, 2).map((feature, index) => (
							<li
								key={index}
								className="flex items-start text-sm text-gray-700"
							>
								<i className="las la-check text-black mt-0.5 mr-2"></i>
								<span>{feature}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Acciones */}
				<div className="flex items-center justify-between pt-4 border-t border-gray-100">
					<Link
						to={`/producto/${product.slug}`}
						className="text-orange-500 hover:text-orange-700 font-medium text-sm inline-flex items-center transition-colors"
					>
						Ver detalles
						<i className="las la-arrow-right ml-1"></i>
					</Link>

					<button
						onClick={handleQuoteClick}
						className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
					>
						<i className="las la-quote-right mr-2"></i>
						Cotizar
					</button>
				</div>
			</div>
		</article>
	);
}
