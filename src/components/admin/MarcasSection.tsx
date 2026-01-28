import { useState, useEffect, useRef } from "react";
import { crearMarca, editarMarca, listarMarcas, Marca } from "@services/marca/Marca";
import Api from "@services/api";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";
import Alert from "./Alert";

export default function MarcasSection() {
	const [marcas, setMarcas] = useState<Marca[]>([]);
	const [loading, setLoading] = useState(true);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [nombre, setNombre] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [marcaToDelete, setMarcaToDelete] = useState<Marca | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		loadMarcas();
	}, []);

	const loadMarcas = async () => {
		try {
			setLoading(true);
			const data = await listarMarcas();
			setMarcas(data);
			setError(null);
		} catch (err) {
			setError("Error al cargar marcas");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setImagePreview(URL.createObjectURL(file));
			setExistingImageUrl(null);
		}
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleOpenModal = (marca?: Marca) => {
		if (marca) {
			setNombre(marca.nombre);
			setEditingId(marca.id || null);
			setExistingImageUrl(marca.imagenUrl);
			setImageFile(null);
			setImagePreview(null);
		} else {
			setNombre("");
			setEditingId(null);
			setExistingImageUrl(null);
			setImageFile(null);
			setImagePreview(null);
		}
		setIsModalOpen(true);
		console.log(marca)
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setNombre("");
		setEditingId(null);
		setExistingImageUrl(null);
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
		setError(null);
	};

	const handleSubmit = async () => {
		if (!nombre.trim()) {
			setError("El nombre es obligatorio");
			return;
		}

		// Validación de imagen
		if (!editingId && !imageFile) {
			setError("Debe subir una imagen para crear la marca");
			return;
		}

		// En edición, debe haber imagen existente o nueva
		if (editingId && !existingImageUrl && !imageFile) {
			setError("La marca debe tener una imagen");
			return;
		}

		setIsSubmitting(true);
		try {
			const formDataToSend = new FormData();
			formDataToSend.append("nombre", nombre);

			// Agregar imagen si hay archivo nuevo
			if (imageFile) {
				formDataToSend.append("file", imageFile);
			}

			let marcaActualizada : Marca = {} as Marca;
			if (editingId) {
				// Para edición
				marcaActualizada = await editarMarca(editingId, formDataToSend);
				// Actualizar estado
				setMarcas((prevMarcas) =>
					prevMarcas.map((marca) =>
						marca.id === marcaActualizada.id ? marcaActualizada : marca,
					),
				);
				setSuccess("Marca actualizada exitosamente");
			} else {
				// Crear nueva marca
				marcaActualizada = await crearMarca(formDataToSend);
				setMarcas((prevMarcas) => [...prevMarcas, marcaActualizada]);
				setSuccess("Marca creada exitosamente");
			}
			handleCloseModal();
			setError(null);
		} catch (err: any) {
			const errorMessage =
				err.response?.data?.message || err.message || "Error al guardar marca";
			setError(errorMessage);
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteClick = (marca: Marca) => {
		setMarcaToDelete(marca);
		setIsDeleteOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!marcaToDelete?.id) return;

		setIsSubmitting(true);
		try {
			const api = await Api.getInstance();
			await api.delete({
				url: `/api/marcas/${marcaToDelete.id}`,
			});

			// Actualizar estado local
			setMarcas((prevMarcas) =>
				prevMarcas.filter((marca) => marca.id !== marcaToDelete.id),
			);

			setIsDeleteOpen(false);
			setSuccess("Marca eliminada exitosamente");
			setError(null);
			setMarcaToDelete(null);
		} catch (err: any) {
			setError("Error al eliminar marca");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancelDelete = () => {
		setIsDeleteOpen(false);
		setMarcaToDelete(null);
	};

	if (loading) {
		return <div className="text-center py-8">Cargando marcas...</div>;
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
				<h2 className="text-2xl font-bold">Marcas</h2>
				<button
					onClick={() => handleOpenModal()}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					+ Nueva Marca
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{marcas.map((marca) => (
					<div
						key={marca.id}
						className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
					>
						{marca.imagenUrl && (
							<img
								src={marca.imagenUrl}
								alt={marca.nombre}
								className="w-full h-32 object-contain rounded mb-3 bg-gray-100"
								onError={(e) => {
									// Fallback si la imagen no carga
									e.currentTarget.src =
										"https://via.placeholder.com/150x128?text=Imagen+no+disponible";
								}}
							/>
						)}
						<h3 className="font-bold text-lg mb-3 text-center">
							{marca.nombre}
						</h3>
						<div className="flex gap-2">
							<button
								onClick={() => handleOpenModal(marca)}
								className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm"
							>
								Editar
							</button>
							<button
								onClick={() => handleDeleteClick(marca)}
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
				title={editingId ? "Editar Marca" : "Nueva Marca"}
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
							value={nombre}
							onChange={(e) => setNombre(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Nombre de la marca"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Imagen {!editingId ? "*" : ""}
						</label>

						{/* Vista previa de imagen existente o nueva */}
						{(existingImageUrl || imagePreview) && (
							<div className="mb-3">
								<p className="text-sm text-gray-600 mb-1">Vista previa:</p>
								<img
									src={imagePreview || existingImageUrl || ""}
									alt="Vista previa"
									className="w-full h-32 object-contain border rounded bg-gray-100"
								/>
							</div>
						)}

						<div className="flex items-center gap-3">
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>

							{(imagePreview || (editingId && existingImageUrl)) && (
								<button
									type="button"
									onClick={removeImage}
									className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm"
								>
									Quitar
								</button>
							)}
						</div>

						<p className="text-xs text-gray-500 mt-1">
							{editingId
								? "Deje vacío para mantener la imagen actual"
								: "Seleccione una imagen para la marca"}
						</p>
					</div>
				</div>
			</AdminModal>

			<DeleteConfirmation
				isOpen={isDeleteOpen}
				title="Eliminar Marca"
				message={`¿Está seguro de que desea eliminar la marca "${marcaToDelete?.nombre}"? Esta acción no se puede deshacer.`}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				isLoading={isSubmitting}
			/>
		</div>
	);
}
