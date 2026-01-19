import { useStorageState } from "@hooks/useStorageState";
import { LoginRequest } from "@interfaces/auth/LoginRequest";
import Api from "@services/api";
import { login } from "@services/auth/login";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { AuthMeDto } from "@interfaces/auth/AuthMeDto";
import { getMeInfo } from "@services/auth/me";

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

  try {
    const userInfo = await getMeInfo();
    setUserInfo(JSON.stringify(userInfo));
  } catch (error) {
    console.error("Error fetching user info after login:", error);
  }
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
    if (!session) return;
    try {
      const userInfo = await getMeInfo();
      setUserInfo(JSON.stringify(userInfo));
    } catch (error) {
      console.error("Error refreshing user info:", error);
    }
  };

  useEffect(() => {
    if (session && !userInfo && !isLoading) {
      refreshUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, isLoading]);

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
