import { useEffect, useState } from "react"
import api from "~/lib/axios";

type ChatScreenProps = {
    userId: string
}

type MessageResponse = {
    id: string;
    sender: string;
    receiver: string;
    type: string;
    content: string;
    createdAt: string;
}

export default function ChatScreen({ userId }: ChatScreenProps) {
    const [messages, setMessages] = useState<MessageResponse[]>([])

    async function getMessages() {
        const response = await api.get(`/messages/user/${userId}`)
        console.log(response)
        setMessages(response.data)
    }

    useEffect(() => {
        getMessages()
    }, [])

    async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const content = formData.get('content') as string

        const data = {
            content,
            type: "USER",
            target: userId,
        }

        await api.post('/messages', data)
        await getMessages()
    }

    return (
        <div className="p-6 w-full max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Chat com {userId}</h1>

            <div className="flex flex-col gap-2">
                {messages.map((message) => (
                    <div key={message.id} className={`p-2 bg-gray-100 dark:bg-gray-700 rounded-lg ${message.sender === userId ? 'self-end' : 'self-start'}`}>
                        <p>{message.content}</p>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                <input name="content" type="text" placeholder="Digite uma mensagem..." className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg" />
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg">Enviar</button>
            </form>
        </div>
    )
}