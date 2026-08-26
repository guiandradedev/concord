import { createContext, useContext, type ReactNode, useMemo, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

type NewMessageResponse = {
    id: string;
    sender: string;
    target: string;
    content: string;
    type: string;
}

type SocketContextProps = {
    isConnected: boolean;
    onMessage: (callback: (data: NewMessageResponse) => void) => () => void;
}

const SocketContext = createContext<SocketContextProps | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const messageListeners = useRef<Set<(data: NewMessageResponse) => void>>(new Set());

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        const socketInstance = io("ws://localhost:3000", {
            auth: {
                userId: user.id
            }
        });
        socketInstance.on("connect", onConnectEvent);
        socketInstance.on("disconnect", onDisconnectEvent);
        socketInstance.on("new-message", onMessageEvent);

        return () => {
            socketInstance.disconnect();
        };
    }, [isAuthenticated]);

    function onConnectEvent() {
        console.log("Connected to socket!")
        setIsConnected(true)
    }

    function onDisconnectEvent() {
        console.log("Disconnected from socket!")
        setIsConnected(false)
    }

    function onMessageEvent(data: NewMessageResponse) {
        console.log("SocketContext: message received", data)
        messageListeners.current.forEach(callback => callback(data));
    }

    const onMessage = useCallback((callback: (data: NewMessageResponse) => void) => {
        messageListeners.current.add(callback);
        return () => {
            messageListeners.current.delete(callback);
        };
    }, []);

    const contextValue: SocketContextProps = useMemo(() => ({
        isConnected,
        onMessage
    }), [
        isConnected,
        onMessage
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