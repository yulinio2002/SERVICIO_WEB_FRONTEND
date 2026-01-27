import type { ProductItem, ProductCategoryCard } from "@interfaces/product/ProductTypes.ts";

export const slugify = (s: string) =>
	s
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/\s+/g, "-")
		.replace(/[^\w-]+/g, "")
		.trim();

export function mapProductoBackendToProductItem(b: any): ProductItem {
	return {
		id: b.id,
		slug: slugify(b.nombre),
		title: b.nombre,
		marca: b.marca,
		description: b.descripcion,
		content: b.content,
		features: b.features ?? [],
		image: {
			src: b.img_url,
			alt: b.nombre,
		},
		categorySlug: slugify([...b.categorias][0]),
		categoryTitle: [...b.categorias][0].replaceAll("_", " "),
		categories: b.categorias,
	};
}

export function mapProductosBackendToProductItems(list: unknown[]): ProductItem[] {
	return list.map(mapProductoBackendToProductItem);
}

/**
 * Construye cards de categorías:
 * imagen = primer producto de la categoría
 */
export function buildCategoryCards(
	products: ProductItem[],
): ProductCategoryCard[] {
	const map = new Map<string, ProductCategoryCard>();

	products.forEach((p) => {
		if (!map.has(p.categorySlug)) {
			map.set(p.categorySlug, {
				id: map.size + 1,
				slug: p.categorySlug,
				title: p.categoryTitle,
				image: p.image,
			});
		}
	});

	return Array.from(map.values());
}
