import { useState, useEffect } from "react";
import { listarMarcas } from "@services/marca/Marca";
import Api from "@services/api";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";
import Alert from "./Alert";

export type Marca = {
  id: number;
  nombre: string;
  imagenUrl: string;
};

export default function MarcasSection() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Marca>({
    id: 0,
    nombre: "",
    imagenUrl: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleOpenModal = (marca?: Marca) => {
    if (marca) {
      setFormData(marca);
      setEditingId(marca.id);
    } else {
      setFormData({ id: 0, nombre: "", imagenUrl: "" });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: 0, nombre: "", imagenUrl: "" });
  };

  const handleSubmit = async () => {
    if (!formData.nombre.trim() || !formData.imagenUrl.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setIsSubmitting(true);
    try {
      const api = await Api.getInstance();
      if (editingId) {
        // Actualizar
        await api.put(formData, { url: `/api/marcas/${editingId}` });
        setSuccess("Marca actualizada exitosamente");
      } else {
        // Crear
        await api.post(formData, { url: "/api/marcas" });
        setSuccess("Marca creada exitosamente");
      }
      await loadMarcas();
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError("Error al guardar marca");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (marca: Marca) => {
    setFormData(marca);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const api = await Api.getInstance();
      await api.delete({ url: `/api/marcas/${formData.id}` });
      await loadMarcas();
      setIsDeleteOpen(false);
      setSuccess("Marca eliminada exitosamente");
      setError(null);
    } catch (err) {
      setError("Error al eliminar marca");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando marcas...</div>;
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
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}
            <h3 className="font-bold text-lg mb-3">{marca.nombre}</h3>
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
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de la marca"
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
        title="Eliminar Marca"
        message={`¿Está seguro de que desea eliminar la marca "${formData.nombre}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
