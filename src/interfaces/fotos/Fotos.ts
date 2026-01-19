import { Servicio } from "@interfaces/servicio/Service.ts";
import { Proyecto } from "@interfaces/project/Proyecto";

export interface Foto {
	id?: number;
	imagenUrl: string;
	servicio?: Servicio | null;
	proyectos?: Proyecto | null;
}

// Para crear una foto (sin relaciones completas, solo IDs)
export interface FotoCreate {
	imagenUrl: string;
	servicioId?: number | null;
	proyectoId?: number | null;
}

// Para asignar foto a servicio/proyecto
export interface FotoAssign {
	imagenUrl: string;
}
