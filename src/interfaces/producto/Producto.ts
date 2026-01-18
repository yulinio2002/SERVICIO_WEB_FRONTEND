import { Categorias } from "@interfaces/categorias/Categorias";

export interface Producto {
	id?: number;
	nombre: string;
	img_url: string;
	descripcion: string;
	marca: string;
	categorias: Set<Categorias> | Categorias[]; // Puede ser Set o Array
}

// Para crear/actualizar producto
export interface ProductoCreate {
	nombre: string;
	img_url: string;
	descripcion: string;
	marca: string;
	categorias: Categorias[];
}
