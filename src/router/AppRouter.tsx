// src/router/AppRouter.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@components/common/Header";
import Footer from "@components/common/Footer";
import WhatsAppButton from "@components/common/WhatsAppButton";

// Pages
// import Home from "@/pages/Home";
// import Nosotros from "@/pages/Nosotros";
// import Servicios from "@/pages/Servicios";
import ServicioDetalle from "@pages/ServicioDetalle";
// import Proyectos from "@/pages/Proyectos";
// import Contacto from "@/pages/Contacto";
// import Funcionalidad from "@/pages/Funcionalidad";
// import Marcas from "@/pages/Marcas";

const AppRouter: React.FC = () => {
	return (
		<BrowserRouter>
			<div className="flex flex-col min-h-screen">
				<Header />
				<main className="flex-grow">
					<Routes>
						{/* <Route path="/" element={<Home />} />
						<Route path="/nosotros" element={<Nosotros />} />
						<Route path="/servicios" element={<Servicios />} /> */}
						<Route path="/servicios/" element={<ServicioDetalle />} />
						{/* <Route path="/proyectos" element={<Proyectos />} />
						<Route path="/contacto" element={<Contacto />} />
						<Route path="/funcionalidad" element={<Funcionalidad />} />
						<Route path="/funcionalidad/:slug" element={<Funcionalidad />} />
						<Route path="/marcas" element={<Marcas />} />
						<Route path="/marcas/:slug" element={<Marcas />} /> */}
					</Routes>
				</main>
				<Footer />
				<WhatsAppButton />
			</div>
		</BrowserRouter>
	);
};

export default AppRouter;
