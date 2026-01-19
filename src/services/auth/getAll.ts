
import Api from "@services/api";
// import { AuthMeResponse } from "@interfaces/user/User";

export interface UserWithContact {
  id: number;
  email: string;
  direccion: string;
  persona: {
    nombre: string;
    apellido: string;
    telefono: string;
  };
}

// export async function getMeInfo(): Promise<AuthMeResponse> {
//   const Apis = await Api.getInstance();
//   const response = await Apis.get<null, AuthMeResponse>({ url: `/auth/me` });
//   return response.data;
// }

export async function getAllUsers(): Promise<UserWithContact[]> {
  const Apis = await Api.getInstance();
  const response = await Apis.get<null, UserWithContact[]>({ url: `/auth` });
  return response.data;
}