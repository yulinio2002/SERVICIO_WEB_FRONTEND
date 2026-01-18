// src/pages/Servicios.tsx
import React from "react";
import type { ServiceSummary } from "@interfaces/servicio/Service.ts";
import ServiceList from "@components/servicios/ServiceList";

const Servicios: React.FC = () => {
	const services: ServiceSummary[] = [
		{
			id: 1,
			title: "Fabricación de Sistemas",
			slug: "fabricacion-de-sistemas",
			description: "",
			image: "/images/img1.jpg",
		},
		{
			id: 2,
			title: "Control y Automatización",
			slug: "control-y-automatizacion",
			description: "",
			image: "/images/img2.jpg",
		},
		{
			id: 3,
			title: "Fabricación de Piezas a Medida",
			slug: "fabricacion-de-piezas-a-medida",
			description: "",
			image: "/images/img3.jpg",
		},
		{
			id: 4,
			title: "Suministro e Instalación de Tuberías",
			slug: "suministro-e-instalacion-de-tuberias",
			description: "",
			image: "/images/img1.jpg",
		},
	];

	return (
		<div className="bg-white">
			{/* Hero */}
			<section className="mt-5 md:mt-15">
				<div className="container">
					<p className="mt-6 text-center text-lg font-extrabold tracking-widest">
						NUESTROS SERVICIOS
					</p>

					<p className="mt-6 text-center font-extrabold tracking-tight text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-5xl mx-auto">
						Capacidad y experiencia en soluciones oleohidráulicas
						<br />
						de calidad
					</p>

					<p className="mt-6 text-center text-slate-600 max-w-3xl mx-auto">
						Contamos con el mejor equipo de profesionales capacitados para idear
						y diseñar la mejor solución a sus sistemas oleohidráulicos.
					</p>

					{/* Two big images
					<div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="overflow-hidden rounded-[28px]">
							<img
								src="/images/services/hero-left.jpg"
								alt="Servicio - imagen 1"
								className="w-full h-[260px] sm:h-[320px] object-cover"
							/>
						</div>
						<div className="overflow-hidden rounded-[28px]">
							<img
								src="/images/services/hero-right.jpg"
								alt="Servicio - imagen 2"
								className="w-full h-[260px] sm:h-[320px] object-cover"
							/>
						</div>
					</div> */}
				</div>
			</section>

			{/* Cards */}
			<section className="pt-14 pb-16">
				<div className="container">
					<ServiceList services={services} />
				</div>
			</section>
		</div>
	);
};

export default Servicios;
