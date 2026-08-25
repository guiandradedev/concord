import { useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { useNotifier } from "~/contexts/NotifierContext";
import { useSocket } from "~/contexts/SocketContext";

export default function App() {
    const { user } = useAuth();
    const { } = useNotifier()
    const { onMessage } = useSocket();

    useEffect(() => {
        const unsubscribe = onMessage((data) => {
            console.log("App: message received", data);
        });
        return unsubscribe;
    }, [onMessage]);

    return (
        <div className="p-6 w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Chat em Tempo Real</h1>

            <div className="flex flex-col gap-2">

            </div>
        </div>
    );
}