// src/components/common/ProductsDropdown.tsx
import React from "react";
import { Link } from "react-router-dom";

interface ProductsDropdown {
	onClose: () => void;
}

const ProductsDropdown: React.FC<ProductsDropdown> = ({ onClose }) => {
	const categorias = [
		"Abrazaderas",
		"Accesorios Hidráulicos",
		"Acumuladores Hidráulicos",
		"Bombas Hidráulicas",
		"Diagtronics",
		"Enfriadores Hidráulicos",
		"Filtros Hidráulicos",
		"Motores Hidráulicos",
		"Presostatos",
		"Radio Control",
		"Tubería Hidráulica Sin Soldadura",
		"Válvulas hidráulicas",
	];

	const marcas = [
		"Atos",
		"Danfoss Eaton",
		"Dropsa",
		"Emmegi Heat Exchangers",
		"Fluid Power Technology",
		"Linde",
		"Marzocchi Pumps",
		"OLEOHIDRAULICS SERVICES",
		"OMT",
		"Scanreco",
		"STAUFF",
		"Sun Hydraulics",
		"Tube Mac - Piping Technologies",
	];

	return (
		<>
			{/* Backdrop */}
			<div
				onClick={onClose}
				className="fixed border-t inset-0 h-full w-full z-10"
			/>

			{/* Dropdown Content */}
			<div className="absolute border rounded-2xl py-10 px-10 w-full left-1/2 transform -translate-x-1/2 bg-white overflow-hidden shadow-xl top-[100px] z-20">
				<div className="container">
					<div className="grid grid-cols-12 gap-14">
						{/* Funcionalidad Column */}
						<div className="col-span-6">
							<Link
								to="/productos"
								className="block font-bold border-b border-gray-primary mb-6 pb-6"
								onClick={onClose}
							>
								PRODUCTOS
							</Link>
							<div className="grid grid-cols-2 gap-3 text-sm xl:text-base">
								{categorias.map((item) => (
									<Link
										key={item}
										to={`/productos/${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, "_")}`}
										className="hover:font-bold"
										onClick={onClose}
									>
										{item}
									</Link>
								))}
							</div>
						</div>

						{/* Marcas Column */}
						<div className="col-span-6">
							<Link
								to="/marcas"
								className="block font-bold border-b border-gray-primary mb-6 pb-6"
								onClick={onClose}
							>
								MARCAS
							</Link>
							<div className="grid grid-cols-2 gap-3 text-sm xl:text-base">
								{marcas.map((marca) => (
									<Link
										key={marca}
										to={`/marcas/${marca.toLowerCase().replace(/\s+/g, "-")}`}
										className="hover:font-bold"
										onClick={onClose}
									>
										{marca}
									</Link>
								))}
							</div>
						</div>

						{/* Ver Productos Link */}
						<div className="col-span-12">
							<Link
								to="/productos"
								className="absolute right-14 bottom-8 flex items-center"
								onClick={onClose}
							>
								<div className="view-more">
									<span>Ver Productos</span>
									<div>
										<i className="las la-angle-right"></i>
									</div>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductsDropdown;
