// src/pages/ServicioDetalle.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ServiceGallery from "@components/servicios/ServiceGallery";
import QuoteForm from "@components/servicios/QuoteForm";
import type { Service } from "@interfaces/servicio/Service.ts";
import QuoteButton from "@components/common/QuoteButton.tsx";
import { obtenerServicioPorSlug } from "@services/servicio/Servicio.ts";

const ServicioDetalle: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const [service, setService] = useState<Service | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Scroll to top when component mounts
		window.scrollTo(0, 0);

		// Fetch service data
		fetchServiceData();
	}, [slug]);

	const fetchServiceData = async () => {
		setLoading(true);
		try {
			if (!slug) {
				throw new Error("Slug no proporcionado");
			}

			// Usar la nueva función que aprovecha la cache
			const data = await obtenerServicioPorSlug(slug);
			setService(data);
		} catch (error) {
			console.error("Error fetching service:", error);
			setService(null);
		} finally {
			setLoading(false);
		}
	};

	const scrollToForm = () => {
		const formElement = document.getElementById("form");
		if (formElement) {
			formElement.scrollIntoView({ behavior: "smooth" });
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary mx-auto"></div>
					<p className="mt-4 text-gray-600">Cargando...</p>
				</div>
			</div>
		);
	}

	if (!service) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h2 className="text-2xl font-bold mb-4">Servicio no encontrado</h2>
					<p className="text-gray-600">
						El servicio que buscas no existe o ha sido eliminado.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="pt-20">
			{/* Hero Banner */}
			<section className="pt-4 pb-0 w-full">
				<div className="container">
					<div
						className="w-full h-24 sm:h-48 md:h-60 lg:h-72 xl:h-88 2xl:h-98 rounded-2xl bg-cover bg-center bg-no-repeat"
						style={{ backgroundImage: `url(${service.images[0]})` }}
					/>
				</div>
			</section>

			{/* Service Content */}
			<section className="bg-white">
				<div className="container">
					<p className="mt-6 text-center text-lg font-extrabold tracking-widest">
						Nuestro Servicio
					</p>

					<p className="title-xl text-center font-extrabold text-1xl sm:text-2xl lg:text-3xl w-full max-w-4xl m-auto mb-6 2xl:mb-7">
						{service.title}
					</p>
					<div className="html max-w-6xl m-auto text-center mb-10">
						<p className="mb-4">{service.description}</p>
						<p className="mb-6">{service.content}</p>
						<ul className="text-left max-w-3xl mx-auto space-y-2">
							{service.features.map((feature, index) => (
								<li key={index} className="flex items-start">
									<span className="text-blue-primary mr-2">•</span>
									<span>{feature}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="flex w-full justify-center">
						<QuoteButton onClick={scrollToForm} />
					</div>
				</div>
			</section>

			{/* Gallery */}
			<ServiceGallery images={service.galleryImages} />

			{/* Quote Form */}
			<QuoteForm serviceTitle={service.title} serviceId={service.id} />
		</div>
	);
};

export default ServicioDetalle;
