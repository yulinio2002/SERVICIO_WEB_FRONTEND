// src/router/AppRouter.tsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";
import WhatsAppButton from "@components/common/WhatsAppButton";

// Pages
import Home from "@pages/Home.tsx";
import Nosotros from "@pages/Nosotros.tsx";
import Servicios from "@pages/Servicios";
import ServicioDetalle from "@pages/ServicioDetalle";
import NotFound from "@pages/NotFound.tsx";
import Projects from "@pages/Projects.tsx";
import Admin from "@pages/Admin.tsx";
import Contacto from "@pages/Contacto";
import LoginForm from "@components/auth/LoginForm.tsx";
import Productos from "@pages/Productos.tsx";
import ProductosCategoria from "@pages/ProductosCategoria.tsx";
import ProductoDetalle from "@pages/ProductoDetalle.tsx";
import MarcaCategorias from "@pages/MarcaCategorias.tsx";
import MarcaCategoriaProductos from "@pages/MarcaCategoriaProductos.tsx";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const location = useLocation();
	const hideHeaderFooter = ["/login", "/admin"].includes(location.pathname);

	return (
		<div className="flex flex-col min-h-screen">
			{!hideHeaderFooter && <Header />}
			<main
				className="flex-grow px-5 md:px-7 lg:px-16"
				style={{ paddingTop: hideHeaderFooter ? "0" : "var(--header-height)" }}
			>
				{children}
			</main>
			{!hideHeaderFooter && <Footer />}
			<WhatsAppButton />
		</div>
	);
};


const AppRouter: React.FC = () => {
	return (
		<BrowserRouter>
			<Layout>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/nosotros" element={<Nosotros />} />
						<Route path="/servicios" element={<Servicios />} />
						<Route path="/servicios/:slug" element={<ServicioDetalle />} />
						<Route path="/proyectos" element={<Projects />} />
						<Route path="/productos" element={<Productos />} />
						<Route path="/productos/:slug" element={<ProductosCategoria />} />
						<Route path="/producto/:slug" element={<ProductoDetalle />} />
						<Route path="/marcas/:marcaSlug" element={<MarcaCategorias />} />
						<Route path="/marcas/:marcaSlug/:categorySlug" element={<MarcaCategoriaProductos />} />
						<Route path="/contacto" element={<Contacto />} />
						<Route path="/login" element={<LoginForm />} />
						<Route path="/admin" element={<Admin />} />
						<Route path="*" element={<NotFound />} />

					</Routes>
		</Layout>
		</BrowserRouter>
	);
};

export default AppRouter;
