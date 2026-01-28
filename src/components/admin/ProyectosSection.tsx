import { useEffect, useRef, useState } from "react";
import Api from "@services/api";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";
import Alert from "./Alert";

type BackendFoto = {
	id: number;
	imagenUrl: string; // ✅ es el nombre real
	alt?: string | null;
};

type BackendProyecto = {
	id: number;
	nombre: string;
	descripcion: string;
	foto?: BackendFoto | null;
};

type BackendProyectoCreateResponse = {
	id: number;
	nombre: string;
	descripcion: string;
	foto: BackendFoto;
};

type ProyectoUI = {
	id: number;
	nombre: string;
	descripcion: string;
	imageUrl: string | null;
};

const mapToUI = (p: BackendProyecto): ProyectoUI => ({
	id: p.id,
	nombre: p.nombre,
	descripcion: p.descripcion,
	imageUrl: p.foto?.imagenUrl ?? null, // ✅ aquí también
});

const mapCreateToUI = (p: BackendProyectoCreateResponse): ProyectoUI => ({
	id: p.id,
	nombre: p.nombre,
	descripcion: p.descripcion,
	imageUrl: p.foto?.imagenUrl ?? null, // ✅ aquí también
});

export default function ProyectosSection() {
	const [proyectos, setProyectos] = useState<ProyectoUI[]>([]);
	const [loading, setLoading] = useState(true);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);

	const [editingId, setEditingId] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");

	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const [proyectoToDelete, setProyectoToDelete] = useState<ProyectoUI | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		loadProyectos();
	}, []);

	const loadProyectos = async () => {
		try {
			setLoading(true);
			const api = await Api.getInstance();
			const resp = await api.get<null, BackendProyecto[]>({ url: "/api/proyectos" });
			setProyectos(resp.data.map(mapToUI));
			setError(null);
		} catch (err) {
			setError("Error al cargar proyectos");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleOpenModal = (proyecto?: ProyectoUI) => {
		if (proyecto) {
			setEditingId(proyecto.id);
			setNombre(proyecto.nombre);
			setDescripcion(proyecto.descripcion);
			setExistingImageUrl(proyecto.imageUrl);
			setImageFile(null);
			setImagePreview(null);
		} else {
			setEditingId(null);
			setNombre("");
			setDescripcion("");
			setExistingImageUrl(null);
			setImageFile(null);
			setImagePreview(null);
		}
		setIsModalOpen(true);
		setError(null);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setEditingId(null);
		setNombre("");
		setDescripcion("");
		setExistingImageUrl(null);
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
		setError(null);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
		setExistingImageUrl(null);
	};

	// Mantengo el dummy file por tu PUT @RequestParam("file") obligatorio
	const buildMultipart = (): FormData => {
		const fd = new FormData();
		fd.append("nombre", nombre.trim());
		fd.append("descripcion", descripcion.trim());

		if (imageFile) {
			fd.append("file", imageFile);
		} else if (editingId) {
			fd.append("file", new File([], "empty.jpg", { type: "image/jpeg" }));
		}
		return fd;
	};

	const validateForm = () => {
		if (!nombre.trim()) return "El nombre es obligatorio";
		if (!descripcion.trim()) return "La descripción es obligatoria";

		if (!editingId && !imageFile) return "Debe subir una imagen para crear el proyecto";
		if (editingId && !existingImageUrl && !imageFile)
			return "El proyecto debe tener una imagen (suba una imagen)";

		return null;
	};

	const handleSubmit = async () => {
		const v = validateForm();
		if (v) {
			setError(v);
			return;
		}

		setIsSubmitting(true);
		try {
			const api = await Api.getInstance();
			const fd = buildMultipart();

			if (editingId) {
				const resp = await api.put<FormData, BackendProyecto>(fd, {
					url: `/api/proyectos/${editingId}`,
				});

				// ✅ ahora sí mapea correctamente porque usa foto.imagenUrl
				const actualizado = mapToUI(resp.data);

				setProyectos((prev) =>
					prev.map((p) => (p.id === actualizado.id ? actualizado : p)),
				);

				setSuccess("Proyecto actualizado exitosamente");
				handleCloseModal();
				setError(null);
				return;
			}

			const resp = await api.post<FormData, BackendProyectoCreateResponse>(fd, {
				url: "/api/proyectos",
			});

      await loadProyectos();

      setSuccess("Proyecto creado exitosamente");
      handleCloseModal();
      setError(null);
      return;
		} catch (err: any) {
			const msg =
				err?.response?.data?.message || err?.message || "Error al guardar proyecto";
			setError(msg);
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteClick = (p: ProyectoUI) => {
		setProyectoToDelete(p);
		setIsDeleteOpen(true);
	};

	const handleConfirmDelete = async () => {
		if (!proyectoToDelete?.id) return;

		setIsSubmitting(true);
		try {
			const api = await Api.getInstance();
			await api.delete({ url: `/api/proyectos/${proyectoToDelete.id}` });

			setProyectos((prev) => prev.filter((x) => x.id !== proyectoToDelete.id));

			setSuccess("Proyecto eliminado exitosamente");
			setError(null);
			setProyectoToDelete(null);
			setIsDeleteOpen(false);
		} catch (err) {
			setError("Error al eliminar proyecto");
			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCancelDelete = () => {
		setIsDeleteOpen(false);
		setProyectoToDelete(null);
	};

	const removeImage = () => {
		setImageFile(null);
		setImagePreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	if (loading) return <div className="text-center py-8">Cargando proyectos...</div>;

	return (
		<div>
			{error && (
				<Alert type="error" message={error} onClose={() => setError(null)} />
			)}
			{success && (
				<Alert type="success" message={success} onClose={() => setSuccess(null)} />
			)}

			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold">Proyectos</h2>
				<button
					onClick={() => handleOpenModal()}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				>
					+ Nuevo Proyecto
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{proyectos.map((p) => (
					<div
						key={p.id}
						className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
					>
						{p.imageUrl && (
							<img
								src={p.imageUrl}
								alt={p.nombre}
								className="w-full h-32 object-cover rounded mb-3 bg-gray-100"
								onError={(e) => {
									e.currentTarget.src =
										"https://via.placeholder.com/300x160?text=Imagen+no+disponible";
								}}
							/>
						)}

						<h3 className="font-bold text-lg mb-2">{p.nombre}</h3>
						<p className="text-sm text-gray-600 mb-3 line-clamp-2">
							{p.descripcion}
						</p>

						<div className="flex gap-2">
							<button
								onClick={() => handleOpenModal(p)}
								className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm"
							>
								Editar
							</button>
							<button
								onClick={() => handleDeleteClick(p)}
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
				title={editingId ? "Editar Proyecto" : "Nuevo Proyecto"}
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
							placeholder="Nombre del proyecto"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Descripción *
						</label>
						<textarea
							value={descripcion}
							onChange={(e) => setDescripcion(e.target.value)}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Descripción del proyecto"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Imagen {!editingId ? "*" : ""}
						</label>

						{(imagePreview || existingImageUrl) && (
							<div className="mb-3">
								<p className="text-sm text-gray-600 mb-1">Vista previa:</p>
								<img
									src={imagePreview || existingImageUrl || ""}
									alt="Vista previa"
									className="w-full h-32 object-cover border rounded bg-gray-100"
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
								: "Seleccione una imagen para el proyecto"}
						</p>
					</div>
				</div>
			</AdminModal>

			<DeleteConfirmation
				isOpen={isDeleteOpen}
				title="Eliminar Proyecto"
				message={`¿Está seguro de que desea eliminar el proyecto "${proyectoToDelete?.nombre}"? Esta acción no se puede deshacer.`}
				onConfirm={handleConfirmDelete}
				onCancel={handleCancelDelete}
				isLoading={isSubmitting}
			/>
		</div>
	);
}
