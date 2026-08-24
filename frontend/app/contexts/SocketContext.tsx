import { createContext, useContext, type ReactNode, useMemo, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

type SocketContextProps = {
    socket: Socket | null;
    isConnected: boolean;
}
const SocketContext = createContext<SocketContextProps | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        const socketInstance = io("ws://localhost:3000", {
            auth: {
                userId: user.name
            }
        });
        socketInstance.on("connect", onConnectEvent);
        socketInstance.on("disconnect", onDisconnectEvent);
        socketInstance.on("new-message", onMessageEvent);

        setSocket(socketInstance);
        return () => {
            socketInstance.disconnect();
        };
    }, [isAuthenticated]);

    function onConnectEvent() {
        setIsConnected(true)
    }

    function onDisconnectEvent() {
        setIsConnected(false)
    }

    function onMessageEvent(data: any) {
        console.log(data)
    }

    const contextValue: SocketContextProps = useMemo(() => ({
        socket,
        isConnected
    }), [
        socket,
        isConnected
    ]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};

export function useSocket() {
    const context = useContext(SocketContext)
    if (context === null) {
        throw new Error('useSocket must be used within an SocketProvider')
    }
    return context
}