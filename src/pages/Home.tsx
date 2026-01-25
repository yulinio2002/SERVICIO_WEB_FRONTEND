import { useEffect, useRef, useState } from "react";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import Container from "../components/common/Container";

import { listarMarcas } from "@services/marca/Marca.ts";
import { listarProductos, listarProductosDestacados } from "@services/producto/Producto.ts";
import { listarServicios } from "@services/servicio/Servicio.ts";

import type { Marca } from "@interfaces/marcas/Marcas.ts";
import type { ProductItem } from "@interfaces/product/ProductTypes";
import type { ServiceSummary } from "@interfaces/servicio/Service";

import ProductCategoryCard from "@components/product/ProductCategoryCard.tsx";
import ServiceCard from "@components/servicios/ServiceCard";

const Inicio = () => {
	const swiperSlidersRef = useRef<Swiper | null>(null);
	const swiperBrandsRef = useRef<Swiper | null>(null);
	const swiperProductsRef = useRef<Swiper | null>(null);
	const swiperServicesRef = useRef<Swiper | null>(null);
	const swiperProductsFeaturedRef = useRef<Swiper | null>(null);

	const [marcas, setMarcas] = useState<Marca[]>([]);
	const [loadingMarcas, setLoadingMarcas] = useState(true);

	const [productos, setProductos] = useState<ProductItem[]>([]);
	const [loadingProductos, setLoadingProductos] = useState(true);

	const [productosDestacados, setProductosDestacados] = useState<ProductItem[]>([],);
	const [loadingDestacados, setLoadingDestacados] = useState(true);

	const [servicios, setServicios] = useState<ServiceSummary[]>([]);
	const [loadingServicios, setLoadingServicios] = useState(true);

	// ---------- Fetchers ----------
	const fetchMarcas = async () => {
		try {
			const data = await listarMarcas();
			setMarcas(data);
		} catch (e) {
			console.error("Error al cargar marcas:", e);
			setMarcas([]);
		} finally {
			setLoadingMarcas(false);
		}
	};

	const fetchProductos = async () => {
		try {
			const data = await listarProductos();
			setProductos(data);
		} catch (e) {
			console.error("Error al cargar productos:", e);
			setProductos([]);
		} finally {
			setLoadingProductos(false);
		}
	};

	const fetchProductosDestacados = async () => {
		try {
			const data = await listarProductosDestacados();
			setProductosDestacados(data);
		} catch (e) {
			console.error("Error al cargar productos destacados:", e);
			setProductosDestacados([]);
		} finally {
			setLoadingDestacados(false);
		}
	};

	const fetchServicios = async () => {
		try {
			const data = await listarServicios();
			setServicios(data);
		} catch (e) {
			console.error("Error al cargar servicios:", e);
			setServicios([]);
		} finally {
			setLoadingServicios(false);
		}
	};

	// Carga inicial (1 sola vez)
	useEffect(() => {
		fetchMarcas();
		fetchProductos();
		fetchServicios();
		fetchProductosDestacados();
	}, []);

	// ---------- Init / Re-init Swipers ----------
	useEffect(() => {
		// Slider principal (siempre)
		if (swiperSlidersRef.current) {
			swiperSlidersRef.current.destroy(true, true);
			swiperSlidersRef.current = null;
		}
		swiperSlidersRef.current = new Swiper(".swiper-sliders", {
			modules: [Navigation, Autoplay, EffectFade],
			loop: true,
			effect: "fade",
			fadeEffect: { crossFade: true },
			autoplay: { delay: 7000, disableOnInteraction: false },
			navigation: {
				nextEl: ".slider-button-next",
				prevEl: ".slider-button-prev",
			},
		});

		// Marcas (solo si ya cargó y hay data)
		if (!loadingMarcas) {
			if (swiperBrandsRef.current) {
				swiperBrandsRef.current.destroy(true, true);
				swiperBrandsRef.current = null;
			}
			if (marcas.length) {
				swiperBrandsRef.current = new Swiper(".swiper-brands", {
					modules: [Navigation, Autoplay],
					loop: true,
					autoplay: { delay: 5000, disableOnInteraction: false },
					navigation: {
						nextEl: ".courusel-button-next",
						prevEl: ".courusel-button-prev",
					},
					breakpoints: {
						0: { slidesPerView: 1, spaceBetween: 10 },
						640: { slidesPerView: 3, spaceBetween: 20 },
						768: { slidesPerView: 4, spaceBetween: 20 },
						1024: { slidesPerView: 6, spaceBetween: 30 },
						1280: { slidesPerView: 7, spaceBetween: 40 },
					},
				});
			}
		}

		// Productos carrusel (solo si ya cargó y hay data)
		if (!loadingProductos) {
			if (swiperProductsRef.current) {
				swiperProductsRef.current.destroy(true, true);
				swiperProductsRef.current = null;
			}
			if (productos.length) {
				swiperProductsRef.current = new Swiper(".swiper-product", {
					modules: [Navigation, Pagination, Autoplay],
					slidesPerView: 3,
					spaceBetween: 30,
					loop: true,
					grabCursor: true,
					autoplay: { delay: 7000, disableOnInteraction: false },
					navigation: {
						nextEl: ".swiper-product-button-next",
						prevEl: ".swiper-product-button-prev",
					},
					breakpoints: {
						0: { slidesPerView: 1 },
						640: { slidesPerView: 2 },
						768: { slidesPerView: 3 },
					},
				});
			}
		}

		// Servicios carrusel (solo si ya cargó y hay data)
		if (!loadingServicios) {
			if (swiperServicesRef.current) {
				swiperServicesRef.current.destroy(true, true);
				swiperServicesRef.current = null;
			}
			if (servicios.length) {
				swiperServicesRef.current = new Swiper(".swiper-services", {
					modules: [Navigation],
					spaceBetween: 24, // 1px a veces genera “saltos” visuales
					slidesPerView: 3,
					centeredSlides: false,
					loop: true,
					grabCursor: true,
					simulateTouch: true,
					touchRatio: 1,
					navigation: {
						nextEl: ".swiper-services-button-next",
						prevEl: ".swiper-services-button-prev",
					},
					breakpoints: {
						0: { slidesPerView: 1, spaceBetween: 16 },
						640: { slidesPerView: 2, spaceBetween: 20 },
						768: { slidesPerView: 3, spaceBetween: 24 },
					},
				});
			}
		}

		// Featured (si lo sigues usando como carrusel)
		if (!loadingDestacados) {
			if (swiperProductsFeaturedRef.current) {
				swiperProductsFeaturedRef.current.destroy(true, true);
				swiperProductsFeaturedRef.current = null;
			}
			if (productosDestacados.length) {
				swiperProductsFeaturedRef.current = new Swiper(
					".swiper-products-featured",
					{
						modules: [Navigation, Autoplay],
						slidesPerView: 4,
						spaceBetween: 20,
						loop: productosDestacados.length > 3, // Solo loop si hay más de 3 productos
						grabCursor: true,
						autoplay: { delay: 7000, disableOnInteraction: false },
						navigation: {
							nextEl: ".swiper-products-featured-button-next",
							prevEl: ".swiper-products-featured-button-prev",
						},
						breakpoints: {
							0: { slidesPerView: 1, spaceBetween: 20 },
							640: { slidesPerView: 2, spaceBetween: 20 },
							1024: { slidesPerView: 3, spaceBetween: 20 },
							1280: { slidesPerView: 4, spaceBetween: 20 },
						},
					},
				);
			}
		}

		return () => {
			if (swiperSlidersRef.current)
				swiperSlidersRef.current.destroy(true, true);
			if (swiperBrandsRef.current) swiperBrandsRef.current.destroy(true, true);
			if (swiperProductsRef.current)
				swiperProductsRef.current.destroy(true, true);
			if (swiperProductsFeaturedRef.current)
				swiperProductsFeaturedRef.current.destroy(true, true);
			if (swiperServicesRef.current)
				swiperServicesRef.current.destroy(true, true);
			if (swiperProductsFeaturedRef.current)
				swiperProductsFeaturedRef.current.destroy(true, true);
		};
	}, [
		loadingMarcas,
		marcas,
		loadingProductos,
		productos,
		loadingServicios,
		servicios,
		loadingDestacados,
		productosDestacados,
	]);

	// Datos para Home (sin nuevos endpoints)
	const productosHome = productos.slice(0);
	const serviciosHome = servicios.slice(0);

	return (
		<div className="wrapper">
			{/* Slider Section */}
			<section className="py-0 w-full sectionSlider sectionSliderIndex">
				<div className="swiper swiper-sliders w-full max-w-semifull h-72 md:h-80 lg:h-100 xl:h-104 2xl:h-107 rounded-2xl relative">
					<div className="swiper-wrapper">
						{/* Slide 1 */}
						<div
							className="swiper-slide flex items-center bg-cover bg-center bg-no-repeat"
							style={{ backgroundImage: "url(/home/h1.jpg)" }}
						>
							<div className="w-full relative z-20 px-20">
								<h2 className="text-white font-bold w-full text-xl leading-snug text-center sm:text-xl sm:leading-snug md:text-2xl md:leading-snug lg:text-left lg:text-3xl lg:leading-snug lg:w-8/12 xl:text-4xl xl:leading-snug 2xl:text-5x2l 2xl:leading-snug">
									Soluciones integrales de ingeniería oleohidráulica que
									garantizan productividad y seguridad.
								</h2>
							</div>
							<div className="absolute z-10 w-full h-full left-0 top-0 bg-black bg-opacity-25" />
						</div>

						{/* Slide 2 - CORREGIDO */}
						<div
							className="swiper-slide flex items-center bg-cover bg-center bg-no-repeat"
							style={{ backgroundImage: "url(/home/h2.jpg)" }}
						>
							<div className="w-full relative z-20 px-20">
								<h2 className="text-white font-bold w-full text-xl leading-snug text-center sm:text-xl sm:leading-snug md:text-2xl md:leading-snug lg:text-left lg:text-3xl lg:leading-snug lg:w-8/12 xl:text-4xl xl:leading-snug 2xl:text-5x2l 2xl:leading-snug">
									Servicios de calidad con respaldo y garantía de fabricantes
									líderes del rubro.
								</h2>
							</div>
							<div className="absolute z-10 w-full h-full left-0 top-0 bg-black bg-opacity-25" />
						</div>

						{/* Slide 3 */}
						<div
							className="swiper-slide flex items-center bg-cover bg-center bg-no-repeat"
							style={{ backgroundImage: "url(/home/h3.jpg)" }}
						>
							<div className="w-full relative z-20 px-20">
								<h2 className="text-white font-bold w-full text-xl leading-snug text-center sm:text-xl sm:leading-snug md:text-2xl md:leading-snug lg:text-left lg:text-3xl lg:leading-snug lg:w-8/12 xl:text-4xl xl:leading-snug 2xl:text-5x2l 2xl:leading-snug">
									Amplio stock y reposición adecuada de equipamiento original.
								</h2>
							</div>
							<div className="absolute z-10 w-full h-full left-0 top-0 bg-black bg-opacity-25" />
						</div>
					</div>

					<div className="slider-button-prev absolute left-7 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer">
						<i className="las la-angle-left text-white text-4xl"></i>
					</div>
					<div className="slider-button-next absolute right-7 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer">
						<i className="las la-angle-right text-white text-4xl"></i>
					</div>
				</div>
			</section>

			{/* Brands Section */}
			<section className="bg-white py-10 lg:py-16 xl:py-20 2xl:py-24">
				<Container>
					<p className="subtitle mb-2 lg:mb-3 2xl:mb-5 text-3xl">
						NUESTRAS MARCAS
					</p>
					<h2 className="mb-3 lg:mb-3 text-3xl md:text-4xl font-extrabold leading-normal">
						Somos distribuidores autorizados
					</h2>
					<p className="mb-14 mt-4 xl:mb-16 2xl:mb-20">
						Ponemos a su disposición equipos oleohidráulicos de marcas
						reconocidas en el mercado global.
					</p>

					<div className="swiper swiper-brands m-auto">
						<div className="swiper-wrapper">
							{loadingMarcas ? (
								<div className="swiper-slide flex justify-center">
									<p className="text-gray-500">Cargando marcas...</p>
								</div>
							) : marcas.length ? (
								marcas.map((m) => (
									<div
										key={m.id}
										className="swiper-slide flex justify-center group"
									>
										<img
											src={m.imagenUrl}
											alt={m.nombre}
											className="h-40 w-80 object-contain max-w-full filter-none brightness-100 contrast-100 hover:scale-105 transition-transform duration-300"
											loading="lazy"
											onError={(e) => {
												(e.currentTarget as HTMLImageElement).src =
													"/brands/b1.png";
											}}
										/>
									</div>
								))
							) : (
								<div className="swiper-slide flex justify-center">
									<p className="text-gray-500">No hay marcas para mostrar.</p>
								</div>
							)}
						</div>
					</div>
				</Container>
			</section>

			{/* Products Section (desde backend) */}
			<section className="bg-gradient-to-r from-orange-100 to-zinc-100 lg:py-16 xl:py-20 2xl:py-24 overflow-hidden">
				<Container>
					<div className="grid grid-cols-1 lg:grid-cols-10 lg:gap-14">
						<div className="col-span-1 mb-14 md:mb-20 lg:mb-0 lg:col-span-3 flex items-center">
							<div>
								<p className="subtitle mb-2 lg:mb-3 2xl:mb-5 text-3xl">
									NUESTROS PRODUCTOS
								</p>
								<h2 className="mb-3 lg:mb-3 text-3xl md:text-4xl font-extrabold leading-normal">
									Productos de alta calidad
								</h2>
								<p className="text-black mb-8">
									Contamos con una amplia variedad de productos oleohidráulicos
									para satisfacer todas tus necesidades industriales.
								</p>
								<a
									href="/productos"
									className="inline-block bg-orange-400 text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-40 transition-all"
								>
									Ver más
								</a>
							</div>
						</div>

						<div className="col-span-1 lg:col-span-7 relative swiper-products">
							<div className="swiper swiper-product w-full">
								<div className="swiper-wrapper">
									{loadingProductos ? (
										<div className="swiper-slide">
											<div className="bg-white rounded-xl p-6 h-full">
												<p className="text-gray-600 text-sm">
													Cargando productos...
												</p>
											</div>
										</div>
									) : productosHome.length ? (
										productosHome.map((p) => (
											<div key={p.id} className="swiper-slide">
												<ProductCategoryCard
													item={{
														id: p.id,
														slug: p.slug,
														title: p.title,
														subtitle: p.marca,
														image: p.image,
													}}
													linkTo={`/producto/${p.slug}`}
												/>
											</div>
										))
									) : (
										<div className="swiper-slide">
											<div className="bg-white rounded-xl p-6 h-full">
												<p className="text-gray-600 text-sm">
													No hay productos para mostrar.
												</p>
											</div>
										</div>
									)}
								</div>

								<div className="swiper-product-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer bg-white/80 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all">
									<i className="las la-angle-left text-gray-800 text-2xl"></i>
								</div>
								<div className="swiper-product-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer bg-white/80 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all">
									<i className="las la-angle-right text-gray-800 text-2xl"></i>
								</div>
							</div>
							{/*<div className="swiper-pagination mt-10"></div>*/}
						</div>
					</div>
				</Container>
			</section>

			{/* Services Section (desde backend) */}
			<section className="bg-white py-10 lg:py-16 xl:py-20 2xl:py-24">
				<Container>
					<p className="subtitle mb-2 lg:mb-3 2xl:mb-5 text-3xl">
						NUESTROS SERVICIOS
					</p>
					<h2 className="mb-3 lg:mb-3 text-3xl md:text-4xl font-extrabold leading-normal">
						Capacidad y experiencia en soluciones oleohidráulicas de calidad.
					</h2>
					<p className="mb-14 xl:mb-16 2xl:mb-20">
						Contamos con el mejor equipo de profesionales capacitados para idear
						y diseñar la mejor solución a sus sistemas oleohidráulicos.
					</p>
				</Container>

				<div className="w-full overflow-hidden px-5 lg:px-0">
					<div className="swiper swiper-services w-full lg:w-166/1000 px-7 lg:px-0 relative">
						<div className="swiper-wrapper">
							{loadingServicios ? (
								<div className="swiper-slide">
									<div className="bg-white rounded-xl p-6">
										<p className="text-gray-600 text-sm">
											Cargando servicios...
										</p>
									</div>
								</div>
							) : serviciosHome.length ? (
								serviciosHome.map((s) => (
									<div key={s.id} className="swiper-slide">
										<ServiceCard
											id={s.id}
											title={s.title}
											slug={s.slug}
											image={s.image}
										/>
									</div>
								))
							) : (
								<div className="swiper-slide">
									<div className="bg-white rounded-xl p-6">
										<p className="text-gray-600 text-sm">
											No hay servicios para mostrar.
										</p>
									</div>
								</div>
							)}
						</div>

						<div className="swiper-services-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer bg-white/80 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all">
							<i className="las la-angle-left text-gray-800 text-2xl"></i>
						</div>
						<div className="swiper-services-button-next absolute right-4 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer bg-white/80 hover:bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all">
							<i className="las la-angle-right text-gray-800 text-2xl"></i>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Products Section (desde backend, sin nuevo endpoint) */}
			<section className="bg-gradient-to-r from-orange-100 to-zinc-100 py-10 lg:py-16 xl:py-20 2xl:py-24">
				<Container>
					<p className="subtitle mb-2 lg:mb-3 2xl:mb-5 text-black text-3xl">
						PRODUCTOS DESTACADOS
					</p>
					<h2 className="title mb-14 xl:mb-16 2xl:mb-20 text-black text-3xl md:text-4xl font-extrabold leading-normal">
						Componentes Oleohidráulicos para cada necesidad.
					</h2>

					<div className="w-full relative">
						<div className="swiper swiper-products-featured">
							<div className="swiper-wrapper">
								{loadingDestacados ? (
									<>
										{/* Skeletons para loading */}
										{[1, 2, 3, 4].map((i) => (
											<div key={i} className="swiper-slide">
												<div className="bg-white/90 rounded-xl overflow-hidden group animate-pulse">
													<div className="h-64 bg-gray-300"></div>
													<div className="p-6">
														<div className="h-4 bg-gray-300 rounded mb-2"></div>
														<div className="h-3 bg-gray-200 rounded mb-4"></div>
														<div className="h-4 bg-gray-300 rounded w-1/3"></div>
													</div>
												</div>
											</div>
										))}
									</>
								) : productosDestacados.length ? (
									productosDestacados.map((p) => (
										<div key={p.id} className="swiper-slide">
											<div className="bg-white/90 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
												<div className="h-64 overflow-hidden">
													<img
														src={p.image?.src || "/images/placeholder.jpg"}
														alt={p.image?.alt || p.title}
														className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
														loading="lazy"
														onError={(e) => {
															(e.currentTarget as HTMLImageElement).src =
																"/images/placeholder.jpg";
														}}
													/>
												</div>
												<div className="p-6">
													<h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
														{p.title}
													</h3>
													<p className="text-gray-600 text-sm mb-4 line-clamp-2">
														{p.description || "Producto de alta calidad"}
													</p>
													<a
														href={`/producto/${p.slug}`}
														className="text-orange-600 font-semibold hover:text-orange-700 hover:underline inline-flex items-center"
													>
														Ver detalles
														<i className="las la-arrow-right ml-2"></i>
													</a>
												</div>
											</div>
										</div>
									))
								) : (
									<div className="swiper-slide">
										<div className="bg-white/90 rounded-xl p-8 text-center">
											<div className="mb-4">
												<i className="las la-star text-4xl text-gray-300"></i>
											</div>
											<h3 className="font-bold text-lg mb-2 text-gray-800">
												No hay productos destacados
											</h3>
											<p className="text-gray-600 text-sm mb-4">
												Aún no se han marcado productos como destacados.
											</p>
											<a
												href="/productos"
												className="text-orange-600 font-semibold hover:text-orange-700 hover:underline"
											>
												Ver todos los productos →
											</a>
										</div>
									</div>
								)}
							</div>
						</div>

						{productosDestacados.length > 0 && (
							<>
								<div className="swiper-products-featured-button-prev absolute left-2 sm:-left-6 top-1/3 z-20 cursor-pointer hover:opacity-70 transition-opacity">
									<i className="las la-angle-left text-white text-4xl"></i>
								</div>
								<div className="swiper-products-featured-button-next absolute right-2 sm:-right-6 top-1/3 z-20 cursor-pointer hover:opacity-70 transition-opacity">
									<i className="las la-angle-right text-white text-4xl"></i>
								</div>
							</>
						)}
					</div>
				</Container>
			</section>
		</div>
	);
};

export default Inicio;
