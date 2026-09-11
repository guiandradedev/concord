import { Outlet } from "react-router";
import { NotifierProvider } from "~/contexts/NotifierContext";
import { SocketProvider } from "~/contexts/SocketContext";
import PrivateLayoutPage from "~/pages/private/layout";

export default function PrivateLayout() {
    return (
        <SocketProvider>
            <NotifierProvider>
                <PrivateLayoutPage>
                    <Outlet />
                </PrivateLayoutPage>
            </NotifierProvider>
        </SocketProvider>
    )
}