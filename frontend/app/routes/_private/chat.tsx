import { useParams } from "react-router";
import ChatScreen from "~/pages/private/Chat";

export default function ChatPage() {
    const params = useParams<{ userId: string }>();
    const userId = params.userId;

    if (!userId) {
        throw new Error("Invalid user id")
    }

    return <ChatScreen userId={userId} />;
}