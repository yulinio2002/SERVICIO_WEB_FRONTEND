import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import QuoteForm from "@components/servicios/QuoteForm";
import type { ProductItem } from "@interfaces/product/ProductTypes";
import { listarProductos } from "@services/producto/Producto.ts";
import { slugify } from "@interfaces/product/Mapper.ts";

type ProductDetail = ProductItem & {
	bullets?: string[];
	brandLogoSrc?: string; // opcional (si luego agregas logos locales)
};

const ProductoDetalle: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();

	const [product, setProduct] = useState<ProductDetail | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;

		(async () => {
			if (!slug) {
				setLoading(false);
				return;
			}

			setLoading(true);

			try {
				// cacheado por tu service
				const list = await listarProductos();

				// slug = slugify(nombre) (como en tu mapper)
				const found = list.find(
					(p) => p.slug === slug || slugify(p.title) === slug,
				);

				if (!mounted) return;
				setProduct(found ?? null);
			} catch (e) {
				console.error("Error cargando producto:", e);
				if (mounted) setProduct(null);
			} finally {
				if (mounted) setLoading(false);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [slug]);


	if (loading) {
		return (
			<div className="pt-20">
				<section className="container py-20">
					<div className="min-h-[200px] flex items-center justify-center">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-primary mx-auto"></div>
							<p className="mt-4 text-gray-600">Cargando...</p>
						</div>
					</div>
				</section>
			</div>
		);
	}

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
