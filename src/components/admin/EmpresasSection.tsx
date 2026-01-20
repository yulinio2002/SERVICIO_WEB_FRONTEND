import { useState, useEffect } from "react";
import { listarEmpresas } from "@services/empresa/Empresa";
import Api from "@services/api";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";
import { Empresa } from "@interfaces/empresa/Empresa";

export default function EmpresasSection() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Empresa>({
    nombre: "",
    nosotros: "",
    mision: "",
    vision: "",
    direccion: "",
    ruc: "",
    numeroContacto: "",
    url1: "",
    url2: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);

  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      setLoading(true);
      const data = await listarEmpresas();
      setEmpresas(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar empresas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (empresa?: Empresa) => {
    if (empresa) {
      setFormData(empresa);
      setEditingId(empresa.id || null);
    } else {
      setFormData({
        nombre: "",
        nosotros: "",
        mision: "",
        vision: "",
        direccion: "",
        ruc: "",
        numeroContacto: "",
        url1: "",
        url2: "",
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      nombre: "",
      nosotros: "",
      mision: "",
      vision: "",
      direccion: "",
      ruc: "",
      numeroContacto: "",
      url1: "",
      url2: "",
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.nombre.trim() ||
      !formData.nosotros.trim() ||
      !formData.mision.trim() ||
      !formData.vision.trim() ||
      !formData.direccion.trim() ||
      !formData.ruc.trim() ||
      !formData.numeroContacto.trim() ||
      !formData.url1.trim() ||
      !formData.url2.trim()
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setIsSubmitting(true);
    try {
      const api = await Api.getInstance();
      if (editingId) {
        await api.put(formData, { url: `/api/empresas/${editingId}` });
      } else {
        await api.post(formData, { url: "/api/empresas" });
      }
      await loadEmpresas();
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError("Error al guardar empresa");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmpresa?.id) return;

    setIsSubmitting(true);
    try {
      const api = await Api.getInstance();
      await api.delete({ url: `/api/empresas/${selectedEmpresa.id}` });
      await loadEmpresas();
      setIsDeleteOpen(false);
      setError(null);
    } catch (err) {
      setError("Error al eliminar empresa");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando empresas...</div>;
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Empresas</h2>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + Nueva Empresa
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {empresas.map((empresa) => (
          <div
            key={empresa.id}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-bold text-lg mb-2">{empresa.nombre}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>RUC:</strong> {empresa.ruc}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Dirección:</strong> {empresa.direccion}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Contacto:</strong> {empresa.numeroContacto}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Misión:</strong> {empresa.mision}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Visión:</strong> {empresa.vision}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>URLs:</strong> {empresa.url1}, {empresa.url2}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleOpenModal(empresa)}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteClick(empresa)}
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
        title={editingId ? "Editar Empresa" : "Nueva Empresa"}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
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
              placeholder="Nombre de la empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RUC
            </label>
            <input
              type="text"
              value={formData.ruc}
              onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="RUC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) =>
                setFormData({ ...formData, direccion: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dirección"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de contacto
            </label>
            <input
              type="tel"
              value={formData.numeroContacto}
              onChange={(e) =>
                setFormData({ ...formData, numeroContacto: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+51 999 999 999"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nosotros
            </label>
            <textarea
              value={formData.nosotros}
              onChange={(e) =>
                setFormData({ ...formData, nosotros: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción de la empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Misión
            </label>
            <textarea
              value={formData.mision}
              onChange={(e) =>
                setFormData({ ...formData, mision: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Misión de la empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visión
            </label>
            <textarea
              value={formData.vision}
              onChange={(e) =>
                setFormData({ ...formData, vision: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Visión de la empresa"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL 1 (Página web)
            </label>
            <input
              type="url"
              value={formData.url1}
              onChange={(e) =>
                setFormData({ ...formData, url1: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL 2 (Redes sociales)
            </label>
            <input
              type="url"
              value={formData.url2}
              onChange={(e) =>
                setFormData({ ...formData, url2: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://instagram.com/ejemplo"
            />
          </div>
        </div>
      </AdminModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        title="Eliminar Empresa"
        message={`¿Está seguro de que desea eliminar la empresa "${selectedEmpresa?.nombre}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
