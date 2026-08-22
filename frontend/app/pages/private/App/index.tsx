// pages/private/App/index.tsx[cite: 3]

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "~/contexts/AuthContext";

export default function App() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        if (!user) return;

        const socket: Socket = io("ws://localhost:3000", {
            auth: {
                userId: user.name 
            }
        });

        socket.on("connect", () => {
            console.log("Conectado ao Gateway. Socket ID:", socket.id); 
        });

        socket.on("new-message", (data) => {
            console.log("Nova mensagem via Kafka/WebSocket:", data);
            
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socket.on("disconnect", () => {
            console.log("Desconectado do WebSocket"); 
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    return (
        <div className="p-6 w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Chat em Tempo Real</h1>
            
            <div className="flex flex-col gap-2">
                {messages.length === 0 ? (
                    <p className="text-gray-500">Nenhuma mensagem recebida ainda...</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className="p-3 bg-white border border-gray-200 rounded-md shadow-sm">
                            <span className="font-bold text-blue-600">{msg.sender ?? msg.from}: </span>
                            <span>{msg.content}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}