import React, { useState } from "react";
import { Star } from "lucide-react";
import { crearResena } from "@services/resena/resenaService";
import {ResenaResponse } from "@interfaces/resena/ResenaResponse";
import { ResenaRequest } from "@interfaces/resena/ResenaRequest";

interface ResenaFormProps {
  servicioId: number;
  clienteId: number;
  onSuccess?: (nuevaResena: ResenaResponse) => void;
  onCancel?: () => void;
}

export const ResenaForm: React.FC<ResenaFormProps> = ({
  servicioId,
  clienteId,
  onSuccess,
  onCancel,
}) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (calificacion < 1) {
      setError("Por favor, selecciona una calificación.");
      return;
    }
    if (!comentario.trim()) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const nuevaResena: ResenaRequest = {
      servicioId,
      clienteId,
      calificacion,
      comentario: comentario.trim(),
      fecha: new Date().toISOString(),
    };

    try {

      const response = await crearResena(nuevaResena);
      if (onSuccess) onSuccess(response);
      setComentario("");
      setCalificacion(0);
    } catch (err) {
      console.error("Error al crear reseña:", err);
      setError("Ocurrió un error al enviar tu reseña.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Deja tu reseña</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Calificación</label>
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => {
            const index = i + 1;
            return (
              <Star
                key={i}
                onClick={() => setCalificacion(index)}
                className={`w-6 h-6 cursor-pointer mr-1 ${
                  index <= calificacion ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
          Comentario
        </label>
        <textarea
          id="comentario"
          rows={4}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Escribe tu opinión sobre el servicio..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar reseña"}
        </button>
      </div>
    </form>
  );
};
