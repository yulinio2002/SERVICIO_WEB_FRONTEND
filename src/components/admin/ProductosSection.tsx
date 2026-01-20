import { useState, useEffect } from "react";
import Api from "@services/api";
import AdminModal from "./AdminModal";
import DeleteConfirmation from "./DeleteConfirmation";

interface Producto {
  id: number;
  nombre: string;
  img_url: string;
  descripcion: string;
  marca: string;
  categorias: string[];
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
    marca: "",
    categorias: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );

  const categorias = [
    "LIMPIEZA",
    "PLOMERIA",
    "ELECTRICIDAD",
    "PINTURA",
    "CARPINTERIA",
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
      setFormData({
        nombre: producto.nombre,
        img_url: producto.img_url,
        descripcion: producto.descripcion,
        marca: producto.marca,
        categorias: producto.categorias,
      });
      setEditingId(producto.id);
    } else {
      setFormData({
        nombre: "",
        img_url: "",
        descripcion: "",
        marca: "",
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
      marca: "",
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
    if (
      !formData.nombre.trim() ||
      !formData.img_url.trim() ||
      !formData.descripcion.trim() ||
      !formData.marca.trim() ||
      formData.categorias.length === 0
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setIsSubmitting(true);
    try {
      const api = await Api.getInstance();
      if (editingId) {
        await api.put(formData, { url: `/api/productos/${editingId}` });
      } else {
        await api.post(formData, { url: "/api/productos" });
      }
      await loadProductos();
      handleCloseModal();
      setError(null);
    } catch (err) {
      setError("Error al guardar producto");
      console.error(err);
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
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
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
            <p className="text-sm text-gray-600 mb-2">
              <strong>Marca:</strong> {producto.marca}
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Categorías:</strong> {producto.categorias.join(", ")}
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
              Nombre
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del producto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca
            </label>
            <input
              type="text"
              value={formData.marca}
              onChange={(e) =>
                setFormData({ ...formData, marca: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Marca del producto"
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
              placeholder="Descripción del producto"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categorías (seleccione al menos una)
            </label>
            <div className="space-y-2">
              {categorias.map((cat) => (
                <label key={cat} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.categorias.includes(cat)}
                    onChange={() => toggleCategoria(cat)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-2 text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </AdminModal>

      <DeleteConfirmation
        isOpen={isDeleteOpen}
        title="Eliminar Producto"
        message={`¿Está seguro de que desea eliminar el producto "${selectedProducto?.nombre}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteOpen(false)}
        isLoading={isSubmitting}
      />
    </div>
  );
}
