import { apiFetch } from "../lib/http";

export type AuthResponse = { token: string };

export async function register(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    companyName?: string
) {
    return apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, firstName, lastName, companyName })
    });
}

export async function login(email: string, password: string) {
    return apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
}

export async function me() {
    return apiFetch<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        companyName?: string;
    }>("/api/auth/me");
}
