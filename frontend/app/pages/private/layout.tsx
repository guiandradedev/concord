import { Link, Navigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import { useNotifier } from "~/contexts/NotifierContext";

export default function PrivateLayoutPage({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading, logout } = useAuth();
    const { } = useNotifier();

    if (loading) {
        return <div className="p-6">Carregando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <main className="flex min-h-dvh flex-col">
            <div className="w-full bg-gray-100 shadow-md p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Meu App</h1>

                <nav className="flex gap-4">
                    <Link to="/profile" className="text-blue-600 hover:underline">Perfil</Link>
                    <button className="text-red-600 hover:underline" onClick={logout}>Sair</button>
                </nav>
            </div>

            <div className="flex w-full flex-1 justify-center p-4 sm:p-6">
                {children}
            </div>
        </main>
    )
}
