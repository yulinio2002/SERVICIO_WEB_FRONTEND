import { useState, useEffect } from "react";
import {
	listarServicios,
	crearServicio,
	actualizarServicio,
	eliminarServicio,
	obtenerServicio,
} from "@services/servicio/Servicio";
import { Service, ServiceSummary } from "@interfaces/servicio/Service";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";
import Alert from "./Alert";

export default function ServiciosSection() {
	const [servicios, setServicios] = useState<ServiceSummary[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState({
		nombre: "",
		descripcion: "",
		content: "",
		imagenUrl: "",
		features: "", // Cadena separada por comas o saltos de línea
		galleryImages: [] as string[], // Array para URLs de galería
	});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [selectedServicio, setSelectedServicio] =
		useState<ServiceSummary | null>(null);

	useEffect(() => {
		loadServicios();
	}, []);

	const loadServicios = async () => {
		try {
			setLoading(true);
			const data = await listarServicios();
			setServicios(data);
			setError(null);
		} catch (err) {
			setError("Error al cargar servicios");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModal = async (servicio?: ServiceSummary) => {
		if (servicio) {
			setEditingId(servicio.id);

			try {
				// Obtener el servicio completo para editar todos los campos
				const servicioCompleto = await obtenerServicio(servicio.id);

				// Convertir array de features a string separado por saltos de línea
				const featuresText = servicioCompleto.features?.join("\n") || "";

				// Obtener URLs de galleryImages
				const galleryUrls =
					servicioCompleto.galleryImages?.map((img) => img.url) || [];

				setFormData({
					nombre: servicioCompleto.title,
					descripcion: servicioCompleto.description || "",
					content: servicioCompleto.content || "",
					imagenUrl: servicioCompleto.images?.[0] || "",
					features: featuresText,
					galleryImages: galleryUrls,
				});
			} catch (err) {
				console.error("Error al cargar detalles del servicio:", err);
				// Si falla, cargar al menos los datos básicos
				setFormData({
					nombre: servicio.title,
					descripcion: "",
					content: "",
					imagenUrl: servicio.image,
					features: "",
					galleryImages: [],
				});
			}
		} else {
			setEditingId(null);
			setFormData({
				nombre: "",
				descripcion: "",
				content: "",
				imagenUrl: "",
				features: "",
				galleryImages: [],
			});
		}
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setFormData({
			nombre: "",
			descripcion: "",
			content: "",
			imagenUrl: "",
			features: "",
			galleryImages: [],
		});
	};

	const handleSubmit = async () => {
		if (
			!formData.nombre.trim() ||
			!formData.descripcion.trim() ||
			!formData.imagenUrl.trim()
		) {
			setError(
				"Los campos Nombre, Descripción e Imagen principal son obligatorios",
			);
			return;
		}

		setIsSubmitting(true);
		try {
			// Convertir features de texto a array
			const featuresArray = formData.features
				.split("\n")
				.map((f) => f.trim())
				.filter((f) => f.length > 0);

			// Crear objeto Service completo
			const serviceData: Service = {
				id: editingId || 0,
				title: formData.nombre,
				slug: formData.nombre
					.toLowerCase()
					.replace(/\s+/g, "-")
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, ""),
				description: formData.descripcion,
				content: formData.content,
				features: featuresArray,
				images: [formData.imagenUrl],
				galleryImages: formData.galleryImages.map((url, index) => ({
					id: index,
					url: url,
					alt: formData.nombre,
				})),
			};

			if (editingId) {
				await actualizarServicio(editingId, serviceData);
				setSuccess("Servicio actualizado exitosamente");
			} else {
				await crearServicio(serviceData);
				setSuccess("Servicio creado exitosamente");
			}

			await loadServicios();
			handleCloseModal();
			setError(null);
		} catch (err) {
			setError("Error al guardar servicio");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteClick = (servicio: ServiceSummary) => {
		setSelectedServicio(servicio);
		setIsDeleteOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!selectedServicio) return;

		setIsSubmitting(true);
		try {
			await eliminarServicio(selectedServicio.id);
			await loadServicios();
			setIsDeleteOpen(false);
			setSuccess("Servicio eliminado exitosamente");
			setError(null);
		} catch (err) {
			setError("Error al eliminar servicio");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAddGalleryImage = () => {
		setFormData({
			...formData,
			galleryImages: [...formData.galleryImages, ""],
		});
	};

	const handleRemoveGalleryImage = (index: number) => {
		setFormData({
			...formData,
			galleryImages: formData.galleryImages.filter((_, i) => i !== index),
		});
	};

	const handleGalleryImageChange = (index: number, value: string) => {
		const newGalleryImages = [...formData.galleryImages];
		newGalleryImages[index] = value;
		setFormData({
			...formData,
			galleryImages: newGalleryImages,
		});
	};

	if (loading) {
		return <div className="text-center py-8">Cargando servicios...</div>;
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
				<h2 className="text-2xl font-bold">Servicios</h2>
				<button
					onClick={() => handleOpenModal()}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					+ Nuevo Servicio
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{servicios.map((servicio) => (
					<div
						key={servicio.id}
						className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
					>
						{servicio.image && (
							<img
								src={servicio.image}
								alt={servicio.title}
								className="w-full h-32 object-cover rounded mb-3"
							/>
						)}
						<h3 className="font-bold text-lg mb-2">{servicio.title}</h3>
						<p className="text-sm text-gray-600 mb-3 line-clamp-2">
							ID: {servicio.id} | Slug: {servicio.slug}
						</p>
						<div className="flex gap-2">
							<button
								onClick={() => handleOpenModal(servicio)}
								className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm"
							>
								Editar
							</button>
							<button
								onClick={() => handleDeleteClick(servicio)}
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
				title={editingId ? "Editar Servicio" : "Nuevo Servicio"}
				onClose={handleCloseModal}
				onSubmit={handleSubmit}
				isLoading={isSubmitting}
			>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Nombre del servicio *
						</label>
						<input
							type="text"
							value={formData.nombre}
							onChange={(e) =>
								setFormData({ ...formData, nombre: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Ej: Fabricación de Sistemas"
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
							placeholder="Descripción breve que aparecerá en la lista"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Contenido detallado
						</label>
						<textarea
							value={formData.content}
							onChange={(e) =>
								setFormData({ ...formData, content: e.target.value })
							}
							rows={4}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Contenido completo que aparecerá en la página del servicio"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Características (una por línea)
						</label>
						<textarea
							value={formData.features}
							onChange={(e) =>
								setFormData({ ...formData, features: e.target.value })
							}
							rows={4}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Cada característica en una línea nueva"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Ejemplo:
							<br />
							Característica 1<br />
							Característica 2<br />
							Característica 3
						</p>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							URL de imagen principal *
						</label>
						<input
							type="url"
							value={formData.imagenUrl}
							onChange={(e) =>
								setFormData({ ...formData, imagenUrl: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="https://ejemplo.com/imagen-principal.jpg"
							required
						/>
					</div>

					<div>
						<div className="flex justify-between items-center mb-2">
							<label className="block text-sm font-medium text-gray-700">
								Galería de imágenes
							</label>
							<button
								type="button"
								onClick={handleAddGalleryImage}
								className="text-sm bg-green-100 text-green-700 hover:bg-green-200 py-1 px-3 rounded"
							>
								+ Agregar imagen
							</button>
						</div>

						{formData.galleryImages.map((url, index) => (
							<div key={index} className="flex gap-2 mb-2">
								<input
									type="url"
									value={url}
									onChange={(e) =>
										handleGalleryImageChange(index, e.target.value)
									}
									className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									placeholder={`URL imagen ${index + 1}`}
								/>
								<button
									type="button"
									onClick={() => handleRemoveGalleryImage(index)}
									className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-md"
								>
									×
								</button>
							</div>
						))}

						{formData.galleryImages.length === 0 && (
							<p className="text-sm text-gray-500 italic">
								No hay imágenes en la galería. Agrega al menos una para la vista
								de detalle.
							</p>
						)}
					</div>
				</div>
			</AdminModal>

			<DeleteConfirmation
				isOpen={isDeleteOpen}
				title="Eliminar Servicio"
				message={`¿Está seguro de que desea eliminar el servicio "${selectedServicio?.title}"? Esta acción no se puede deshacer.`}
				onConfirm={handleConfirmDelete}
				onCancel={() => setIsDeleteOpen(false)}
				isLoading={isSubmitting}
			/>
		</div>
	);
}
