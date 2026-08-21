import axios from "axios";
import React, { createContext, useState, useEffect, useContext, type ReactNode, useCallback, useMemo } from "react";
import api from "~/lib/axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "~/lib/auth-token";

type User = {
    name: string
}
type AuthContextProps = {
    isAuthenticated: boolean,
    user: User | null,
    loading: boolean,
    login: (email: string, password: string) => Promise<void>,
    logout: () => void
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

    useEffect(() => {
        let active = true;

        async function restoreSession() {
            const token = getAccessToken();
            if (token) {
                if (!active) return;
                setIsAuthenticated(true);
                setLoading(false);
                return;
            }

            try {
                const response = await api.post<UserAuthenticateResponse>("/auth/refresh");
                const nextAccessToken = response.data?.accessToken;

                if (nextAccessToken) {
                    setAccessToken(nextAccessToken);
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
            setIsAuthenticated(true);
            setUser({ name: email });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        clearAccessToken();
        setIsAuthenticated(false);
        setUser(null);
    }, []);

    const contextValue: AuthContextProps = useMemo(() => ({
        isAuthenticated,
        user,
        loading,
        login,
        logout
    }), [isAuthenticated, user, loading, login, logout]);


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