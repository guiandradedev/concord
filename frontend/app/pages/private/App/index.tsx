import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import { useNotifier } from "~/contexts/NotifierContext";
import { useSocket } from "~/contexts/SocketContext";
import api from "~/lib/axios";

type RecentUsersResponse = {
    id: string;
    name: string;
    email: string;
    // lastInteraction: Date;
}

export default function App() {
    const { user } = useAuth();
    const { } = useNotifier()
    const { onMessage } = useSocket();
    const [recentUsers, setRecentUsers] = useState<RecentUsersResponse[]>([])

    useEffect(() => {
        const unsubscribe = onMessage((data) => {
            console.log("App: message received", data);

        });
        return unsubscribe;
    }, [onMessage]);

    useEffect(() => {
        const fetchRecentUsers = async () => {
            const response = await api.get('/messages/recent')
            setRecentUsers(response.data)
        }
        fetchRecentUsers()
    }, [onMessage])

    return (
        <div className="p-6 w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Chat em Tempo Real</h1>

            <div className="flex flex-col gap-2">
                {recentUsers.map((user) => (
                    <Link to={`/chat/${user.id}`} key={user.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <h2 className="text-lg font-bold">{user.name}</h2>
                        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}