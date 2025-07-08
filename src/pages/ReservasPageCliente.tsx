import React, { useState, useEffect } from "react";
import { Navbar } from "@components/Navbar";
import Footer from "@components/Footer";
import Button from "@components/Button";
import { Star } from "lucide-react";
import { useAuthContext } from "@contexts/AuthContext";
import { ReservaResponse } from "@interfaces/reserva/RerservaResponse";
import { ServicioResponse } from "@interfaces/servicio/ServicioResponse";
import { ResenaForm } from "@components/ResenaForm";
import {
  obtenerReservasCliente,
  cancelarReserva,
} from "@services/reserva/reservaService";
import { obtenerServiciosActivos } from "@services/servicio/servicioService";
import { format } from "date-fns";
import { AuthMeDto } from "@interfaces/auth/AuthMeDto";
import { getMeInfo } from "@services/auth/me";

const ReservasPageCliente: React.FC = () => {
  const { userId: clienteId } = useAuthContext();
  const [user, setUser] = useState<AuthMeDto | null>(null);
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [serviciosMap, setServiciosMap] = useState<Record<number, ServicioResponse>>({});
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<number | null>(null);
  const [reservaParaCalificar, setReservaParaCalificar] = useState<ReservaResponse | null>(null);

  // Carga datos de usuario y reservas
  useEffect(() => {
    
    if (!clienteId) return;
    (async () => {
      setLoading(true);
      try {
      
        // Obtener datos del usuario
        const me = await getMeInfo();
        setUser(me);
        
        // Obtener reservas
        const reservasData = await obtenerReservasCliente(clienteId);
        setReservas(reservasData);

        // Obtener servicios activos y mapear por id
        const serviciosData = await obtenerServiciosActivos();
        const map: Record<number, ServicioResponse> = {};
        serviciosData.forEach((s) => { map[s.id] = s; });
        setServiciosMap(map);
      } catch (err) {
        console.error("Error cargando datos del cliente o reservas:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [clienteId]);

  const handleCancel = async (reservaId: number) => {
    if (!window.confirm("¿Cancelar esta reserva?")) return;
    setActingId(reservaId);
    try {
      await cancelarReserva(clienteId!, reservaId);
      setReservas((prev) =>
        prev.map((r) =>
          r.id === reservaId ? { ...r, estado: "CANCELADA" } : r
        )
      );
    } catch (err) {
      console.error("Error cancelando reserva:", err);
      alert(
        `Error: ${(err as any).response?.data?.message ||
          "No se pudo cancelar la reserva"}`
      );
    } finally {
      setActingId(null);
    }
  };

  const handleCalificar = (reserva: ReservaResponse) => {
    setReservaParaCalificar(reserva);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar avatarUrl="#"
        userName={user?.nombre || "Cliente"}
        badgeLabel="Cliente"
      />

      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          {loading ? (
          <div className="text-center text-gray-500">Cargando reservas...</div>
        ) : (
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3 text-gray-700">Servicio</th>
                <th className="px-6 py-3 text-gray-700">Dirección</th>
                <th className="px-6 py-3 text-gray-700">Fecha</th>
                <th className="px-6 py-3 text-gray-700">Precio</th>
                <th className="px-6 py-3 text-gray-700">Estado</th>
                <th className="px-6 py-3 text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No tienes reservas
                  </td>
                </tr>
              ) : (
                reservas.map((r) => {
                  const servicio = serviciosMap[r.servicioId];
                  return (
                    <tr key={r.id} className="border-t">
                      <td className="px-6 py-4 text-gray-800">
                        {servicio?.nombre ?? `ID ${r.servicioId}`}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {r.direccion || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        {format(new Date(r.fechaReserva), "dd/MM/yyyy")}
                      </td>
                      <td className="px-6 py-4 text-gray-800">
                        S/ {servicio?.precio.toFixed(2) ?? "0.00"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            r.estado === "PENDIENTE"
                              ? "bg-yellow-100 text-yellow-800"
                              : r.estado === "ACEPTADA"
                              ? "bg-blue-100 text-blue-800"
                              : r.estado === "CANCELADA"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {r.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2 flex items-center">
                        {r.estado === "PENDIENTE" ? (
                          <Button
                            message={
                              actingId === r.id ? "Cancelando..." : "Cancelar"
                            }
                            onClick={() => handleCancel(r.id)}
                            disabled={actingId === r.id}
                          />
                        ) : r.estado === "COMPLETADA" ? (
                          <button
                            onClick={() => handleCalificar(r)}
                            className="p-2 rounded-md hover:bg-gray-100"
                            aria-label="Calificar"
                          >
                            <Star className="w-6 h-6 text-yellow-500" />
                          </button>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
)}
        </div>

        {reservaParaCalificar && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <ResenaForm
                servicioId={reservaParaCalificar.servicioId}
                clienteId={clienteId!}
                onSuccess={() => {
                  setReservaParaCalificar(null);
                }}
                onCancel={() => setReservaParaCalificar(null)}
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ReservasPageCliente;
