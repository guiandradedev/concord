import axios from "axios";
import React, { createContext, useState, useEffect, useContext, type ReactNode, useCallback, useMemo } from "react";
import api from "~/lib/axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "~/lib/auth-token";

type User = {
    id: string;
    name: string;
    email: string;
}

type AuthContextProps = {
    isAuthenticated: boolean,
    user: User | null,
    loading: boolean,
    login: (email: string, password: string) => Promise<void>,
    logout: () => void,
    register: (name: string, email: string, password: string) => Promise<void>
}
const AuthContext = createContext<AuthContextProps | null>(null);

type UserAuthenticateResponse = {
    accessToken: string
    refreshToken: string | null
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchUser = async () => {
        const response = await api.get<User>("/users/me");
            setUser(response.data);
    }


    useEffect(() => {
        let active = true;

        async function restoreSession() {
            const token = getAccessToken();
            if (token) {
                try {
                    await fetchUser();
                    if (!active) return;
                    setIsAuthenticated(true);
                } catch{
                    clearAccessToken();
                    setIsAuthenticated(false);
                    setUser(null);
                } finally {
                    if (active) setLoading(false);
                }
                return;
            }

            try {
                const response = await api.post<UserAuthenticateResponse>("/auth/refresh");
                const nextAccessToken = response.data?.accessToken;

                if (nextAccessToken) {
                    setAccessToken(nextAccessToken);
                    await fetchUser();
                    if (!active) return;
                    setIsAuthenticated(true);
                }
            } catch {
                clearAccessToken();
                if (!active) return;
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void restoreSession();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        async function getUser() {
            if (isAuthenticated && user == null) {
                // requisicao para o back
                // setUser()
            }
        }
    }, [isAuthenticated, user])

    const login = useCallback(async (email: string, password: string): Promise<void> => {
        try {
            const response = await api.post<UserAuthenticateResponse>("/auth/login", {
                email,
                password,
            });

            const accessToken = response.data?.accessToken;
            if (!accessToken) {
                throw new Error("Access token nao retornado pelo backend");
            }

            setAccessToken(accessToken);
            await fetchUser();
            setIsAuthenticated(true);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Erro ao limpar sessão no servidor", error);
        } finally {
            clearAccessToken();
            setIsAuthenticated(false);
            setUser(null);
        }
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        try {
            await api.post("/auth/register", {
                name,
                email,
                password,
            });
            // Auto login on successful registration (201 Created)
            await login(email, password);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    throw new Error("EMAIL_EXISTS");
                }
            }
            throw error;
        }
    }, [login])


    const contextValue: AuthContextProps = useMemo(() => ({
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        register
    }), [isAuthenticated, user, loading, login, logout, register]);


    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}