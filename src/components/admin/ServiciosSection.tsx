import { useState, useEffect } from "react";
import {
  listarServicios,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
} from "@services/servicio/Servicio";
import { Service, ServiceSummary } from "@interfaces/servicio/Service";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";

export default function ServiciosSection() {
  const [servicios, setServicios] = useState<ServiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    imagenUrl: "",
    descripcion: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedServicio, setSelectedServicio] = useState<ServiceSummary | null>(
    null
  );

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

  const handleOpenModal = (servicio?: ServiceSummary) => {
    if (servicio) {
      setFormData({
        nombre: servicio.title,
        imagenUrl: servicio.image,
        descripcion: "",
      });
      setEditingId(servicio.id);
    } else {
      setFormData({ nombre: "", imagenUrl: "", descripcion: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ nombre: "", imagenUrl: "", descripcion: "" });
  };

  const handleSubmit = async () => {
    if (
      !formData.nombre.trim() ||
      !formData.imagenUrl.trim() ||
      !formData.descripcion.trim()
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setIsSubmitting(true);
    try {
      const serviceData: Service = {
        id: editingId || 0,
        title: formData.nombre,
        slug: formData.nombre.toLowerCase().replace(/\s+/g, "-"),
        description: formData.descripcion,
        content: formData.descripcion,
        features: [],
        images: [formData.imagenUrl],
        galleryImages: [],
      };

      if (editingId) {
        await actualizarServicio(editingId, serviceData);
      } else {
        await crearServicio(serviceData);
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
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
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
              {servicio.slug}
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
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del servicio"
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
              placeholder="Descripción del servicio"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de imagen
            </label>
            <input
              type="url"
              value={formData.imagenUrl}
              onChange={(e) =>
                setFormData({ ...formData, imagenUrl: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>
      </AdminModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        title="Eliminar Servicio"
        message={`¿Está seguro de que desea eliminar el servicio "${selectedServicio?.title}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
