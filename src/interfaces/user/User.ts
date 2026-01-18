import { Role } from "@interfaces/user/Role.ts";
import { Persona } from "@interfaces/persona/Persona";

export interface User {
	id?: number;
	email: string;
	password?: string; // Solo para creación/actualización
	address?: string | null;
	roles: Set<Role> | Role[]; // Puede ser Set o Array
	persona: Persona;
}

// Para login
export interface LoginRequest {
	email: string;
	password: string;
}

// Para registro
export interface RegisterRequest {
	email: string;
	password: string;
	address?: string;
	persona: Omit<Persona, "id">;
}

// Para actualizar usuario
export interface UserUpdate {
	email?: string;
	address?: string | null;
	roles?: Role[];
	persona?: Partial<Persona>;
}
