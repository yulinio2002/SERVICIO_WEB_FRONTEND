export enum Categorias {
	LIMPIEZA = "LIMPIEZA",
	PLOMERIA = "PLOMERIA",
	ELECTRICISTA = "ELECTRICISTA",
	CARPINTERIA = "CARPINTERIA",
	PINTURA = "PINTURA",
	JARDINERIA = "JARDINERIA",
	CUIDADOS = "CUIDADOS",
	CONSTRUCCION = "CONSTRUCCION",
}

// Función auxiliar para obtener todas las categorías
export const listarCategorias = (): Categorias[] => {
	return Object.values(Categorias);
};
