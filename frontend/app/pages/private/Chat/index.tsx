import { useEffect, useState } from "react"
import { useSocket } from "~/contexts/SocketContext";
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
    const { onMessage } = useSocket()

    async function getMessages() {
        const response = await api.get(`/messages/user/${userId}`)
        console.log(response)
        setMessages(response.data)
    }

    useEffect(() => {
        getMessages()

        const unsubscribe = onMessage((data) => {
            // Verifica se a mensagem recebida pertence a este chat específico
            if (data.sender === userId) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: data.id,
                        sender: data.sender,
                        receiver: data.target,
                        type: data.type,
                        content: data.content,
                        createdAt: new Date().toISOString()
                    }
                ])
            }
        })
        return unsubscribe
    }, [userId, onMessage])

    async function handleSendMessage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        const content = formData.get('content') as string
        if (!content.trim()) return

        const data = {
            content,
            type: "USER",
            target: userId,
        }

        form.reset()

        try {
            await api.post('/messages', data)
            await getMessages()
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error)
        }
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