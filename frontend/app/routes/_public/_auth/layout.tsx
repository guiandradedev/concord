import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/contexts/AuthContext";

export default function AuthLayout() {
    const { isAuthenticated, loading } = useAuth();

    console.log("asdsa")

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    if (isAuthenticated) {
        return <Navigate to="/app" replace />;
    }

    return <Outlet />;
}
