// src/components/servicios/ServiceList.tsx
import React from "react";
import ServiceCard from "./ServiceCard";
import type { ServiceSummary } from "@interfaces/servicio/Service";

interface ServiceListProps {
	services: ServiceSummary[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
			{services.map((service) => (
				<ServiceCard key={service.id} {...service} />
			))}
		</div>
	);
};

export default ServiceList;
