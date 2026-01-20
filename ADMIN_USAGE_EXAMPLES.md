// Ejemplo de uso del Panel Administrativo

// =================================================
// 1. ACCESO AL PANEL
// =================================================
// URL: http://localhost:5173/admin
// Requiere estar autenticado (token JWT)

// =================================================
// 2. ESTRUCTURA DE COMPONENTES
// =================================================

// AdminNav - Navegación entre secciones
import AdminNav from "@components/admin/AdminNav";

<AdminNav 
  activeTab="marcas" 
  onTabChange={(tab) => setActiveTab(tab)} 
/>

// AdminModal - Formulario genérico
import AdminModal from "@components/admin/AdminModal";

<AdminModal
  isOpen={isModalOpen}
  title="Nueva Marca"
  onClose={() => setIsModalOpen(false)}
  onSubmit={handleSubmit}
  isLoading={isSubmitting}
>
  {/* Contenido del formulario */}
</AdminModal>

// DeleteConfirmation - Confirmación de eliminación
import DeleteConfirmation from "@components/admin/DeleteConfirmation";

<DeleteConfirmation
  isOpen={isDeleteOpen}
  title="Eliminar Marca"
  message="¿Está seguro?"
  onConfirm={handleDelete}
  onCancel={() => setIsDeleteOpen(false)}
/>

// Alert - Sistema de alertas
import Alert from "@components/admin/Alert";

{error && (
  <Alert
    type="error"
    message={error}
    duration={3000}
    onClose={() => setError(null)}
  />
)}

{success && (
  <Alert
    type="success"
    message={success}
    duration={3000}
    onClose={() => setSuccess(null)}
  />
)}

// =================================================
// 3. FLUJO CRUD - CREAR MARCA
// =================================================

// Estado inicial
const [isModalOpen, setIsModalOpen] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [formData, setFormData] = useState({
  nombre: "",
  imagenUrl: "",
});

// Abrir modal
const handleOpenModal = () => {
  setFormData({ nombre: "", imagenUrl: "" });
  setIsModalOpen(true);
};

// Cerrar modal
const handleCloseModal = () => {
  setIsModalOpen(false);
};

// Guardar (crear o actualizar)
const handleSubmit = async () => {
  // Validar
  if (!formData.nombre.trim() || !formData.imagenUrl.trim()) {
    setError("Todos los campos son obligatorios");
    return;
  }

  setIsSubmitting(true);
  try {
    const api = await Api.getInstance();
    
    // Crear nueva marca
    await api.post(formData, { url: "/api/marcas" });
    
    // Recargar lista
    await loadMarcas();
    
    // Cerrar modal y limpiar
    handleCloseModal();
    setSuccess("Marca creada exitosamente");
    setError(null);
  } catch (err) {
    setError("Error al guardar marca");
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};

// =================================================
// 4. FLUJO CRUD - EDITAR MARCA
// =================================================

const handleOpenModal = (marca) => {
  // Pre-llenar con datos existentes
  setFormData({
    nombre: marca.nombre,
    imagenUrl: marca.imagenUrl,
  });
  setEditingId(marca.id);
  setIsModalOpen(true);
};

const handleSubmit = async () => {
  // Validar
  if (!formData.nombre.trim() || !formData.imagenUrl.trim()) {
    setError("Todos los campos son obligatorios");
    return;
  }

  setIsSubmitting(true);
  try {
    const api = await Api.getInstance();
    
    // Actualizar marca existente
    if (editingId) {
      await api.put(formData, { url: `/api/marcas/${editingId}` });
      setSuccess("Marca actualizada exitosamente");
    }
    
    // Recargar lista
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

// =================================================
// 5. FLUJO CRUD - ELIMINAR MARCA
// =================================================

const handleDeleteClick = (marca) => {
  setSelectedMarca(marca);
  setIsDeleteOpen(true);
};

const handleConfirmDelete = async () => {
  setIsSubmitting(true);
  try {
    const api = await Api.getInstance();
    
    // Eliminar marca
    await api.delete({ url: `/api/marcas/${selectedMarca.id}` });
    
    // Recargar lista
    await loadMarcas();
    
    // Cerrar y notificar
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

// =================================================
// 6. FLUJO CRUD - LISTAR MARCAS
// =================================================

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

// Renderizar listado
{marcas.map((marca) => (
  <div key={marca.id} className="bg-white border rounded-lg shadow p-4">
    <img src={marca.imagenUrl} alt={marca.nombre} />
    <h3>{marca.nombre}</h3>
    <button onClick={() => handleOpenModal(marca)}>Editar</button>
    <button onClick={() => handleDeleteClick(marca)}>Eliminar</button>
  </div>
))}

// =================================================
// 7. INTEGRACIÓN CON AUTENTICACIÓN
// =================================================

import { useAuthContext } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    if (!authContext?.session) {
      navigate("/login");
    }
  }, [authContext, navigate]);

  const handleLogout = () => {
    authContext.logout();
    navigate("/login");
  };

  return (
    <div>
      <button onClick={handleLogout}>Cerrar sesión</button>
      {/* Resto del panel */}
    </div>
  );
}

// =================================================
// 8. VALIDACIONES COMUNES
// =================================================

// Validar campos vacíos
if (!formData.nombre.trim()) {
  setError("El nombre es obligatorio");
  return;
}

// Validar URL
if (!formData.imagenUrl.trim() || !isValidUrl(formData.imagenUrl)) {
  setError("Ingrese una URL válida");
  return;
}

// Validar checkboxes (múltiples)
if (formData.categorias.length === 0) {
  setError("Debe seleccionar al menos una categoría");
  return;
}

// =================================================
// 9. MANEJO DE ESTADOS DE CARGA
// =================================================

// Estado de carga inicial
if (loading) return <div>Cargando...</div>;

// Estado de envío (prevenir clics duplicados)
<button disabled={isSubmitting}>
  {isSubmitting ? "Guardando..." : "Guardar"}
</button>

// =================================================
// 10. MANEJO DE ERRORES Y ÉXITO
// =================================================

// Mostrar errores
{error && (
  <Alert
    type="error"
    message={error}
    onClose={() => setError(null)}
  />
)}

// Mostrar éxito
{success && (
  <Alert
    type="success"
    message={success}
    onClose={() => setSuccess(null)}
  />
)}

// Limpiar errores después de modal
const handleCloseModal = () => {
  setIsModalOpen(false);
  setError(null);
  setFormData({ /* valores iniciales */ });
};
