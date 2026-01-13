// src/interfaces/common/Navigation.ts
import { ProductCategory } from "@interfaces/servicio/Product.ts";

export interface NavItem {
	label: string;
	path: string;
	active?: boolean;
}

export interface ProductDropdownData {
	funcionalidades: ProductCategory[];
	marcas: Brand[];
}

export interface Brand {
	id: number;
	name: string;
	slug: string;
	logo: string;
}
