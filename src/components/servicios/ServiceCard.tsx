
// src/components/servicios/ServiceCard.tsx
import React from "react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
	id: number;
	title: string;
	slug: string;
	description: string;
	image: string;
	icon?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
	title,
	slug,
	description,
	image,
	icon,
}) => {
	return (
		<div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
			{/* Image */}
			<div className="relative h-48 overflow-hidden">
				<img
					src={image}
					alt={title}
					className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
				/>
				{icon && (
					<div className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md">
						<i className={`${icon} text-2xl text-blue-primary`}></i>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-6">
				<h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-primary transition-colors">
					{title}
				</h3>
				<p className="text-gray-600 mb-4 line-clamp-3">{description}</p>
				<Link
					to={`/servicios/${slug}`}
					className="inline-flex items-center text-blue-primary font-semibold hover:text-orange-primary transition-colors"
				>
					Ver más
					<i className="las la-arrow-right ml-2"></i>
				</Link>
			</div>
		</div>
	);
};

export default ServiceCard;


