// src/components/common/Footer.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listarEmpresas } from "../../services/empresa/Empresa";
import type { Empresa } from "../../interfaces/empresa/Empresa";
import { getAllUsers, type UserWithContact } from "../../services/auth/getAll";

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();

	const [empresa, setEmpresa] = useState<Empresa | null>(null);
	const [, setLoadingEmpresa] = useState(true);

	const [users, setUsers] = useState<UserWithContact[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(true);

	useEffect(() => {
		const fetchEmpresa = async () => {
			try {
				const empresas = await listarEmpresas();
				if (empresas.length > 0) setEmpresa(empresas[0]);
			} catch (error) {
				console.error("Error al cargar datos de la empresa:", error);
			} finally {
				setLoadingEmpresa(false);
			}
		};

		fetchEmpresa();
	}, []);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const data = await getAllUsers();
				setUsers(data);
			} catch (error) {
				console.error("Error al cargar usuarios:", error);
			} finally {
				setLoadingUsers(false);
			}
		};

		fetchUsers();
	}, []);

	// Pares email-teléfono por usuario (deduplicado)
	const contacts = useMemo(() => {
		const map = new Map<string, { email: string; phone: string }>();

		users.forEach((u) => {
			const email = (u.email ?? "").trim();
			const phone = (u.persona?.telefono ?? "").trim();

			// Si no hay ninguno, no agregamos
			if (!email && !phone) return;

			const key = `${email}__${phone}`;
			if (!map.has(key)) map.set(key, { email, phone });
		});

		return Array.from(map.values());
	}, [users]);

	const socialMedia = [
		{ name: "Facebook", url: "#", icon: "lab la-facebook-f" },
		{ name: "Twitter", url: "#", icon: "lab la-twitter" },
		{ name: "Instagram", url: "#", icon: "lab la-instagram" },
		{ name: "LinkedIn", url: "#", icon: "lab la-linkedin-in" },
	];

	return (
		<footer className="bg-white">
			<div className="container px-5 md:px-7 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 pb-10 lg:pb-16 gap-y-6 lg:gap-14">
					{/* Contact Section */}
					<div className="col-span-1 lg:col-span-9 lg:ml-8">
						<h4 className="font-bold xl:text-lg mb-6 2xl:mb-8">Contáctanos</h4>

						{/* Dirección + contactos (email | teléfono alineados por fila) */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-x-16 w-full">
							<p className="sm:col-span-2 whitespace-pre-line">
								{empresa?.direccion || "Dirección no disponible"}
							</p>

							{loadingUsers ? (
								<p className="sm:col-span-2">Cargando contactos...</p>
							) : contacts.length > 0 ? (
								contacts.map((c, idx) => (
									<React.Fragment key={`${c.email}-${c.phone}-${idx}`}>
										<p className="break-words">
											{c.email || "Email no disponible"}
										</p>
										<p className="sm:text-left">
											{c.phone || "Teléfono no disponible"}
										</p>
									</React.Fragment>
								))
							) : (
								<p className="sm:col-span-2">Contactos no disponibles</p>
							)}
						</div>
					</div>

					{/* Social Media */}
					<div className="col-span-1 lg:col-span-3">
						<h4 className="font-bold xl:text-lg mb-6 2xl:mb-8">Síguenos</h4>
						<div className="flex space-x-2 justify-start">
							{socialMedia.map((social) => (
								<a
									key={social.name}
									href={social.url}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex rounded-full w-14 h-14 hover:bg-orange-primary hover:text-white transition-colors items-center justify-center border-2 border-gray-300 hover:border-orange-primary"
									aria-label={`Visitar ${social.name}`}
								>
									<i
										className={`${social.icon} text-xl md:text-2xl 2xl:text-3xl`}
									/>
								</a>
							))}
						</div>
					</div>
				</div>

				{/* Policies */}
				<div className="grid grid-cols-1 lg:grid-cols-12 pb-16 gap-y-4 lg:gap-x-14">
					<div className="col-span-1 lg:col-span-6 lg:ml-8">
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

				{/* Copyright */}
				<div className="border-t flex flex-col space-y-2 text-center md:space-y-0 md:flex-row md:justify-between py-3 lg:ml-8">
					<p className="text-xs">
						© {currentYear} A&D Oleohidraulicos S.A.C.. TODOS LOS DERECHOS
						RESERVADOS.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
