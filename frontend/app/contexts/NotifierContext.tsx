import { createContext, useContext, type ReactNode, useMemo, useEffect, useState } from "react";
import { useSocket } from "./SocketContext";

type NotifierContextProps = {
}
const NotifierContext = createContext<NotifierContextProps | null>(null);

export const NotifierProvider = ({ children }: { children: ReactNode }) => {
    const { onMessage } = useSocket();

    useEffect(() => {
        const handleNewMessage = (data: any) => {
            console.log("notifier: New message received:", data);
        };
        const unsubscribe = onMessage(handleNewMessage);
        return unsubscribe;
    }, [onMessage]);

    const contextValue: NotifierContextProps = useMemo(() => ({}), []);

    return (
        <NotifierContext.Provider value={contextValue}>
            {children}
        </NotifierContext.Provider>
    );
};

export function useNotifier() {
    const context = useContext(NotifierContext)
    if (context === null) {
        throw new Error('useNotifier must be used within an NotifierProvider')
    }
    return context
}