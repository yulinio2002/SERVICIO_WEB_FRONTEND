import { Link } from "react-router-dom";
import type { ProductCategoryCard as Card } from "@interfaces/product/ProductTypes";
import QuoteButton from "@components/common/QuoteButton.tsx";

type Props = {
	item: Card;
	onQuoteClick?: () => void;
};

export default function ProductCategoryCard({ item, onQuoteClick }: Props) {
	return (
		<article className="group">
			<Link to={`/productos/${item.slug}`} className="block">
				{/* Imagen grande con bordes redondeados */}
				<div className="overflow-hidden rounded-[26px]">
					<img
						src={item.image.src}
						alt={item.image.alt}
						loading="lazy"
						className="w-full h-[240px] sm:h-[280px] lg:h-[320px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
					/>
				</div>

				{/* Marca */}
				{item.marca && (
					<h2 className="mt-6 text-xl sm:text-1xl font-bold tracking-tight text-orange-500">
						{item.marca}
					</h2>
				)}

				{/* Título */}
				<h3 className="mt-6 text-xl sm:text-2xl font-extrabold tracking-tight">
					{item.title}
				</h3>

				{/* Link con botón circular */}
				{/* Botón Cotizar */}
				<div className="mt-10">
					<QuoteButton onClick={onQuoteClick} text="Cotizar" className="mt-4" />
				</div>
			</Link>
		</article>
	);
}
