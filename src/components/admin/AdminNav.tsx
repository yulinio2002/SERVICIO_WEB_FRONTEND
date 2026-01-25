interface AdminNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminNav({ activeTab, onTabChange }: AdminNavProps) {
  const tabs = [
		{ id: "empresas", label: "Empresas" },
		{ id: "marcas", label: "Marcas" },
		{ id: "servicios", label: "Servicios" },
		{ id: "productos", label: "Productos" },
		{ id: "destacados", label: "Destacados" },
		{ id: "proyectos", label: "Proyectos" },
		{ id: "usuarios", label: "Usuarios" },
	];

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
