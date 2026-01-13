// src/components/common/Header.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductsDropdown from "./ProductsDropdown";
import MobileMenu from "./MobileMenu";

const Header: React.FC = () => {
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const location = useLocation();

	const isActive = (path: string): boolean => {
		return location.pathname === path || location.pathname.startsWith(path);
	};

	const navItems = [
		{ label: "NOSOTROS", path: "/nosotros" },
		{ label: "PRODUCTOS", path: "#", hasDropdown: true },
		{ label: "SERVICIOS", path: "/servicios" },
		{ label: "PROYECTOS", path: "/proyectos" },
		{ label: "CONTACTO", path: "/contacto" },
	];

	return (
		<header className="fixed w-full top-0 bg-white z-50 shadow-sm">
			<div className="container">
				<div className="flex py-3 2xl:py-6 justify-between relative items-center">
					{/* Logo */}
					<Link to="/" className="flex items-center mb-0">
						<img
							src="src/images/logo.jpeg"
							className="h-14 lg:h-14 2xl:h-20 w-auto"
							alt="Oleohidraulics"
						/>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex flex-wrap font-medium lg:items-center text-sm 2xl:text-xl lg:justify-center">
						{navItems.map((item) => (
							<React.Fragment key={item.label}>
								{item.hasDropdown ? (
									<button
										onClick={() => setDropdownOpen(!dropdownOpen)}
										className="relative mx-3 group hover:font-bold"
									>
										{item.label}
										<div className="absolute block bottom-0 left-0 w-0 h-px bg-gray-primary group-hover:w-full transition-all ease-in-out duration-400"></div>
									</button>
								) : (
									<Link
										to={item.path}
										className={`relative mx-3 group hover:font-bold ${
											isActive(item.path) ? "active font-bold" : ""
										}`}
									>
										{item.label}
										<div className="absolute block bottom-0 left-0 w-0 h-px bg-gray-primary group-hover:w-full transition-all ease-in-out duration-400"></div>
									</Link>
								)}
							</React.Fragment>
						))}
					</nav>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setMobileMenuOpen(true)}
						className="lg:hidden rounded-lg bg-blue-primary right-0 top-5 flex items-center justify-center h-10 w-10"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Products Dropdown */}
			{dropdownOpen && (
				<ProductsDropdown onClose={() => setDropdownOpen(false)} />
			)}

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<MobileMenu onClose={() => setMobileMenuOpen(false)} />
			)}
		</header>
	);
};

export default Header;
