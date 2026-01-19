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

// Para registro
export interface RegisterRequest {
	email: string;
	password: string;
	direccion?: string;
	persona: Omit<Persona, "id">;
}
// Para obtener todos los datos
export interface allUserRequest {
	email: string;
	password: string;
	direccion?: string;
	persona: Omit<Persona, "id">;
}

// Para actualizar usuario
export interface UserUpdate {
	email?: string;
	telefono?: string;
}
// Para la respuesta de /auth
export interface AuthMeResponse {
  id?: number;
  email: string;
  address?: string | null;
  roles: Set<Role> | Role[];
  persona: Persona & {
    telefono?: string | null;
    email?: string | null; // por si tu API maneja email en persona
  };
  telefono?: string | null; // por si tu API lo manda en root
}