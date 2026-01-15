// src/components/common/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	const socialMedia = [
		{
			name: "Facebook",
			url: "https://www.facebook.com/oleohidraulicservices/",
			icon: "lab la-facebook-f",
			faIcon: "fab fa-facebook-f", // Font Awesome alternativo
		},
		{
			name: "Twitter",
			url: "https://twitter.com/Oleohidraulics",
			icon: "lab la-twitter",
			faIcon: "fab fa-twitter",
		},
		{
			name: "Instagram",
			url: "https://www.instagram.com/oleohidraulic_services/",
			icon: "lab la-instagram",
			faIcon: "fab fa-instagram",
		},
		{
			name: "LinkedIn",
			url: "https://www.linkedin.com/company/oleohidraulics-services-s-a-c/",
			icon: "lab la-linkedin-in",
			faIcon: "fab fa-linkedin-in",
		},
	];

	return (
		<footer className="bg-white">
			<div className="container">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 lg:grid-cols-12 pb-10 lg:pb-16 gap-y-6 lg:gap-14">
					{/* Contact Section */}
					<div className="col-span-1 lg:col-span-6">
						<h4 className="font-bold xl:text-lg mb-6 2xl:mb-8">Contáctanos</h4>
						<div className="w-full flex flex-wrap space-y-4">
							<p className="w-full">
								Calle Carlos Gutierrez Noriega 185 La Victoria, Lima - Perú.
							</p>
							<p className="w-full">ventas@oleohidraulic.com</p>
							<p className="w-full">lbravo@oleohidraulic.com</p>
							<p className="w-full">ccontreras@oleohidraulic.com</p>
						</div>
					</div>

					{/* Phone Numbers */}
					<div className="col-span-1 lg:col-span-3 flex items-end mb-4 lg:mb-0">
						<div className="w-full flex flex-wrap space-y-4">
							<p className="w-full">(511) 323-2264</p>
							<p className="w-full">
								+51 989 076 522 - +51 987 582 405 - +51 981 276 880
							</p>
						</div>
					</div>

					{/* Social Media */}
					<div className="col-span-1 lg:col-span-3">
						<h4 className="font-bold xl:text-lg mb-6 2xl:mb-8">Síguenos</h4>
						<div className="flex space-x-2 justify-center lg:justify-start">
							{socialMedia.map((social) => (
								<a
									key={social.name}
									href={social.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex rounded-full w-14 h-14 hover:bg-orange-primary hover:text-white transition-colors items-center justify-center border-2 border-gray-300 hover:border-orange-primary"
									aria-label={`Visitar ${social.name}`}
								>
									{/* Intentar con Line Awesome primero */}
									<i
										className={`${social.icon} text-xl md:text-2xl 2xl:text-3xl`}
									></i>
									{/* Fallback con Font Awesome si Line Awesome no funciona */}
									{/* <i className={`${social.faIcon} text-xl md:text-2xl 2xl:text-3xl`}></i> */}
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Policies Section */}
				<div className="grid grid-cols-1 lg:grid-cols-12 pb-16 gap-y-4 lg:gap-x-14">
					<div className="col-span-1 lg:col-span-6">
						<h4 className="font-bold xl:text-lg mb-6 2xl:mb-8">Políticas</h4>
						<Link
							to="/terminos-y-condiciones"
							className="hover:text-blue-primary transition-colors"
						>
							Términos y condiciones
						</Link>
					</div>
					<div className="col-span-1 lg:col-span-3 flex items-end">
						<Link
							to="/politica-de-privacidad"
							className="hover:text-blue-primary transition-colors"
						>
							Políticas de Privacidad
						</Link>
					</div>
					<div className="col-span-1 lg:col-span-3 flex items-end">
						<Link
							to="/uso-de-datos"
							className="hover:text-blue-primary transition-colors"
						>
							Uso de datos
						</Link>
					</div>
				</div>

				{/* Copyright Section */}
				<div className="border-t flex flex-col space-y-2 text-center md:space-y-0 md:flex-row md:justify-between py-3">
					<p className="text-xs">
						© {currentYear} Oleohidraulics Services S.A.C.. TODOS LOS DERECHOS
						RESERVADOS.
					</p>
					<a
						href="https://www.agenciamk.com/"
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center"
					>
						<span className="text-xs mr-2">AGENCIA DE MARKETING DIGITAL</span>
						<img
							src="/images/logo-mk.svg"
							className="w-5 h-4"
							alt="agenciamk"
							onError={(e) => {
								// Fallback si la imagen no carga
								e.currentTarget.style.display = "none";
							}}
						/>
					</a>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
