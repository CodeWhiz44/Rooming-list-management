import { create } from "zustand";

export type AuthStore = {
    token: string | null;
    user: { id: number; username: string } | null;
    isAuthenticated: boolean;
    login: (token: string, user: { id: number; username: string }) => void;
    logout: () => void;
    loadFromStorage: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    token: null,
    user: null,
    isAuthenticated: false,

    login: (token: string, user: { id: number; username: string }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        set({ token: null, user: null, isAuthenticated: false });
    },

    loadFromStorage: () => {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({ token, user, isAuthenticated: true });
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                set({ token: null, user: null, isAuthenticated: false });
            }
        }
    },
}));
