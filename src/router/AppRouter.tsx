// src/router/AppRouter.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";
import WhatsAppButton from "@components/common/WhatsAppButton";

// Pages
// import Home from "@/pages/Home";
// import Nosotros from "@/pages/Nosotros";
import Servicios from "@pages/Servicios";
import ServicioDetalle from "@pages/ServicioDetalle";
import NotFound from "@pages/NotFound.tsx";
import Projects from "@pages/Projects.tsx";
import Productos from "@pages/Productos.tsx";
import ProductosCategoria from "@pages/ProductosCategoria.tsx";
import ProductoDetalle from "@pages/ProductoDetalle.tsx";
import MarcaCategorias from "@pages/MarcaCategorias.tsx";
import MarcaCategoriaProductos from "@pages/MarcaCategoriaProductos.tsx";

const AppRouter: React.FC = () => {
	return (
		<BrowserRouter>
			<div className="flex flex-col min-h-screen">
				<Header />
				<main
					className="flex-grow px-5 md:px-7 lg:px-16"
					style={{ paddingTop: "var(--header-height)" }}
				>
					<Routes>
						{/* <Route path="/" element={<Home />} />
						<Route path="/nosotros" element={<Nosotros />} />
						<Route path="/servicios" element={<Servicios />} /> */}
						<Route path="/servicios" element={<Servicios />} />
						<Route path="/servicios/:slug" element={<ServicioDetalle />} />
						<Route path="/proyectos" element={<Projects />} />
						<Route path="/productos" element={<Productos />} />
						<Route path="/productos/:slug" element={<ProductosCategoria />} />
						<Route path="/producto/:slug" element={<ProductoDetalle />} />
						{/*<Route path="/contacto" element={<Contacto />} />
						<Route path="/funcionalidad/:slug" element={<Funcionalidad />} /> */}
						<Route path="/marcas/:marcaSlug" element={<MarcaCategorias />} />
						<Route path="/marcas/:marcaSlug/:categorySlug" element={<MarcaCategoriaProductos />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
				<Footer />
				<WhatsAppButton />
			</div>
		</BrowserRouter>
	);
};

export default AppRouter;
