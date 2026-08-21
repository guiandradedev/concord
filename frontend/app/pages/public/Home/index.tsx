import { Link } from "react-router";
import { useAuth } from "~/contexts/AuthContext";

export function HomeScreen() {
    const { isAuthenticated } = useAuth()
    return (
        <main className="min-h-screen bg-gray-100 flex flex-col">

            <div>
                <h1 className="text-3xl font-bold text-center py-10 text-black">Bem-vindo ao Concord</h1>
                {
                    isAuthenticated ? (
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/app"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Entrar
                            </Link>
                        </div>
                    ) : (
                        <div className="flex justify-center space-x-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                            >
                                Register
                            </Link>
                        </div>
                    )
                }
            </div>

            <h1>Home</h1>

        </main>
    );
}