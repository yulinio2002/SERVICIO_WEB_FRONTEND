// src/components/common/MobileMenu.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface MobileMenuProps {
	onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
	const [productsOpen, setProductsOpen] = useState(false);

	return (
		<>
			{/* Backdrop */}
			<div
				onClick={onClose}
				className="fixed border-t inset-0 h-full w-full z-10 bg-black bg-opacity-50"
			/>

			{/* Sidebar */}
			<div className="fixed flex w-11/12 sm:w-full max-w-xs flex-col space-y-4 bg-white left-0 top-0 h-screen py-7 px-8 z-20 animate-slide-in">
				{/* Close Button */}
				<button
					onClick={onClose}
					className="absolute right-4 top-4 p-2 bg-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>

				{/* Menu Items */}
				<Link to="/nosotros" className="font-medium" onClick={onClose}>
					NOSOTROS
				</Link>

				<button
					onClick={() => setProductsOpen(!productsOpen)}
					className="font-medium text-left"
				>
					PRODUCTOS
				</button>

				{productsOpen && (
					<div className="flex flex-col pl-2 space-y-2">
						<Link to="/funcionalidad" className="font-medium" onClick={onClose}>
							FUNCIONALIDAD
						</Link>
						<Link to="/marcas" className="font-medium" onClick={onClose}>
							MARCAS
						</Link>
					</div>
				)}

				<Link to="/servicios" className="font-medium" onClick={onClose}>
					SERVICIOS
				</Link>

				<Link to="/proyectos" className="font-medium" onClick={onClose}>
					PROYECTOS
				</Link>

				<Link to="/contacto" className="font-medium" onClick={onClose}>
					CONTACTO
				</Link>
			</div>
		</>
	);
};

export default MobileMenu;
