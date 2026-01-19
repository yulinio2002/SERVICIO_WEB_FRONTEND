import type {
	ProductCategoryCard,
	ProductItem,
} from "@interfaces/product/ProductTypes";

// Helpers
const slugify = (s: string) =>
	s
		.toLowerCase()
		.trim()
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "");

export type Brand = { id: number; name: string; slug: string };

export const BRANDS: Brand[] = [
	{ id: 1, name: "Atos", slug: "atos" },
	{ id: 2, name: "OMT", slug: "omt" },
	{ id: 3, name: "Danfoss Eaton", slug: "danfoss-eaton" },
];

export const CATEGORIES: ProductCategoryCard[] = [
	{
		id: 1,
		slug: "abrazaderas",
		title: "Abrazaderas",
		image: { src: "/images/img1.jpg", alt: "Abrazaderas" },
	},
	{
		id: 2,
		slug: "accesorios-hidraulicos",
		title: "Accesorios Hidráulicos",
		image: { src: "/images/img2.jpg", alt: "Accesorios Hidráulicos" },
	},
	{
		id: 3,
		slug: "bombas-hidraulicas",
		title: "Bombas Hidráulicas",
		image: { src: "/images/img3.jpg", alt: "Bombas Hidráulicas" },
	},
];

// Productos (vista 2 / 4)
export const PRODUCTS: ProductItem[] = [
	{
		id: 101,
		slug: "atos-conectores",
		marca: "Atos",
		title: "Conectores",
		description: "Conectores industriales para aplicaciones hidráulicas.",
		content: "Modelos disponibles para distintas configuraciones.",
		features: [],
		image: { src: "/images/img2.jpg", alt: "Atos - Conectores" },
		categorySlug: "accesorios-hidraulicos",
		categoryTitle: "Accesorios Hidráulicos",
	},
	{
		id: 102,
		slug: "atos-bombas-desplazamiento-fijo",
		marca: "Atos",
		title: "Bombas de Desplazamiento Fijo",
		description: "Bombas para media / alta presión.",
		content: "Stock disponible en varios modelos.",
		features: [],
		image: {
			src: "/images/img3.jpg",
			alt: "Atos - Bombas de Desplazamiento Fijo",
		},
		categorySlug: "bombas-hidraulicas",
		categoryTitle: "Bombas Hidráulicas",
	},
	{
		id: 201,
		slug: "omt-campanas-motor-bomba",
		marca: "OMT",
		title: "Campanas de Motor Bomba 0.75 HP - 150 HP",
		description: "Campanas para motor bomba con diferentes capacidades.",
		content: "Consúltanos por compatibilidad y disponibilidad.",
		features: [],
		image: { src: "/images/img1.jpg", alt: "OMT - Campanas Motor Bomba" },
		categorySlug: "accesorios-hidraulicos",
		categoryTitle: "Accesorios Hidráulicos",
	},
];

// Relaciones: qué categorías existen por marca (esto será backend luego)
export const BRAND_CATEGORY_MAP: Record<string, string[]> = {
	atos: ["accesorios-hidraulicos", "bombas-hidraulicas"],
	omt: ["accesorios-hidraulicos"],
	"danfoss-eaton": ["abrazaderas", "bombas-hidraulicas"],
};

// Selectores
export const getBrandBySlug = (brandSlug: string) =>
	BRANDS.find((b) => b.slug === brandSlug) ?? null;

export const getCategoriesByBrandSlug = (
	brandSlug: string,
): ProductCategoryCard[] => {
	const allowed = new Set(BRAND_CATEGORY_MAP[brandSlug] ?? []);
	return CATEGORIES.filter((c) => allowed.has(c.slug));
};

export const getProductsByBrandAndCategory = (
	brandSlug: string,
	categorySlug: string,
): ProductItem[] => {
	const brand = getBrandBySlug(brandSlug);
	if (!brand) return [];

	return PRODUCTS.filter(
		(p) =>
			slugify(p.marca ?? "") === brandSlug && p.categorySlug === categorySlug,
	);
};
