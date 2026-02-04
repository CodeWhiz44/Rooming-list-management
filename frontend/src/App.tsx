import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import DashboardPage from "./pages/index";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
    const { loadFromStorage, isAuthenticated } = useAuthStore();

    useEffect(() => {
        loadFromStorage();
    }, [loadFromStorage]);

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
                />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
                />
            </Routes>
            <Toaster position="top-left" />
        </BrowserRouter>
    );
}

export default App;
