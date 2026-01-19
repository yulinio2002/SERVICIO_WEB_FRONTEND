export type ProductCategoryCard = {
	id: number;
	slug: string;
	title: string;
	subtitle?: string;
	image: {
		src: string; // ruta local desde public: /images/products/...
		alt: string;
	};
};

export type PaginationMeta = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
};

export interface ProductItem {
	id: number;
	slug: string;
	title: string;
	marca?: string;
	description: string;
	content: string;
	features: string[];
	image: {
		src: string; // ruta local desde public: /images/products/...
		alt: string;
	};
	categorySlug: string;
	categoryTitle: string;
	specifications?: {
		[key: string]: string;
	};
}