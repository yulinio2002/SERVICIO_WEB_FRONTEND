// src/components/servicios/ServiceCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
	id: number;
	title: string;
	slug: string;
	description: string;
	image: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, slug, image }) => {
	return (
		<div className="group">
			<Link to={`/servicios/${slug}`} className="block">
				<div className="overflow-hidden rounded-[28px]">
					<img
						src={image}
						alt={title}
						className="w-full h-[240px] sm:h-[300px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
					/>
				</div>

				<h3 className="mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight">
					{title}
				</h3>

				<div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-700 group-hover:text-slate-900">
					Ver Servicios
					<span aria-hidden className="text-lg leading-none">
						›
					</span>
				</div>
			</Link>
		</div>
	);
};

export default ServiceCard;
