// src/interfaces/servicio/Service.ts
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




