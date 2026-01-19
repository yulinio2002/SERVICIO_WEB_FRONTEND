// src/components/common/Footer.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarEmpresas } from "../../services/empresa/Empresa";
import type { Empresa } from "../../interfaces/empresa/Empresa";

import { getAllUsers, type UserWithContact } from "../../services/auth/getAll";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);

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

  const emails = Array.from(
    new Set(users.map((u) => u.email).filter(Boolean))
  );
  const phones = Array.from(
    new Set(users.map((u) => u.persona?.telefono).filter(Boolean))
  );

  const socialMedia = [
    { name: "Facebook", url: "#", icon: "lab la-facebook-f", faIcon: "fab fa-facebook-f" },
    { name: "Twitter", url: "#", icon: "lab la-twitter", faIcon: "fab fa-twitter" },
    { name: "Instagram", url: "#", icon: "lab la-instagram", faIcon: "fab fa-instagram" },
    { name: "LinkedIn", url: "#", icon: "lab la-linkedin-in", faIcon: "fab fa-linkedin-in" },
  ];

  return (
    <footer className="bg-white">
      <div className="container px-5 md:px-7 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 pb-10 lg:pb-16 gap-y-6 lg:gap-14">
          {/* Contact Section */}
          <div className="col-span-1 lg:col-span-6 lg:ml-8">
            <h4 className="font-bold xl:text-lg mb-6 2xl:mb-8">Contáctanos</h4>

			<div className="grid grid-cols-2 gap-4 w-full">
			  {/* Column 1: Address and Emails */}
			  <div className="flex flex-col space-y-4">
				<p>
				  {empresa?.direccion || "Información no disponible"}
				</p>

				{/* Emails desde API */}
				{loadingUsers ? (
				  <p>Cargando emails...</p>
				) : emails.length > 0 ? (
				  emails.map((e) => (
					<p key={e}>
					  {e}
					</p>
				  ))
				) : (
				  <p>Emails no disponibles</p>
				)}
			  </div>

			  {/* Column 2: Phones */}
			  <div className="flex flex-col space-y-4">
				{/* Teléfonos desde API */}
				{loadingUsers ? (
				  <p>Cargando teléfonos...</p>
				) : phones.length > 0 ? (
				  phones.map((p) => (
					<p key={p}>
					  {p}
					</p>
				  ))
				) : (
				  <p>Teléfonos no disponibles</p>
				)}
			  </div>
			</div>
          </div>

          {/* Phone Numbers */}
          <div className="col-span-1 lg:col-span-3 flex items-end mb-4 lg:mb-0">
            <div className="w-full flex flex-wrap space-y-4">
              {/* Los teléfonos ya se muestran arriba en la sección de contacto */}
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
                  <i className={`${social.icon} text-xl md:text-2xl 2xl:text-3xl`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Policies */}
        <div className="grid grid-cols-1 lg:grid-cols-12 pb-16 gap-y-4 lg:gap-x-14">
          <div className="col-span-1 lg:col-span-6 lg:ml-8">
            <h4 className="font-bold xl:text-lg mb-6 2xl:mb-8">Políticas</h4>
            <Link to="/terminos-y-condiciones" className="hover:text-blue-primary transition-colors">
              Términos y condiciones
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-3 flex items-end">
            <Link to="/politica-de-privacidad" className="hover:text-blue-primary transition-colors">
              Políticas de Privacidad
            </Link>
          </div>
          <div className="col-span-1 lg:col-span-3 flex items-end">
            <Link to="/uso-de-datos" className="hover:text-blue-primary transition-colors">
              Uso de datos
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t flex flex-col space-y-2 text-center md:space-y-0 md:flex-row md:justify-between py-3 lg:ml-8">
          <p className="text-xs">
            © {currentYear} A&D Oleohidraulicos S.A.C.. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
