import { useStorageState } from "@hooks/useStorageState";
import { LoginRequest } from "@interfaces/auth/LoginRequest";
import Api from "@services/api";
import { login } from "@services/auth/login";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthMeDto } from "@interfaces/auth/AuthMeDto";

interface AuthContextType {
  login: (loginRequest: LoginRequest) => Promise<void>;
  logout: () => void;
  session?: string | null;
  isLoading: boolean;
  userId?: number | null;
  userInfo?: AuthMeDto | null;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loginHandler(
  loginRequest: LoginRequest,
  setSession: (value: string | null) => void,
  setUserId: (value: string | null) => void,
  setUserInfo: (value: string | null) => void
) {
  const response = await login(loginRequest);
  setSession(response.token);
  setUserId(response.id.toString());
  // No se requiere cargar información adicional del usuario
  setUserInfo(null);
}

export function AuthProvider(props: { children: ReactNode }) {
  const [[isLoading, session], setSession] = useStorageState("token");
  const [[, userId], setUserId] = useStorageState("userId");
  const [[, userInfoString], setUserInfo] = useStorageState("userInfo");

  const [userInfo, setUserInfoState] = useState<AuthMeDto | null>(null);

  useEffect(() => {
    if (userInfoString) {
      try {
        setUserInfoState(JSON.parse(userInfoString));
      } catch (error) {
        console.error("Error parsing user info from localStorage:", error);
        setUserInfoState(null);
      }
    } else {
      setUserInfoState(null);
    }
  }, [userInfoString]);

  useEffect(() => {
    Api.getInstance().then((api) => {
      api.authorization = session ?? "";
    });
  }, [session]);

  const refreshUserInfo = async () => {
    // No hay llamada necesaria; se mantiene la firma para compatibilidad
    return;
  };

  const logoutHandler = () => {
    setSession(null);
    setUserId(null);
    setUserInfo(null);
    setUserInfoState(null);
    Api.getInstance().then((api) => {
      api.authorization = "";
    });
  };

  return (
    <AuthContext.Provider
      value={{
        login: (loginRequest) => loginHandler(loginRequest, setSession, setUserId, setUserInfo),
        logout: logoutHandler,
        session,
        isLoading,
        userId: userId ? parseInt(userId) : null,
        userInfo,
        refreshUserInfo,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
}
