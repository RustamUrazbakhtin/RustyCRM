import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as apiLogin, register as apiRegister, me as apiMe } from "../api/auth";

type User = { id: string; email: string; firstName?: string; lastName?: string; companyName?: string } | null;

type AuthCtx = {
    user: User;
    loading: boolean;
    signin: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, firstName?: string, lastName?: string, companyName?: string) => Promise<void>;
    signout: () => void;
    refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Стартовое восстановление с токена
        (async () => {
            try {
                if (localStorage.getItem("token")) {
                    const u = await apiMe();
                    setUser(u);
                }
            } catch {
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const signin = async (email: string, password: string) => {
        const { token } = await apiLogin(email, password);
        localStorage.setItem("token", token);
        const u = await apiMe();
        setUser(u);
    };

    const signup = async (email: string, password: string, firstName?: string, lastName?: string, companyName?: string) => {
        const { token } = await apiRegister(email, password, firstName, lastName, companyName);
        localStorage.setItem("token", token);
        const u = await apiMe();
        setUser(u);
    };

    const signout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const refresh = async () => {
        const u = await apiMe();
        setUser(u);
    };

    const value = useMemo(() => ({ user, loading, signin, signup, signout, refresh }), [user, loading]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const v = useContext(Ctx);
    if (!v) throw new Error("useAuth must be used within AuthProvider");
    return v;
}
