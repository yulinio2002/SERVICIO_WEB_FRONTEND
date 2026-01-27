import Api from "@services/api";
import { cacheGetOrSet, cacheSet, cacheDel } from "@services/cache";
import { ProjectType } from "@interfaces/project/ProjectTypes";
import {
	mapearListaProyectosBackendAProjectTypes,
	mapearProyectoBackendAProjectType,
} from "@interfaces/project/Mapper";

const CACHE_OPTS = { ttlMs: 10 * 60 * 1000, persist: true };

export type ProyectoMultipartArgs = {
	file: File;
	nombre: string;
	descripcion: string;
};

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

export async function crearProyectoMultipart(args: ProyectoMultipartArgs) {
	const api = await Api.getInstance();
	const fd = new FormData();

	fd.append("file", args.file);
	fd.append("nombre", args.nombre);
	fd.append("descripcion", args.descripcion);

	const res = await api.post<FormData, unknown>(fd, {
		url: "/api/proyectos",
	});

	cacheDel("proyectos:list");
	return res.data;
}


export async function actualizarProyectoMultipart(
	id: number,
	args: ProyectoMultipartArgs,
) {
	const api = await Api.getInstance();
	const fd = new FormData();

	fd.append("file", args.file);
	fd.append("nombre", args.nombre);
	fd.append("descripcion", args.descripcion);

	const res = await api.put<FormData, unknown>(fd, {
		url: `/api/proyectos/${id}`,
	});

	cacheDel("proyectos:list");
	cacheDel(`proyectos:${id}`);
	return res.data;
}

export async function eliminarProyecto(id: number): Promise<void> {
	const api = await Api.getInstance();
	await api.delete<void>({ url: `/api/proyectos/${id}` });
	cacheDel("proyectos:list");
	cacheDel(`proyectos:${id}`);
}