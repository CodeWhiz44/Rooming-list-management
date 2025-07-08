import api from "./axios";

export async function login(username: string, password: string) {
    const res = await api.post("/auth/login", { username, password });
    return res.data;
}

export async function register(/* ... */) {}
