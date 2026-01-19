import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import QuoteForm from "@components/servicios/QuoteForm";
import type { ProductItem } from "@interfaces/product/ProductTypes";

type ProductDetail = ProductItem & {
	bullets?: string[];
	brandLogoSrc?: string; // opcional (si luego agregas logos locales)
};

const ProductoDetalle: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();

	// data estática por slug (usa imágenes locales)
	const products: Record<string, ProductDetail> = {
		"bombas-de-desplazamiento-fijo": {
			id: 101,
			slug: "bombas-de-desplazamiento-fijo",
			marca: "Atos",
			title: "Bombas de Desplazamiento Fijo",
			description:
				"Bombas de paletas, pistones radiales y manuales para media / alta presión.",
			content:
				"Contamos con un amplio stock de los diversos tipos de Bombas de Desplazamiento Fijo.",
			bullets: [
				"Paletas hasta 150 cm³/rev",
				"Pistones radiales hasta 25 cm³/rev",
				"Manual hasta 20 cm³/rev",
			],
			image: { src: "/images/img2.jpg", alt: "Bombas de Desplazamiento Fijo" },
			categorySlug: "accesorios-hidraulicos",
			categoryTitle: "Accesorios Hidráulicos",
			// brandLogoSrc: "/images/brands/atos.png", // si luego lo agregas
			features: [],
		},

		// Ejemplos adicionales (por si los usas desde la vista 2 actual)
		"atos-conectores": {
			id: 2,
			slug: "atos-conectores",
			marca: "Atos",
			title: "Conectores",
			description: "Conectores para aplicaciones industriales hidráulicas.",
			content: "Modelos disponibles para distintas configuraciones y voltajes.",
			bullets: ["Distintos formatos", "Alta durabilidad", "Uso industrial"],
			image: { src: "/images/img2.jpg", alt: "Atos - Conectores" },
			categorySlug: "accesorios-hidraulicos",
			categoryTitle: "Accesorios Hidráulicos",
			features: [],
		},

		"omt-campanas-motor-bomba": {
			id: 1,
			slug: "omt-campanas-motor-bomba",
			marca: "OMT",
			title: "Campanas de Motor Bomba desde 0.75 HP - 150 HP",
			description: "Campanas para motor bomba con diferentes capacidades.",
			content: "Consúltanos por compatibilidad y disponibilidad.",
			bullets: [
				"Rango 0.75 HP - 150 HP",
				"Materiales industriales",
				"Alta precisión",
			],
			image: { src: "/images/img1.jpg", alt: "OMT - Campanas motor bomba" },
			categorySlug: "accesorios-hidraulicos",
			categoryTitle: "Accesorios Hidráulicos",
			features: [],
		},
	};

	const product = useMemo(() => {
		if (!slug) return null;
		return products[slug] ?? null;
	}, [slug]);

	if (!product) {
		return (
			<div className="pt-20">
				<section className="container py-20">
					<h1 className="text-2xl font-extrabold">Producto no encontrado</h1>
					<p className="mt-3 text-slate-600">
						Puede que el enlace sea incorrecto o el producto aún no esté
						publicado.
					</p>

					<div className="mt-8 flex gap-3">
						<Link
							to="/productos"
							className="px-6 py-3 rounded-lg bg-blue-primary text-white"
						>
							Ver categorías
						</Link>
						<button
							onClick={() => history.back()}
							className="px-6 py-3 rounded-lg border border-slate-200"
						>
							Volver
						</button>
					</div>
				</section>
			</div>
		);
	}

	return (
		<div className="bg-white pt-20">
			<section className="container py-12">
				{/* breadcrumb simple */}
				<div className="mb-8">
					<Link
						to={`/productos/${product.categorySlug ?? ""}`}
						className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
					>
						<i className="las la-arrow-left mr-2"></i>
						Volver a {product.categoryTitle ?? "categoría"}
					</Link>
				</div>

				{/* Layout como la imagen: texto izq, imagen der */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
					{/* IZQUIERDA */}
					<div>
						{/* Marca (logo o texto) */}
						{product.brandLogoSrc ? (
							<img
								src={product.brandLogoSrc}
								alt={product.marca ?? "Marca"}
								className="h-10 w-auto mb-6"
							/>
						) : (
							product.marca && (
								<p className="text-slate-500 font-semibold uppercase tracking-wide mb-4">
									{product.marca}
								</p>
							)
						)}

						<h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
							{product.title}
						</h1>

						<h2 className="mt-10 text-xl font-extrabold">Descripción</h2>
						<p className="mt-5 text-slate-700 leading-relaxed">
							{product.description}
						</p>

						{product.bullets?.length ? (
							<>
								<p className="mt-10 text-slate-700 font-semibold">
									Disponible en:
								</p>
								<ul className="mt-6 space-y-4">
									{product.bullets.map((b, idx) => (
										<li key={idx} className="flex gap-3 items-start">
											<span className="mt-2 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0"></span>
											<span className="text-slate-700">{b}</span>
										</li>
									))}
								</ul>
							</>
						) : null}

						{product.content ? (
							<p className="mt-10 text-slate-700 leading-relaxed">
								{product.content}{" "}
								<span className="underline underline-offset-4 decoration-slate-400">
									tipos de {product.title}
								</span>
								.
							</p>
						) : null}
					</div>

					{/* DERECHA */}
					<div className="lg:pl-8">
						<div className="bg-white rounded-[26px] shadow-md border border-slate-100 p-10">
							<div className="flex items-center justify-center">
								<img
									src={product.image.src}
									alt={product.image.alt}
									className="w-full max-w-[520px] h-auto object-contain"
									loading="lazy"
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Formulario (como en todas las vistas) */}
			<QuoteForm serviceTitle={product.title} serviceId={product.id} />
		</div>
	);
};

export default ProductoDetalle;
