import { useState, useEffect } from "react";
import Api from "@services/api";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";
import Alert from "./Alert";
import {
	actualizarProducto,
	agregarProductoDestacado,
	crearProducto,
	eliminarProductoDestacado,
	listarProductosDestacados,
} from "@services/producto/Producto.ts";

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

export default function ProductosSection() {
	const [productos, setProductos] = useState<Producto[]>([]);
	const [productosDestacados, setProductosDestacados] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);
	const [, setLoadingDestacados] = useState(true);
	const [isSubmittingDestacado, setIsSubmittingDestacado] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		nombre: "",
		img_url: "", // Mantenemos para mostrar imagen existente
		descripcion: "",
		content: "",
		marca: "",
		featuresText: "", // Para el textarea, luego se convierte a array
		categorias: [] as string[],
	});
	const [selectedFile, setSelectedFile] = useState<File | null>(null); // Nuevo estado para el archivo
	const [imagePreview, setImagePreview] = useState<string | null>(null); // Para previsualizar imagen
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
		null,
	);

	// Categorías estáticas actualizadas
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

	useEffect(() => {
		loadProductos();
		loadProductosDestacados();
	}, []);

	const loadProductos = async () => {
		try {
			setLoading(true);
			const api = await Api.getInstance();
			const response = await api.get<null, Producto[]>({
				url: "/api/productos",
			});
			setProductos(response.data);
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
				// Eliminar de destacados
				const success = await eliminarProductoDestacado(productoId);
				if (success) {
					setProductosDestacados((prev) =>
						prev.filter((id) => id !== productoId),
					);
					setSuccess("Producto eliminado de destacados");
				}
			} else {
				// Agregar a destacados
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

	const handleOpenModal = (producto?: Producto) => {
		if (producto) {
			const featuresText = producto.features?.join("\n") || "";
			setFormData({
				nombre: producto.nombre,
				img_url: producto.img_url,
				descripcion: producto.descripcion,
				content: producto.content || "",
				marca: producto.marca,
				featuresText: featuresText,
				categorias: producto.categorias || [],
			});
			setImagePreview(producto.img_url); // Mostrar imagen existente
			setEditingId(producto.id);
		} else {
			setFormData({
				nombre: "",
				img_url: "",
				descripcion: "",
				content: "",
				marca: "",
				featuresText: "",
				categorias: [],
			});
			setImagePreview(null);
			setSelectedFile(null);
			setEditingId(null);
		}
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setFormData({
			nombre: "",
			img_url: "",
			descripcion: "",
			content: "",
			marca: "",
			featuresText: "",
			categorias: [],
		});
		setImagePreview(null);
		setSelectedFile(null);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validar tipo de archivo
			if (!file.type.startsWith("image/")) {
				setError(
					"Por favor, selecciona un archivo de imagen válido (JPG, PNG, etc.)",
				);
				return;
			}

			// Validar tamaño (ej: 5MB máximo)
			if (file.size > 5 * 1024 * 1024) {
				setError("La imagen es demasiado grande. Máximo 5MB.");
				return;
			}

			setSelectedFile(file);

			// Crear preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);

			// Limpiar URL de imagen si había una
			setFormData((prev) => ({ ...prev, img_url: "" }));
			setError(null);
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
		// Validaciones de campos de texto
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
		if (!selectedFile && !editingId) {
			setError("Debe seleccionar una imagen para el producto");
			return;
		}

		// Para edición: si no hay nueva imagen pero hay preview (imagen existente)
		// necesitamos manejar esto según lo que soporte el backend
		if (editingId && !selectedFile && !imagePreview) {
			setError("El producto debe tener una imagen");
			return;
		}

		setIsSubmitting(true);
		try {
			// Preparar array de categorías formateadas
			const categoriasFormatted = formData.categorias.map((cat) =>
				cat
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.trim()
					.toUpperCase()
					.replace(/\s+/g, "_"),
			);

			// Preparar features
			const featuresText = formData.featuresText
				.split("\n")
				.map((f) => f.trim())
				.filter((f) => f.length > 0)
				.join(";");

			if (editingId) {
				// Para edición
				if (selectedFile) {
					// Si se subió nueva imagen
					const requestData = {
						file: selectedFile,
						nombre: formData.nombre,
						marca: formData.marca,
						descripcion: formData.descripcion,
						content: formData.content,
						features: featuresText,
						categorias: categoriasFormatted,
					};
					await actualizarProducto(editingId, requestData);
				} else {
					// Si no hay nueva imagen, usar el endpoint JSON existente
					const api = await Api.getInstance();
					const requestData = {
						nombre: formData.nombre,
						img_url: imagePreview || "", // Mantener imagen existente
						descripcion: formData.descripcion,
						content: formData.content,
						marca: formData.marca,
						categorias: categoriasFormatted,
						featuresList: formData.featuresText
							.split("\n")
							.map((f) => f.trim())
							.filter((f) => f.length > 0),
					};
					await api.put(requestData, { url: `/api/productos/${editingId}` });
				}
				setSuccess("Producto actualizado exitosamente");
			} else {
				// Para creación - siempre requiere archivo
				if (!selectedFile) {
					setError("Debe seleccionar una imagen para crear un producto");
					return;
				}

				const requestData = {
					file: selectedFile,
					nombre: formData.nombre,
					marca: formData.marca,
					descripcion: formData.descripcion,
					content: formData.content,
					features: featuresText,
					categorias: categoriasFormatted,
				};

				await crearProducto(requestData);
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
			await loadProductos();
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

					return (
						<div
							key={producto.id}
							className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow relative"
						>
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
								{producto.categorias?.join(", ") || "Sin categorías"}
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
							Imagen del producto *
						</label>

						{/* Preview de imagen */}
						{imagePreview && (
							<div className="mb-3">
								<img
									src={imagePreview}
									alt="Vista previa"
									className="w-32 h-32 object-cover rounded-md border border-gray-300"
								/>
								<p className="text-xs text-gray-500 mt-1">
									Vista previa de la imagen
								</p>
							</div>
						)}

						{/* Input para subir archivo */}
						<input
							type="file"
							accept="image/*"
							onChange={handleFileChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Formatos aceptados: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB
							{editingId && (
								<span className="block mt-1">
									Deja vacío para mantener la imagen actual
								</span>
							)}
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Categorías * (seleccione al menos una)
						</label>
						<div className="grid grid-cols-2 gap-2">
							{categorias.map((cat) => (
								<label key={cat} className="flex items-center">
									<input
										type="checkbox"
										checked={formData.categorias.includes(cat)}
										onChange={() => toggleCategoria(cat)}
										className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
									/>
									<span className="ml-2 text-gray-700 text-sm">{cat}</span>
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