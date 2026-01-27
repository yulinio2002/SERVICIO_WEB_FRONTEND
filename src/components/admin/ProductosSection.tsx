import { useState, useEffect, useRef } from "react";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";
import Alert from "./Alert";
import {
	listarProductos,
	crearProductoFormData,
	actualizarProductoFormData,
	eliminarProductoDestacado,
	agregarProductoDestacado,
	listarProductosDestacados,
} from "@services/producto/Producto";
import type { ProductItem } from "@interfaces/product/ProductTypes";
import Api from "@services/api.ts";
import { cacheDel } from "@services/cache.ts";

interface Producto {
	id: number;
	nombre: string;
	img_url: string;
	descripcion: string;
	content: string;
	marca: string;
	categorias: string[];
	features: string[];
}

interface ExistingImage {
	url: string;
}

export default function ProductosSection() {
	const [productos, setProductos] = useState<Producto[]>([]);
	const [productosDestacados, setProductosDestacados] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingDestacados, setLoadingDestacados] = useState(true);
	const [isSubmittingDestacado, setIsSubmittingDestacado] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		nombre: "",
		descripcion: "",
		content: "",
		marca: "",
		featuresText: "",
		categorias: [] as string[],
	});
	const [existingImage, setExistingImage] = useState<ExistingImage | null>(
		null,
	);
	const [newImage, setNewImage] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
		null,
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const categoriaOptions = [
		{ label: "Abrazaderas", value: "ABRAZADERAS" },
		{ label: "Accesorios Hidráulicos", value: "ACCESORIOS_HIDRAULICOS" },
		{ label: "Acumuladores Hidráulicos", value: "ACUMULADORES_HIDRAULICOS" },
		{ label: "Bombas Hidráulicas", value: "BOMBAS_HIDRAULICAS" },
		{ label: "Diagtronics", value: "DIAGTRONICS" },
		{ label: "Enfriadores Hidráulicos", value: "ENFRIADORES_HIDRAULICOS" },
		{ label: "Filtros Hidráulicos", value: "FILTROS_HIDRAULICOS" },
		{ label: "Motores Hidráulicos", value: "MOTORES_HIDRAULICOS" },
		{ label: "Presostatos", value: "PRESOSTATOS" },
		{ label: "Radio Control", value: "RADIO_CONTROL" },
		{
			label: "Tubería Hidráulica Sin Soldadura",
			value: "TUBERIA_HIDRAULICA_SIN_SOLDADURA",
		},
		{ label: "Válvulas hidráulicas", value: "VALVULAS_HIDRAULICAS" },
	];

	useEffect(() => {
		loadProductos();
		loadProductosDestacados();
	}, []);

	const loadProductos = async () => {
		try {
			setLoading(true);
			const data = await listarProductos();
			const productosMapeados: Producto[] = data.map((item: ProductItem) => ({
				id: item.id,
				nombre: item.title,
				img_url: item.image.src,
				descripcion: item.description,
				content: item.content,
				marca: item.marca,
				categorias: item.categories,
				features: item.features,
			}));
			setProductos(productosMapeados);
			setError(null);
		} catch (err) {
			setError("Error al cargar productos");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const loadProductosDestacados = async () => {
		try {
			setLoadingDestacados(true);
			const destacados = await listarProductosDestacados();
			const ids = destacados.map((producto) => producto.id);
			setProductosDestacados(ids);
		} catch (err) {
			console.error("Error al cargar productos destacados:", err);
			setProductosDestacados([]);
		} finally {
			setLoadingDestacados(false);
		}
	};

	const toggleDestacado = async (productoId: number) => {
		try {
			setIsSubmittingDestacado(true);
			if (productosDestacados.includes(productoId)) {
				const success = await eliminarProductoDestacado(productoId);
				if (success) {
					setProductosDestacados((prev) =>
						prev.filter((id) => id !== productoId),
					);
					setSuccess("Producto eliminado de destacados");
				}
			} else {
				const success = await agregarProductoDestacado(productoId);
				if (success) {
					setProductosDestacados((prev) => [...prev, productoId]);
					setSuccess("Producto agregado a destacados");
				}
			}
		} catch (err: any) {
			setError(err.message || "Error al modificar producto destacado");
		} finally {
			setIsSubmittingDestacado(false);
		}
	};

	const handleOpenModal = async (producto?: Producto) => {
		if (producto) {
			const categoriasOriginales = producto.categorias || [];

			// Cargar datos del producto
			setFormData({
				nombre: producto.nombre,
				descripcion: producto.descripcion,
				content: producto.content || "",
				marca: producto.marca,
				featuresText: producto.features?.join("\n") || "",
				categorias: categoriasOriginales,
			});
			setExistingImage({ url: producto.img_url });
			setNewImage(null);
			setImagePreview(null);
			setEditingId(producto.id);
		} else {
			// Restablecer para nuevo producto
			setFormData({
				nombre: "",
				descripcion: "",
				content: "",
				marca: "",
				featuresText: "",
				categorias: [],
			});
			setExistingImage(null);
			setNewImage(null);
			setImagePreview(null);
			setEditingId(null);
		}
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setFormData({
			nombre: "",
			descripcion: "",
			content: "",
			marca: "",
			featuresText: "",
			categorias: [],
		});
		setExistingImage(null);
		setNewImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setNewImage(file);
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const removeImage = () => {
		setNewImage(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const toggleCategoria = (categoria: string) => {
		setFormData((prev) => ({
			...prev,
			categorias: prev.categorias.includes(categoria)
				? prev.categorias.filter((c) => c !== categoria)
				: [...prev.categorias, categoria],
		}));
	};

	const handleSubmit = async () => {
		// Validaciones
		if (!formData.nombre.trim()) {
			setError("El nombre es obligatorio");
			return;
		}
		if (!formData.descripcion.trim()) {
			setError("La descripción es obligatoria");
			return;
		}
		if (!formData.content.trim()) {
			setError("El contenido es obligatorio");
			return;
		}
		if (!formData.marca.trim()) {
			setError("La marca es obligatoria");
			return;
		}
		if (formData.categorias.length === 0) {
			setError("Seleccione al menos una categoría");
			return;
		}

		// Validación de imagen
		if (!editingId && !newImage) {
			setError("Debe subir una imagen para crear el producto");
			return;
		}

		// En edición, debe haber imagen existente o nueva
		if (editingId && !existingImage && !newImage) {
			setError("El producto debe tener una imagen");
			return;
		}

		setIsSubmitting(true);
		try {
			const formDataToSend = new FormData();
			formDataToSend.append("nombre", formData.nombre);
			formDataToSend.append("descripcion", formData.descripcion);
			formDataToSend.append("content", formData.content);
			formDataToSend.append("marca", formData.marca);
			formDataToSend.append(
				"features",
				formData.featuresText
					.split("\n")
					.map((f) => f.trim())
					.filter((f) => f.length > 0)
					.join(";"),
			);

			const categoriasBackend = formData.categorias.map(
				(cat) =>
					cat
						.toUpperCase()
						.replace(/\s+/g, "_")
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, ""), // quitar acentos
			);

			// Agregar categorías como campos separados
			categoriasBackend.forEach((cat) => {
				formDataToSend.append("categorias", cat);
			});

			// Agregar imagen si hay nueva
			if (newImage) {
				formDataToSend.append("file", newImage);
			}

			if (editingId) {
				await actualizarProductoFormData(editingId, formDataToSend);
				setSuccess("Producto actualizado exitosamente");
			} else {
				await crearProductoFormData(formDataToSend);
				setSuccess("Producto creado exitosamente");
			}

			await loadProductos();
			handleCloseModal();
			setError(null);
		} catch (err: any) {
			console.error("Error detallado:", err);
			let errorMessage = "Error al guardar producto";
			if (err.response?.data?.message) {
				errorMessage = err.response.data.message;
			} else if (err.message) {
				errorMessage = err.message;
			}
			setError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteClick = (producto: Producto) => {
		setSelectedProducto(producto);
		setIsDeleteOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedProducto) return;

		setIsSubmitting(true);
		try {
			const api = await Api.getInstance();
			await api.delete({ url: `/api/productos/${selectedProducto.id}` });

			cacheDel(`productos:${selectedProducto.id}`);
			cacheDel("productos:destacados");
			await listarProductos();
			// Actualizar estado local: eliminar el producto de la lista
			setProductos((prev) => prev.filter((p) => p.id !== selectedProducto.id));

			// También actualizar productos destacados si estaba destacado
			setProductosDestacados((prev) =>
				prev.filter((id) => id !== selectedProducto.id),
			);

			setIsDeleteOpen(false);
			setSuccess("Producto eliminado exitosamente");
			setError(null);
		} catch (err) {
			setError("Error al eliminar producto");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (loading) {
		return <div className="text-center py-8">Cargando productos...</div>;
	}

	return (
		<div>
			{error && (
				<Alert type="error" message={error} onClose={() => setError(null)} />
			)}
			{success && (
				<Alert
					type="success"
					message={success}
					onClose={() => setSuccess(null)}
				/>
			)}

			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Productos</h2>
				<div className="flex gap-2">
					<button
						onClick={() => handleOpenModal()}
						className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						+ Nuevo Producto
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{productos.map((producto) => {
					const isDestacado = productosDestacados.includes(producto.id);

					// Convertir categorías para mostrar
					const categoriasMostrar =
						producto.categorias?.map((cat) =>
							cat
								.toLowerCase()
								.split("_")
								.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
								.join(" "),
						) || [];

					return (
						<div
							key={producto.id}
							className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow relative"
						>
							{/* Estrella para destacar */}
							<button
								onClick={() => toggleDestacado(producto.id)}
								disabled={isSubmittingDestacado}
								className={`absolute top-3 right-3 z-10 p-2 rounded-full ${
									isDestacado
										? "bg-yellow-100 text-yellow-500 hover:bg-yellow-200"
										: "bg-gray-100 text-gray-400 hover:bg-gray-200"
								} transition-colors`}
								title={
									isDestacado ? "Quitar de destacados" : "Agregar a destacados"
								}
							>
								<i
									className={`las la-star text-xl ${isDestacado ? "text-yellow-500" : "text-gray-400"}`}
								></i>
							</button>

							{/* Badge destacado */}
							{isDestacado && (
								<span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
									DESTACADO
								</span>
							)}

							{producto.img_url && (
								<img
									src={producto.img_url}
									alt={producto.nombre}
									className="w-full h-32 object-cover rounded mb-3"
								/>
							)}
							<h3 className="font-bold text-lg mb-1">{producto.nombre}</h3>
							<p className="text-sm text-gray-600 mb-1">
								<strong>Marca:</strong> {producto.marca}
							</p>
							<p className="text-sm text-gray-600 mb-2">
								<strong>Categorías:</strong>{" "}
								{categoriasMostrar.length > 0
									? categoriasMostrar.join(", ")
									: "Sin categorías"}
							</p>
							<p className="text-xs text-gray-500 mb-3 line-clamp-2">
								{producto.descripcion}
							</p>
							<div className="flex gap-2">
								<button
									onClick={() => handleOpenModal(producto)}
									className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm"
								>
									Editar
								</button>
								<button
									onClick={() => handleDeleteClick(producto)}
									className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm"
								>
									Eliminar
								</button>
							</div>
						</div>
					);
				})}
			</div>

			<AdminModal
				isOpen={isModalOpen}
				title={editingId ? "Editar Producto" : "Nuevo Producto"}
				onClose={handleCloseModal}
				onSubmit={handleSubmit}
				isLoading={isSubmitting}
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Nombre *
						</label>
						<input
							type="text"
							value={formData.nombre}
							onChange={(e) =>
								setFormData({ ...formData, nombre: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Nombre del producto"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Marca *
						</label>
						<input
							type="text"
							value={formData.marca}
							onChange={(e) =>
								setFormData({ ...formData, marca: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Marca del producto"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Descripción corta *
						</label>
						<textarea
							value={formData.descripcion}
							onChange={(e) =>
								setFormData({ ...formData, descripcion: e.target.value })
							}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Descripción breve del producto"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Contenido detallado *
						</label>
						<textarea
							value={formData.content}
							onChange={(e) =>
								setFormData({ ...formData, content: e.target.value })
							}
							rows={4}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Contenido completo del producto"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Características (una por línea)
						</label>
						<textarea
							value={formData.featuresText}
							onChange={(e) =>
								setFormData({ ...formData, featuresText: e.target.value })
							}
							rows={4}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Cada característica en una línea nueva. Ejemplo:
Característica 1
Característica 2
Característica 3"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Cada línea se convertirá en una característica del producto
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Imagen {!editingId && "*"}
						</label>

						{editingId && existingImage && !newImage && (
							<div className="mb-4">
								<p className="text-sm text-gray-600 mb-2">
									Imagen actual (Cargue una nueva imagen para cambiarla):
								</p>
								<img
									src={existingImage.url}
									alt="Imagen actual del producto"
									className="flex items-center gap-3 p-3 border rounded-md"
								/>
							</div>
						)}

						{imagePreview && (
							<div className="mb-4">
								<p className="text-sm text-gray-600 mb-2">
									Vista previa de la nueva imagen:
								</p>
								<img
									src={imagePreview}
									alt="Vista previa"
									className="w-32 h-32 object-cover rounded"
								/>
								<button
									type="button"
									onClick={removeImage}
									className="mt-2 text-sm text-red-600 hover:text-red-800"
								>
									Eliminar nueva imagen
								</button>
							</div>
						)}

						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Formatos: JPG, PNG, etc. Tamaño máximo: 5MB.
						</p>

						{!editingId && !newImage && (
							<p className="text-sm text-red-500 mt-1">
								Debe subir una imagen para crear el producto.
							</p>
						)}

						{editingId && !existingImage && !newImage && (
							<p className="text-sm text-red-500 mt-1">
								El producto debe tener una imagen.
							</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Categorías * (seleccione al menos una)
						</label>
						<div className="grid grid-cols-2 gap-2">
							{categoriaOptions.map((cat) => (
								<label key={cat.value} className="flex items-center">
									<input
										type="checkbox"
										checked={formData.categorias.includes(cat.value)}
										onChange={() => toggleCategoria(cat.value)}
										className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
									/>
									<span className="ml-2 text-gray-700 text-sm">
										{cat.label}
									</span>
								</label>
							))}
						</div>
						{formData.categorias.length === 0 && (
							<p className="text-sm text-red-500 mt-1">
								Debe seleccionar al menos una categoría
							</p>
						)}
					</div>
				</div>
			</AdminModal>

			<DeleteConfirmation
				isOpen={isDeleteOpen}
				title="Eliminar Producto"
				message={`¿Está seguro de que desea eliminar el producto "${selectedProducto?.nombre}"? Esta acción no se puede deshacer.`}
				onConfirm={handleConfirmDelete}
				onCancel={() => setIsDeleteOpen(false)}
				isLoading={isSubmitting}
			/>
		</div>
	);
}
