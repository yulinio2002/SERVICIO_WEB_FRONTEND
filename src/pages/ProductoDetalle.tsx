// src/pages/ProductoDetalle.tsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import QuoteForm from "@components/servicios/QuoteForm";
import { getProductBySlug, getProductsByCategory } from "src/data/Products";
import type { ProductItem } from "@interfaces/product/ProductTypes";

const ProductoDetalle: React.FC = () => {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();
	const [product, setProduct] = useState<ProductItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);

	useEffect(() => {
		window.scrollTo(0, 0);

		const foundProduct = getProductBySlug(slug || "");

		if (foundProduct) {
			setProduct(foundProduct);
			// Obtener productos relacionados de la misma categoría
			const related = getProductsByCategory(foundProduct.categorySlug)
				.filter((p) => p.slug !== slug)
				.slice(0, 3);
			setRelatedProducts(related);
		} else {
			setProduct(null);
		}

		setLoading(false);
	}, [slug]);

	const scrollToForm = () => {
		const formElement = document.getElementById("quote-form");
		if (formElement) {
			formElement.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center pt-20">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
					<p className="mt-4 text-gray-600">Cargando producto...</p>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen flex items-center justify-center pt-20">
				<div className="text-center">
					<i className="las la-exclamation-circle text-6xl text-gray-300 mb-4"></i>
					<h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
					<p className="text-gray-600 mb-6">
						El producto que buscas no existe o ha sido eliminado.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => navigate(-1)}
							className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
						>
							<i className="las la-arrow-left mr-2"></i>
							Volver atrás
						</button>
						<Link
							to="/productos"
							className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center"
						>
							<i className="las la-box mr-2"></i>
							Ver todos los productos
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="pt-20">
			{/* Breadcrumb */}
			<div className="bg-gray-50 py-4">
				<div className="container">
					<div className="flex items-center text-sm text-gray-600">
						<Link to="/" className="hover:text-orange-500 transition-colors">
							Inicio
						</Link>
						<i className="las la-angle-right mx-2"></i>
						<Link
							to="/productos"
							className="hover:text-orange-500 transition-colors"
						>
							Productos
						</Link>
						<i className="las la-angle-right mx-2"></i>
						<Link
							to={`/productos/${product.categorySlug}`}
							className="hover:text-orange-500 transition-colors"
						>
							{product.categoryTitle}
						</Link>
						<i className="las la-angle-right mx-2"></i>
						<span className="text-gray-800 font-medium">{product.title}</span>
					</div>
				</div>
			</div>

			{/* Hero Section */}
			<section className="py-8 md:py-12">
				<div className="container">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
						{/* Imagen del producto */}
						<div className="sticky top-24">
							<div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
								<div className="overflow-hidden rounded-xl">
									<img
										src={product.image.src}
										alt={product.image.alt}
										className="w-full h-auto object-cover"
									/>
								</div>

								{/* Marca */}
								{product.marca && (
									<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
										<div className="flex items-center">
											<i className="las la-copyright text-2xl text-blue-500 mr-3"></i>
											<div>
												<h4 className="font-bold text-blue-800">Marca</h4>
												<p className="text-blue-600">{product.marca}</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Información del producto */}
						<div>
							{/* Título */}
							<h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
								{product.title}
							</h1>

							{/* Categoría */}
							<div className="mb-6">
								<Link
									to={`/productos/${product.categorySlug}`}
									className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
								>
									<i className="las la-folder mr-2"></i>
									{product.categoryTitle}
								</Link>
							</div>

							{/* Descripción */}
							<div className="prose prose-lg max-w-none mb-8">
								<p className="text-gray-700 leading-relaxed">
									{product.content}
								</p>
							</div>

							{/* Características */}
							<div className="mb-10">
								<h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
									<i className="las la-star text-orange-500 mr-2"></i>
									Características principales
								</h3>
								<ul className="space-y-3">
									{product.features.map((feature, index) => (
										<li key={index} className="flex items-start">
											<i className="las la-check text-green-500 text-lg mt-0.5 mr-3 flex-shrink-0"></i>
											<span className="text-gray-700">{feature}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Especificaciones técnicas */}
							{product.specifications && (
								<div className="mb-10">
									<h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
										<i className="las la-clipboard-list text-orange-500 mr-2"></i>
										Especificaciones técnicas
									</h3>
									<div className="bg-gray-50 rounded-xl p-6">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											{Object.entries(product.specifications).map(
												([key, value]) => (
													<div
														key={key}
														className="flex justify-between py-3 border-b border-gray-200 last:border-0"
													>
														<span className="font-medium text-gray-700">
															{key}
														</span>
														<span className="text-gray-900 font-semibold">
															{value}
														</span>
													</div>
												),
											)}
										</div>
									</div>
								</div>
							)}

							{/* Botón de cotización */}
							<div className="flex flex-wrap gap-4">
								<button
									onClick={scrollToForm}
									className="flex items-center px-8 py-4 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
								>
									<i className="las la-quote-right text-xl mr-3"></i>
									Solicitar cotización
									<div className="ml-4 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
										<i className="las la-arrow-right text-white"></i>
									</div>
								</button>

								<Link
									to={`/productos/${product.categorySlug}`}
									className="flex items-center px-6 py-4 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors border border-gray-200"
								>
									<i className="las la-list mr-3"></i>
									Ver más en {product.categoryTitle}
								</Link>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Productos relacionados */}
			{relatedProducts.length > 0 && (
				<section className="py-16 bg-gray-50">
					<div className="container">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-10 text-center">
							Productos relacionados
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{relatedProducts.map((relatedProduct) => (
								<div
									key={relatedProduct.id}
									className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
								>
									<div className="h-48 overflow-hidden">
										<img
											src={relatedProduct.image.src}
											alt={relatedProduct.image.alt}
											className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
										/>
									</div>
									<div className="p-6">
										{relatedProduct.marca && (
											<span className="text-xs font-semibold text-blue-600 mb-2 block">
												{relatedProduct.marca}
											</span>
										)}
										<h3 className="font-bold text-gray-800 mb-2">
											{relatedProduct.title}
										</h3>
										<p className="text-gray-600 text-sm mb-4 line-clamp-2">
											{relatedProduct.description}
										</p>
										<Link
											to={`/producto/${relatedProduct.slug}`}
											className="text-orange-500 hover:text-orange-700 font-medium text-sm inline-flex items-center"
										>
											Ver detalles
											<i className="las la-arrow-right ml-1"></i>
										</Link>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Formulario de cotización */}
			<div id="quote-form" className="scroll-mt-20">
				<QuoteForm serviceTitle={product.title} serviceId={product.id} />
			</div>
		</div>
	);
};

export default ProductoDetalle;
