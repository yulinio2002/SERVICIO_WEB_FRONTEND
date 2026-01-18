import { Foto } from "@interfaces/fotos/Fotos";

export interface Proyecto {
	id?: number;
	nombre: string;
	img_url: string;
	descripcion: string;
	fotos?: Foto[]; // Relación OneToMany
}

// Para crear/actualizar proyecto (sin fotos)
export interface ProyectoCreate {
	nombre: string;
	img_url: string;
	descripcion: string;
}
