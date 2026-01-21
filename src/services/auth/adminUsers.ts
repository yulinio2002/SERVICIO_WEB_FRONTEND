import Api from "@services/api";
import { Role } from "@interfaces/user/Role";
import type { AuthMeResponse, RegisterRequest } from "@interfaces/user/User";

// Ajusta estas rutas si tu backend usa otras:
const USERS_LIST_URL = "/auth";
const USER_CREATE_URL = "/auth/register";
const USER_UPDATE_URL = (id: number) => `/auth/${id}`; // <-- si tu backend difiere, cambia aquí

export type AdminUserRow = AuthMeResponse & {
	// algunos backends devuelven "direccion" en vez de "address"
	direccion?: string | null;
};

export type AdminCreateUserPayload = RegisterRequest & {
	roles: Role[]; // ROLE_ADMIN o ROLE_EMPLEADO
	// Normalizamos: RegisterRequest trae "direccion" y tu entidad maneja "address"
	// El backend puede aceptar "address" o "direccion" según tu implementación
	address?: string;
};

export type AdminUpdateUserPayload = {
	email?: string;
	password?: string;
	address?: string | null;
	direccion?: string | null;
	roles?: Role[];
	persona?: {
		nombre?: string;
		apellido?: string;
		telefono?: string;
	};
};

export async function adminListUsers(): Promise<AdminUserRow[]> {
	const api = await Api.getInstance();
	const res = await api.get<null, AdminUserRow[]>({ url: USERS_LIST_URL });
	return res.data;
}

export async function adminCreateUser(payload: AdminCreateUserPayload) {
	const api = await Api.getInstance();
	// Algunos backends esperan "address", otros "direccion":
	// enviamos ambos si vienen, para maximizar compatibilidad.
	const body = {
		...payload,
		address: payload.address ?? payload.direccion ?? "",
		direccion: payload.direccion ?? payload.address ?? "",
	};
	return api.post<typeof body, unknown>(body, { url: USER_CREATE_URL });
}

export async function adminUpdateUser(
	id: number,
	payload: AdminUpdateUserPayload,
) {
	const api = await Api.getInstance();
	return api.put<AdminUpdateUserPayload, unknown>(payload, {
		url: USER_UPDATE_URL(id),
	});
}
