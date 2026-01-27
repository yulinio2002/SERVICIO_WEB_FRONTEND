import { useState, useEffect, useRef } from "react";
import {
	listarServicios,
	crearServicioFormData,
	actualizarServicioFormData,
	eliminarServicio,
	obtenerServicio,
} from "@services/servicio/Servicio";
import { ServiceSummary } from "@interfaces/servicio/Service";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";
import Alert from "./Alert";

interface ExistingImage {
	id: number;
	url: string;
	alt: string;
	markedForDelete: boolean;
}

interface NewImage {
	file: File;
	preview: string;
	alt: string;
}

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
		features: "", // Cadena separada por saltos de línea
	});
	const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
	const [newImages, setNewImages] = useState<NewImage[]>([]);
	const [newImageAlts, setNewImageAlts] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [selectedServicio, setSelectedServicio] =
		useState<ServiceSummary | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

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
				const servicioCompleto = await obtenerServicio(servicio.id);

				// Convertir array de features a string separado por saltos de línea
				// Ahora servicioCompleto.features ya es un array gracias al mapper
				const featuresText = servicioCompleto.features?.join("\n") || "";

				setFormData({
					nombre: servicioCompleto.title,
					descripcion: servicioCompleto.description || "",
					content: servicioCompleto.content || "",
					features: featuresText,
				});

				// Cargar imágenes existentes con estado inicial
				const existing = servicioCompleto.galleryImages.map((img) => ({
					id: img.id,
					url: img.url,
					alt: img.alt || "",
					markedForDelete: false,
				}));
				setExistingImages(existing);
				setNewImages([]);
				setNewImageAlts([]);
			} catch (err) {
				console.error("Error al cargar detalles del servicio:", err);
				// Si falla, cargar al menos los datos básicos
				setFormData({
					nombre: servicio.title,
					descripcion: "",
					content: "",
					features: "",
				});
				setExistingImages([]);
				setNewImages([]);
				setNewImageAlts([]);
			}
		} else {
			// Código para nuevo servicio...
		}
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setFormData({
			nombre: "",
			descripcion: "",
			content: "",
			features: "",
		});
		setExistingImages([]);
		setNewImages([]);
		setNewImageAlts([]);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newFiles: NewImage[] = [];
		const newAlts: string[] = [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const preview = URL.createObjectURL(file);
			newFiles.push({
				file,
				preview,
				alt: `Imagen ${newImages.length + i + 1}`,
			});
			newAlts.push(`Imagen ${newImages.length + i + 1}`);
		}

		setNewImages((prev) => [...prev, ...newFiles]);
		setNewImageAlts((prev) => [...prev, ...newAlts]);
	};

	const removeNewImage = (index: number) => {
		setNewImages((prev) => {
			const newArray = [...prev];
			URL.revokeObjectURL(newArray[index].preview);
			newArray.splice(index, 1);
			return newArray;
		});

		setNewImageAlts((prev) => {
			const newArray = [...prev];
			newArray.splice(index, 1);
			return newArray;
		});
	};

	const updateNewImageAlt = (index: number, alt: string) => {
		setNewImageAlts((prev) => {
			const newArray = [...prev];
			newArray[index] = alt;
			return newArray;
		});

		setNewImages((prev) => {
			const newArray = [...prev];
			newArray[index] = { ...newArray[index], alt };
			return newArray;
		});
	};

	const toggleMarkForDelete = (id: number) => {
		setExistingImages((prev) =>
			prev.map((img) =>
				img.id === id ? { ...img, markedForDelete: !img.markedForDelete } : img,
			),
		);
	};

	const handleSubmit = async () => {
		// Validaciones para crear (todos los campos obligatorios)
		if (
			!formData.nombre.trim() ||
			!formData.descripcion.trim() ||
			!formData.content.trim() ||
			!formData.features.trim()
		) {
			setError("Todos los campos de texto son obligatorios");
			return;
		}

		// Validación para crear: al menos una imagen
		if (!editingId && newImages.length === 0) {
			setError("Debe cargar al menos una imagen al crear un servicio");
			return;
		}

		// Validación para editar: si se marcan todas las imágenes para eliminar, debe haber nuevas
		if (editingId) {
			const allMarkedForDelete =
				existingImages.length > 0 &&
				existingImages.every((img) => img.markedForDelete);
			if (allMarkedForDelete && newImages.length === 0) {
				setError(
					"Debe cargar al menos una imagen nueva si elimina todas las existentes",
				);
				return;
			}
		}

		setIsSubmitting(true);
		try {
			const formDataToSend = new FormData();

			if (editingId) {
				// Para editar: enviar JSON en campo "data"
				const imagesToKeep = existingImages.filter(
					(img) => !img.markedForDelete,
				);

				const dataObj = {
					nombre: formData.nombre,
					descripcion: formData.descripcion,
					content: formData.content,
					features: formData.features
						.split("\n")
						.map((f) => f.trim())
						.filter((f) => f.length > 0)
						.join(";"),
					idImages: imagesToKeep.map((img) => img.id),
				};

				formDataToSend.append("data", JSON.stringify(dataObj));

				// Agregar nuevas imágenes si las hay
				newImages.forEach((imgFile, index) => {
					formDataToSend.append("files", imgFile.file);
					formDataToSend.append(
						"alt",
						newImageAlts[index] || `Imagen ${index + 1}`,
					);
				});

				await actualizarServicioFormData(editingId, formDataToSend);
				setSuccess("Servicio actualizado exitosamente");
			} else {
				// Para crear: enviar campos individuales
				formDataToSend.append("nombre", formData.nombre);
				formDataToSend.append("descripcion", formData.descripcion);
				formDataToSend.append("content", formData.content);
				formDataToSend.append(
					"features",
					formData.features
						.split("\n")
						.map((f) => f.trim())
						.filter((f) => f.length > 0)
						.join(";"),
				);

				// Agregar imágenes (obligatorias al crear)
				newImages.forEach((imgFile, index) => {
					formDataToSend.append("files", imgFile.file);
					formDataToSend.append(
						"alt",
						newImageAlts[index] || `Imagen ${index + 1}`,
					);
				});

				await crearServicioFormData(formDataToSend);
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
							placeholder="Ej: Fabricación de sistemas a medida"
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
							Contenido detallado *
						</label>
						<textarea
							value={formData.content}
							onChange={(e) =>
								setFormData({ ...formData, content: e.target.value })
							}
							rows={4}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Contenido completo que aparecerá en la página del servicio"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Características (una por línea) *
						</label>
						<textarea
							value={formData.features}
							onChange={(e) =>
								setFormData({ ...formData, features: e.target.value })
							}
							rows={4}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Cada característica en una línea nueva"
							required
						/>
						<p className="text-xs text-gray-500 mt-1">
							Ejemplo:
							<br />
							Característica 1<br />
							Característica 2<br />
							Característica 3
						</p>
					</div>

					{/* Imágenes existentes (solo en edición) */}
					{editingId && existingImages.length > 0 && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Imágenes existentes
							</label>
							<div className="space-y-3">
								{existingImages.map((img) => (
									<div
										key={img.id}
										className={`flex items-center gap-3 p-3 border rounded-md ${
											img.markedForDelete
												? "bg-gray-100 border-gray-300 opacity-60"
												: "bg-white border-gray-200"
										}`}
									>
										<img
											src={img.url}
											alt={img.alt}
											className="w-20 h-20 object-cover rounded"
										/>
										<div className="flex-1">
											<p className="text-sm text-gray-600 truncate">
												{img.url.split("/").pop()}
											</p>
											<p className="text-xs text-gray-500">{img.alt}</p>
										</div>
										<button
											type="button"
											onClick={() => toggleMarkForDelete(img.id)}
											className={`px-3 py-1 rounded text-sm font-medium ${
												img.markedForDelete
													? "bg-green-100 text-green-700 hover:bg-green-200"
													: "bg-red-100 text-red-700 hover:bg-red-200"
											}`}
										>
											{img.markedForDelete ? "Restaurar" : "Eliminar"}
										</button>
									</div>
								))}
							</div>
							<p className="text-xs text-gray-500 mt-2">
								Las imágenes marcadas para eliminar (gris) se eliminarán al
								guardar.
							</p>
						</div>
					)}

					{/* Nuevas imágenes */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							{editingId
								? "Agregar nuevas imágenes (opcional)"
								: "Cargar imágenes *"}
						</label>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							multiple
							onChange={handleFileChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Puede seleccionar múltiples imágenes (JPG, PNG, etc.)
						</p>

						{/* Vista previa de nuevas imágenes */}
						{newImages.length > 0 && (
							<div className="mt-4 space-y-3">
								{newImages.map((imgFile, index) => (
									<div
										key={index}
										className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-white"
									>
										<img
											src={imgFile.preview}
											alt="Vista previa"
											className="w-20 h-20 object-cover rounded"
										/>
										<div className="flex-1">
											<p className="text-sm font-medium text-gray-700">
												{imgFile.file.name}
											</p>
											<input
												type="text"
												value={newImageAlts[index] || ""}
												onChange={(e) =>
													updateNewImageAlt(index, e.target.value)
												}
												placeholder="Descripción de la imagen"
												className="mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded"
											/>
										</div>
										<button
											type="button"
											onClick={() => removeNewImage(index)}
											className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm font-medium"
										>
											Eliminar
										</button>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Validación de imágenes para crear */}
					{!editingId && newImages.length === 0 && (
						<div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
							<p className="text-sm text-yellow-700">
								Debe cargar al menos una imagen para crear el servicio.
							</p>
						</div>
					)}

					{/* Validación de imágenes para editar */}
					{editingId &&
						existingImages.every((img) => img.markedForDelete) &&
						newImages.length === 0 && (
							<div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
								<p className="text-sm text-yellow-700">
									Si elimina todas las imágenes existentes, debe cargar al menos
									una nueva imagen.
								</p>
							</div>
						)}
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
