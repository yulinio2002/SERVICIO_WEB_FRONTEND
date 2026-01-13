// src/interfaces/producto/Product.ts
export interface Product {
	id: number;
	name: string;
	slug: string;
	category: string;
	description: string;
	image: string;
}

export interface ProductCategory {
	id: number;
	name: string;
	slug: string;
	products: Product[];
}
