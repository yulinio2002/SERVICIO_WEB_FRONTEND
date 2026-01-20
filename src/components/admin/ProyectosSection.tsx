import { useState, useEffect } from "react";
import Api from "@services/api";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";

interface Proyecto {
  id: number;
  nombre: string;
  img_url: string;
  descripcion: string;
}

export default function ProyectosSection() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    img_url: "",
    descripcion: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(
    null
  );

  useEffect(() => {
    loadProyectos();
  }, []);

  const loadProyectos = async () => {
    try {
      setLoading(true);
      const api = await Api.getInstance();
      const response = await api.get<null, Proyecto[]>({
        url: "/api/proyectos",
      });
      setProyectos(response.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar proyectos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (proyecto?: Proyecto) => {
    if (proyecto) {
      setFormData({
        nombre: proyecto.nombre,
        img_url: proyecto.img_url,
        descripcion: proyecto.descripcion,
      });
      setEditingId(proyecto.id);
    } else {
      setFormData({ nombre: "", img_url: "", descripcion: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ nombre: "", img_url: "", descripcion: "" });
  };

  const handleSubmit = async () => {
    if (
      !formData.nombre.trim() ||
      !formData.img_url.trim() ||
      !formData.descripcion.trim()
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setIsSubmitting(true);
    try {
      const api = await Api.getInstance();
      if (editingId) {
        await api.put(formData, { url: `/api/proyectos/${editingId}` });
      } else {
        await api.post(formData, { url: "/api/proyectos" });
      }
      await loadProyectos();
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError("Error al guardar proyecto");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProyecto) return;

    setIsSubmitting(true);
    try {
      const api = await Api.getInstance();
      await api.delete({ url: `/api/proyectos/${selectedProyecto.id}` });
      await loadProyectos();
      setIsDeleteOpen(false);
      setError(null);
    } catch (err) {
      setError("Error al eliminar proyecto");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando proyectos...</div>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
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
        {proyectos.map((proyecto) => (
          <div
            key={proyecto.id}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            {proyecto.img_url && (
              <img
                src={proyecto.img_url}
                alt={proyecto.nombre}
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            <h3 className="font-bold text-lg mb-2">{proyecto.nombre}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {proyecto.descripcion}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal(proyecto)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteClick(proyecto)}
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
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del proyecto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del proyecto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de imagen
            </label>
            <input
              type="url"
              value={formData.img_url}
              onChange={(e) =>
                setFormData({ ...formData, img_url: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>
      </AdminModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        title="Eliminar Proyecto"
        message={`¿Está seguro de que desea eliminar el proyecto "${selectedProyecto?.nombre}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
