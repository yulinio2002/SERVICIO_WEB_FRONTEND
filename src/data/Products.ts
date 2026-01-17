// src/data/products.ts
import { ProductItem } from "@interfaces/product/ProductTypes";

export const productsData: ProductItem[] = [
	{
		id: 1,
		slug: "abrazadera-tipo-a",
		title: "Abrazadera Tipo A",
		marca: "D'ONOFRIO",
		description: "Abrazadera de alta resistencia para mangueras hidráulicas.",
		content:
			"Esta abrazadera es ideal para aplicaciones de alta presión en sistemas oleohidráulicos. Fabricada en acero inoxidable 304, garantiza máxima durabilidad y resistencia a la corrosión en ambientes industriales exigentes.",
		features: [
			"Material: Acero inoxidable 304",
			"Resistencia a la presión: Hasta 5000 psi",
			"Temperatura de trabajo: -40°C a 200°C",
			"Fácil instalación sin herramientas especiales",
			"Disponible en múltiples diámetros",
		],
		image: {
			src: "/images/products/abrazaderas-detalle.jpg",
			alt: "Abrazadera Tipo A",
		},
		categorySlug: "abrazaderas",
		categoryTitle: "Abrazaderas",
		specifications: {
			Material: "Acero inoxidable 304",
			"Presión Máx.": "5000 psi",
			Temperatura: "-40°C a 200°C",
			Diámetros: "1/2'' a 2''",
			Normativa: "ISO 12151-1",
		},
	},
	{
		id: 2,
		slug: "conector-hidraulico-bsp",
		title: "Conector Hidráulico BSP",
		marca: "PARKER",
		description:
			"Conectores roscados BSP para sistemas hidráulicos de alta presión.",
		content:
			"Conectores de acero de alta calidad con rosca BSP (British Standard Pipe). Diseñados para conexiones estancas en sistemas de alta presión, ideales para aplicaciones industriales y móviles.",
		features: [
			"Roscas BSP paralelas y cónicas",
			"Material: Acero al carbono zincado",
			"Sellado con juntas tóricas",
			"Presión de trabajo: 6000 psi",
			"Conformidad SAE J514",
		],
		image: {
			src: "/images/products/conectores-detalle.jpg",
			alt: "Conector Hidráulico BSP",
		},
		categorySlug: "accesorios-hidraulicos",
		categoryTitle: "Accesorios Hidráulicos",
		specifications: {
			"Tipo de rosca": "BSPP / BSPT",
			Material: "Acero zincado",
			Presión: "6000 psi",
			Temperatura: "-20°C a 120°C",
			Estándar: "SAE J514",
		},
	},
	{
		id: 3,
		slug: "acumulador-piston",
		title: "Acumulador de Pistón",
		marca: "HYDAC",
		description:
			"Acumulador hidráulico tipo pistón para almacenamiento de energía.",
		content:
			"Acumuladores de pistón diseñados para aplicaciones de alta presión y volumen. Proporcionan almacenamiento de energía, compensación de fugas y amortiguación de pulsaciones en sistemas hidráulicos.",
		features: [
			"Capacidades de 0.1 a 100 litros",
			"Presión máxima: 500 bar",
			"Relación de volúmenes 10:1",
			"Bajo mantenimiento",
			"Certificado CE y PED",
		],
		image: {
			src: "/images/products/acumulador-detalle.jpg",
			alt: "Acumulador de Pistón",
		},
		categorySlug: "acumuladores-hidraulicos",
		categoryTitle: "Acumuladores Hidráulicos",
		specifications: {
			Tipo: "Pistón",
			Capacidad: "0.1 - 100 L",
			Presión: "Hasta 500 bar",
			Temperatura: "-20°C a 120°C",
			Certificación: "CE, PED",
		},
	},
	// Más productos...
	{
		id: 4,
		slug: "valvula-direccional-4-3",
		title: "Válvula Direccional 4/3",
		description:
			"Válvula direccional de 4 vías y 3 posiciones para control de actuadores.",
		content:
			"Válvula direccional electrohidráulica de 4 vías y 3 posiciones, ideal para el control preciso de cilindros y motores hidráulicos. Cuenta con solenoides de alta eficiencia y opciones de accionamiento manual.",
		features: [
			"4 vías / 3 posiciones",
			"Accionamiento eléctrico o manual",
			"Caudal nominal: 40 L/min",
			"Presión máxima: 350 bar",
			"Tamaños: NG6 a NG10",
		],
		image: {
			src: "/images/products/valvula-detalle.jpg",
			alt: "Válvula Direccional",
		},
		categorySlug: "valvulas",
		categoryTitle: "Válvulas Hidráulicas",
		specifications: {
			Tipo: "4/3 direccional",
			Caudal: "40 L/min",
			Presión: "350 bar",
			Accionamiento: "Solenoide",
			Conexiones: "NG6, NG10",
		},
	},
	{
		id: 5,
		slug: "bomba-piston-axial",
		title: "Bomba de Pistones Axiales",
		marca: "REXROTH",
		description:
			"Bomba de pistones axiales de caudal variable para sistemas hidráulicos de alta eficiencia.",
		content:
			"Bombas de pistones axiales de caudal variable con control electrónico proporcional. Ideales para aplicaciones que requieren alta eficiencia energética y control preciso del caudal.",
		features: [
			"Caudal variable hasta 250 cm³/rev",
			"Presión continua: 350 bar",
			"Eficiencia >92%",
			"Control electrónico proporcional",
			"Bajo nivel de ruido",
		],
		image: {
			src: "/images/products/bomba-detalle.jpg",
			alt: "Bomba de Pistones",
		},
		categorySlug: "bombas",
		categoryTitle: "Bombas Hidráulicas",
		specifications: {
			Tipo: "Pistones axiales",
			Caudal: "Hasta 250 cm³/rev",
			Presión: "350 bar continua",
			Velocidad: "500-3000 rpm",
			Eficiencia: ">92%",
		},
	},
];

// Agrupar productos por categoría
export const getProductsByCategory = (categorySlug: string): ProductItem[] => {
	return productsData.filter(
		(product) => product.categorySlug === categorySlug,
	);
};

// Obtener producto por slug
export const getProductBySlug = (slug: string): ProductItem | undefined => {
	return productsData.find((product) => product.slug === slug);
};

// Obtener todas las categorías únicas
export const getAllCategories = () => {
	const categoriesMap = new Map();
	productsData.forEach((product) => {
		if (!categoriesMap.has(product.categorySlug)) {
			categoriesMap.set(product.categorySlug, {
				slug: product.categorySlug,
				title: product.categoryTitle,
			});
		}
	});
	return Array.from(categoriesMap.values());
};
