import axios from "axios";
import { Search, UserRoundSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { useSocket } from "~/contexts/SocketContext";
import api from "~/lib/axios";

type RecentUsersResponse = {
    id: string;
    name: string;
    email: string;
};

type UserSearchResult = {
    id: string;
    name: string;
};

export default function App() {
    const { onMessage } = useSocket();
    const [recentUsers, setRecentUsers] = useState<RecentUsersResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(false);

    useEffect(() => {
        const unsubscribe = onMessage((data) => {
            console.log("App: message received", data);
        });

        return unsubscribe;
    }, [onMessage]);

    useEffect(() => {
        const fetchRecentUsers = async () => {
            const response = await api.get("/messages/recent");
            setRecentUsers(response.data);
        };

        fetchRecentUsers();
    }, [onMessage]);

    useEffect(() => {
        const name = searchTerm.trim();

        if (!name) {
            setSearchResults([]);
            setIsSearching(false);
            setSearchError(false);
            return;
        }

        const controller = new AbortController();
        setSearchResults([]);
        setIsSearching(true);
        setSearchError(false);

        const timeoutId = window.setTimeout(async () => {
            try {
                const response = await api.get<UserSearchResult[]>("/users/search", {
                    params: { name },
                    signal: controller.signal,
                });
                setSearchResults(response.data);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setSearchResults([]);
                    setSearchError(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsSearching(false);
                }
            }
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
            controller.abort();
        };
    }, [searchTerm]);

    return (
        <div className="p-6 w-full max-w-2xl space-y-8">
            <section aria-labelledby="new-conversation-heading" className="space-y-3">
                <div>
                    <h1 id="new-conversation-heading" className="text-2xl font-bold">
                        Iniciar conversa
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Busque uma pessoa pelo nome de usuário.
                    </p>
                </div>

                <div className="relative">
                    <Search
                        aria-hidden="true"
                        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                        type="search"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Buscar usuário..."
                        aria-label="Buscar usuário pelo nome"
                        className="pl-9"
                    />
                </div>

                <div aria-live="polite">
                    {isSearching && (
                        <p className="py-4 text-sm text-muted-foreground">Buscando usuários...</p>
                    )}

                    {!isSearching && searchError && (
                        <p className="py-4 text-sm text-destructive">
                            Não foi possível buscar usuários. Tente novamente.
                        </p>
                    )}

                    {!isSearching && !searchError && searchTerm.trim() && searchResults.length === 0 && (
                        <p className="py-4 text-sm text-muted-foreground">
                            Nenhum usuário encontrado.
                        </p>
                    )}

                    {!isSearching && searchResults.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {searchResults.map((user) => (
                                <Link
                                    to={`/chat/${user.id}`}
                                    key={user.id}
                                    className="flex items-center gap-3 rounded-lg border bg-card p-3 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <UserRoundSearch aria-hidden="true" className="size-4" />
                                    </span>
                                    <span className="font-medium">{user.name}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section aria-labelledby="recent-conversations-heading" className="space-y-3">
                <h2 id="recent-conversations-heading" className="text-xl font-semibold">
                    Conversas recentes
                </h2>

                {recentUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Você ainda não iniciou nenhuma conversa.
                    </p>
                ) : (
                    <div className="flex flex-col gap-2">
                        {recentUsers.map((user) => (
                            <Link
                                to={`/chat/${user.id}`}
                                key={user.id}
                                className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg"
                            >
                                <h3 className="text-lg font-bold">{user.name}</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {user.email}
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
