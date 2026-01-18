// src/interfaces/servicio/Service.ts
import { Foto } from "@interfaces/fotos/Fotos.ts";

export interface Service {
	id: number;
	title: string;
	slug: string;
	description: string;
	content: string;
	features: string[];
	images: string[];
	galleryImages: GalleryImage[];
}

export interface ServiceSummary {
	id: number;
	title: string;
	slug: string;
	description: string;
	image: string;
	icon?: string;
}

export interface GalleryImage {
	id: number;
	url: string;
	alt: string;
}

export interface Servicio {
	id?: number;
	nombre: string;
	imagenUrl: string;
	descripcion: string;
	fotos?: Foto[]; // Relación OneToMany
}

// Para crear/actualizar servicio (sin fotos)
export interface ServicioCreate {
	nombre: string;
	imagenUrl: string;
	descripcion: string;
}




