import { Mensagens } from "~/pages/public/Home/mensagens";
import { useAuth } from "~/contexts/AuthContext";
import { Navigate } from "react-router";

export default function AppPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Mensagens />;
}
