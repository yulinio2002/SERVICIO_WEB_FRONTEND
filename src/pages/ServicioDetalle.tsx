// src/pages/ServicioDetalle.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ServiceGallery from '@components/servicios/ServiceGallery';
import QuoteForm from '@components/servicios/QuoteForm';
import type { Service } from '@interfaces/servicio/Service';

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
			// Aquí iría la llamada a tu API
			// const data = await servicioService.getBySlug(slug);

			// Mock data
			const mockService: Service = {
				id: 3,
				title: 'Diseño y Consultoría',
				slug: 'diseno-y-consultoria',
				subtitle: 'NUESTROS SERVICIOS',
				description: '¿Tu proyecto necesita hidráulica?',
				content: `Contacta con nosotros, desde el primer paso te guiaremos desde la etapa conceptual o ingeniería básica y a través de todo el proceso de diseño. Nuestro Staff de profesionales lo guiaran hasta obtener la mejor solución a su necesidad.`,
				features: [
					'Cálculos: Potencia mecánica, fuerza, velocidad y exigencias (estáticas y dinámicas)',
					'Selección del actuador',
					'Cálculos de mecánica de fluidos',
					'Cálculos de disipación de calor',
					'Diagrama hidráulico y lista de materiales (BOM)',
					'Dimensionamiento y selección de componentes',
					'Isométrico de tuberías',
					'CAD 3D',
					'Documentación técnica',
				],
				images: ['/images/service-banner.jpg'],
				galleryImages: [
					{ id: 1, url: '/images/img1.jpg', alt: 'Proyecto 1' },
					{ id: 2, url: '/images/img2.jpg', alt: 'Proyecto 2' },
					{ id: 3, url: '/images/img3.jpg', alt: 'Proyecto 3' },
				],
			};

			setService(mockService);
		} catch (error) {
			console.error('Error fetching service:', error);
		} finally {
			setLoading(false);
		}
	};

	const scrollToForm = () => {
		const formElement = document.getElementById('form');
		if (formElement) {
			formElement.scrollIntoView({ behavior: 'smooth' });
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
					<p className="subtitle text-center mb-4 2xl:mb-5">{service.subtitle}</p>
					<h1 className="title-xl text-center w-full max-w-4xl m-auto mb-6 2xl:mb-7">
						{service.title}
					</h1>
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
						<button
							onClick={scrollToForm}
							className="flex items-center group"
						>
							<div className="view-more">
								<span>Cotizar</span>
								<div>
									<i className="las la-angle-right"></i>
								</div>
							</div>
						</button>
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
