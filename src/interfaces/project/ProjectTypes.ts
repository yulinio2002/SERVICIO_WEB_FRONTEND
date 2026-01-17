export type MediaImage = {
	src: string; // ruta pública: /images/products/xxx.jpg
	alt: string;
};

export type ProjectType = {
	id: number;
	slug: string;
	title: string;
	description: string;
	image:  MediaImage;
	layout?: "imageRight" | "imageLeft"; // para alternar estilos por sección
};
