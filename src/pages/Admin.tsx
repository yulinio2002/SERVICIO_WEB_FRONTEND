import { useState, useEffect } from "react";
import { useAuthContext } from "@contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AdminNav from "@components/admin/AdminNav";
import MarcasSection from "@components/admin/MarcasSection";
import ServiciosSection from "@components/admin/ServiciosSection";
import ProductosSection from "@components/admin/ProductosSection";
import ProyectosSection from "@components/admin/ProyectosSection";
import EmpresasSection from "@components/admin/EmpresasSection";
import UsersSection from "@components/admin/UsersSection.tsx";
import ProductosDestacadosSection from "@components/admin/ProductosDestacadosSection.tsx";


export default function Admin() {
  const [activeTab, setActiveTab] = useState("marcas");
  const authContext = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!authContext?.session) {
      navigate("/login");
    }
  }, [authContext, navigate]);

  if (!authContext?.session) {
    return <div className="text-center py-8">Redirigiendo a login...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Panel Administrativo</h1>
            <button
              onClick={() => {
                authContext.logout();
                navigate("/login");
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <AdminNav activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "marcas" && <MarcasSection />}
        {activeTab === "servicios" && <ServiciosSection />}
        {activeTab === "productos" && <ProductosSection />}
        {activeTab === "proyectos" && <ProyectosSection />}
        {activeTab === "empresas" && <EmpresasSection />}
				{activeTab === "usuarios" && <UsersSection/>}
				{activeTab === "destacados" && <ProductosDestacadosSection/>}
      </div>
    </div>
  );
}
