import { useState, useEffect } from "react";
import Api from "@services/api";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";
import Alert from "./Alert";

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
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		nombre: "",
		img_url: "",
		descripcion: "",
		content: "",
		marca: "",
		featuresText: "", // Para el textarea, luego se convierte a array
		categorias: [] as string[],
	});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
		null
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

	const handleOpenModal = (producto?: Producto) => {
		if (producto) {
			// Convertir array de features a texto (una por línea)
			const featuresText = producto.features?.join('\n') || "";

			setFormData({
				nombre: producto.nombre,
				img_url: producto.img_url,
				descripcion: producto.descripcion,
				content: producto.content || "",
				marca: producto.marca,
				featuresText: featuresText,
				categorias: producto.categorias || [],
			});
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
		if (!formData.img_url.trim()) {
			setError("La URL de imagen es obligatoria");
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

		setIsSubmitting(true);
		try {
			const api = await Api.getInstance();

			// Preparar datos según ProductoRequestDto
			const requestData = {
				nombre: formData.nombre,
				img_url: formData.img_url,
				descripcion: formData.descripcion,
				content: formData.content,
				marca: formData.marca,
				categorias: formData.categorias.map((cat) =>
					cat
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "") // quitar acentos
						.trim()
						.toUpperCase()
						.replace(/\s+/g, "_"),
				),
				// Convertir texto de features a array para featuresList
				featuresList: formData.featuresText
					.split("\n")
					.map((f) => f.trim())
					.filter((f) => f.length > 0),
			};

			if (editingId) {
				await api.put(requestData, { url: `/api/productos/${editingId}` });
				setSuccess("Producto actualizado exitosamente");
			} else {
				await api.post(requestData, { url: "/api/productos" });
				setSuccess("Producto creado exitosamente");
			}

			await loadProductos();
			handleCloseModal();
			setError(null);
		} catch (err: any) {
			console.error("Error detallado:", err);

			// Manejar errores específicos del backend
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
				<Alert
					type="error"
					message={error}
					onClose={() => setError(null)}
				/>
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
				<button
					onClick={() => handleOpenModal()}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					+ Nuevo Producto
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{productos.map((producto) => (
					<div
						key={producto.id}
						className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
					>
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
							<strong>Categorías:</strong> {producto.categorias?.join(", ") || "Sin categorías"}
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
				))}
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
							URL de imagen *
						</label>
						<input
							type="url"
							value={formData.img_url}
							onChange={(e) =>
								setFormData({ ...formData, img_url: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="https://ejemplo.com/imagen.jpg"
							required
						/>
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