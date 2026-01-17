import React from "react";
import { Link } from "react-router-dom";
import WhatsAppButton from "@components/common/WhatsAppButton";

const NotFound: React.FC = () => {
	return (
		<>
			{/* Contenido principal con padding superior para el header fijo */}
			<main className="flex-grow pt-24 lg:pt-32">
				<div className="container">
					<div className="max-w-4xl mx-auto text-center py-12 lg:py-20">
						{/* Número 404 grande */}
						<h1 className="text-8xl lg:text-9xl font-bold text-blue-primary mb-4">
							404
						</h1>

						{/* Título */}
						<h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
							Página no encontrada
						</h2>

						{/* Descripción */}
						<p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
							Lo sentimos, la página que estás buscando no existe o ha sido
							movida.
						</p>

						{/* Opciones de navegación */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link
								to="/"
								className="inline-flex items-center justify-center px-6 py-3 bg-blue-primary text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
								</svg>
								Volver al inicio
							</Link>

							<Link
								to="/contacto"
								className="inline-flex items-center justify-center px-6 py-3 border border-blue-primary text-blue-primary font-medium rounded-md hover:bg-blue-50 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 mr-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
									<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
								</svg>
								Contactar soporte
							</Link>
						</div>

						{/* Sección de enlaces útiles */}
						<div className="mt-12 pt-8 border-t border-gray-200">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Enlaces que te pueden interesar
							</h3>
							<div className="flex flex-wrap justify-center gap-4">
								<Link
									to="/servicios"
									className="text-blue-primary hover:text-blue-700 hover:underline"
								>
									Nuestros Servicios
								</Link>
								<span className="text-gray-300">•</span>
								<Link
									to="/productos"
									className="text-blue-primary hover:text-blue-700 hover:underline"
								>
									Productos
								</Link>
								<span className="text-gray-300">•</span>
								<Link
									to="/proyectos"
									className="text-blue-primary hover:text-blue-700 hover:underline"
								>
									Proyectos
								</Link>
								<span className="text-gray-300">•</span>
								<Link
									to="/nosotros"
									className="text-blue-primary hover:text-blue-700 hover:underline"
								>
									Sobre Nosotros
								</Link>
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* Botón de WhatsApp (manteniendo consistencia con otras páginas) */}
			<WhatsAppButton />
		</>
	);
};

export default NotFound;
