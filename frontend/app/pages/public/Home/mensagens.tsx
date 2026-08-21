import { useAuth } from "~/contexts/AuthContext";

export function Mensagens() {
    // Componente temporario para validar a rota de mensagens
    const { logout } = useAuth();

    return (
        <main className="min-h-screen bg-gray-100 flex flex-col">
            <div>
                <h1 className="text-3xl font-bold text-center py-10 text-black">Mensagens</h1>
            </div>

            <button onClick={logout}>Logout</button>
        </main>
    );
}