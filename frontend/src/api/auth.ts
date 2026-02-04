import api from "./axios";

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        username: string;
    };
}

export async function login(username: string, password: string): Promise<AuthResponse> {
    const res = await api.post("/auth/login", { username, password });
    return res.data;
}

export async function register(username: string, password: string): Promise<AuthResponse> {
    const res = await api.post("/auth/register", { username, password });
    return res.data;
}
