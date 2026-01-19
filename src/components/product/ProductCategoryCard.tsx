// src/components/product/ProductCategoryCard.tsx
import { Link } from "react-router-dom";
import type { ProductCategoryCard as Card } from "@interfaces/product/ProductTypes";

type Props = {
	item: Card;
	linkTo?: string;
};

export default function ProductCategoryCard({ item, linkTo }: Props) {
	const to = linkTo ?? `/productos/${item.slug}`;

	return (
		<article className="group">
			<Link to={to} className="block">
				{/* Imagen grande */}
				<div className="overflow-hidden rounded-[26px]">
					<img
						src={item.image.src}
						alt={item.image.alt}
						loading="lazy"
						className="w-full h-[240px] sm:h-[280px] lg:h-[320px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
					/>
				</div>

				{item.subtitle && (
					<p className="mt-6 text-orange-500 font-extrabold text-lg leading-none uppercase">
						{item.subtitle}
					</p>
				)}

				{/* Título */}
				<h3 className="mt-6 text-xl sm:text-2xl font-extrabold tracking-tight">
					{item.title}
				</h3>

				{/* Link "Ver Productos" + botón circular */}
				<div className="mt-6 flex items-center gap-4">
					<span className="text-slate-700 font-medium">Ver Productos</span>

					<div className="h-6 w-6 rounded-full bg-blue-900 flex items-center justify-center ml-3 group-hover:bg-orange-600 transition-colors duration-300">
						<i className="las la-angle-right text-white text-xs"></i>
					</div>
				</div>
			</Link>
		</article>
	);
}
