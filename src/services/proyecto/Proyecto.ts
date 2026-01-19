import Api from "@services/api";
import { cacheGetOrSet, cacheSet } from "@services/cache";
import { ProjectType } from "@interfaces/project/ProjectTypes";
import {
	mapearListaProyectosBackendAProjectTypes,
	mapearProyectoBackendAProjectType,
} from "@interfaces/project/Mapper";

const CACHE_OPTS = { ttlMs: 10 * 60 * 1000, persist: true };

export async function listarProyectos(): Promise<ProjectType[]> {
	return cacheGetOrSet<ProjectType[]>(
		"proyectos:list",
		async () => {
			const api = await Api.getInstance();
			const res = await api.get<null, unknown[]>({ url: `/api/proyectos` });
			return mapearListaProyectosBackendAProjectTypes(res.data);
		},
		CACHE_OPTS.ttlMs,
	);
}

export async function obtenerProyecto(id: number): Promise<ProjectType> {
	return cacheGetOrSet<ProjectType>(
		`proyectos:${id}`,
		async () => {
			const api = await Api.getInstance();
			const res = await api.get<null, unknown>({ url: `/api/proyectos/${id}` });
			return mapearProyectoBackendAProjectType(res.data, 0);
		},
		CACHE_OPTS.ttlMs,
	);
}

// Persistimos la última selección (para reusar en el formulario)
export function cacheSeleccionProyecto(selection: {
	id: number;
	title: string;
}) {
	cacheSet("proyectos:lastSelection", selection, 10 * 60 * 1000);
}
