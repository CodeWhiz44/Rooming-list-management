import { useEffect } from "react";
import Dashboard from "./dashboard";
import { useAuthStore } from "../store/authStore";

export default function DashboardPage() {
    const { loadFromStorage } = useAuthStore();

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    return <Dashboard />;
}
