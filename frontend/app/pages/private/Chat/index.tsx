import { useEffect, useRef, useState } from "react"
import { useAuth } from "~/contexts/AuthContext";
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

type ChatUserResponse = {
    id: string;
    name: string;
}

export default function ChatScreen({ userId }: ChatScreenProps) {
    const [messages, setMessages] = useState<MessageResponse[]>([])
    const [chatUserName, setChatUserName] = useState("Carregando...")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { onMessage } = useSocket()
    const { user: currentUser } = useAuth()

    async function getMessages() {
        const response = await api.get<MessageResponse[]>(`/messages/user/${userId}`)
        setMessages(response.data)
    }

    useEffect(() => {
        setMessages([])
        void getMessages().catch((error) => {
            console.error("Erro ao carregar mensagens:", error)
        })

        const unsubscribe = onMessage((data) => {
            if (data.sender === userId && data.receiver === currentUser?.id) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: data.id,
                        sender: data.sender,
                        receiver: data.receiver,
                        type: data.type,
                        content: data.content,
                        createdAt: data.createdAt,
                    }
                ])
            }
        })

        return () => {
            unsubscribe()
        }
    }, [userId, onMessage, currentUser?.id])

    useEffect(() => {
        let active = true

        setChatUserName("Carregando...")

        api.get<ChatUserResponse>(`/users/${userId}`)
            .then((response) => {
                if (active) setChatUserName(response.data.name)
            })
            .catch(() => {
                if (active) setChatUserName("Usuário não encontrado")
            })

        return () => {
            active = false
        }
    }, [userId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ block: "end" })
    }, [messages])

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
        <div className="flex h-[calc(100dvh-7rem)] min-h-[32rem] w-full max-w-5xl flex-col px-2 py-4 sm:p-6">
            <h1 className="text-2xl font-bold mb-4">Chat com {chatUserName}</h1>

            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto rounded-lg border p-4 sm:p-6">
                {messages.length === 0 && (
                    <p className="m-auto text-sm text-muted-foreground">
                        Nenhuma mensagem ainda. Envie a primeira.
                    </p>
                )}

                {messages.map((message) => {
                    const isOwnMessage = message.sender === currentUser?.id

                    return (
                        <div
                            key={message.id}
                            className={`flex w-full ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-3 py-2 ${
                                    isOwnMessage
                                        ? "rounded-br-sm bg-blue-600 text-white"
                                        : "rounded-bl-sm bg-muted text-foreground"
                                }`}
                            >
                                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="mt-4 flex flex-col gap-2 sm:flex-row">
                <input name="content" type="text" placeholder="Digite uma mensagem..." className="min-h-11 flex-1 rounded-lg border border-gray-300 p-2 dark:border-gray-700" />
                <button type="submit" className="min-h-11 rounded-lg bg-blue-500 px-8 py-2 text-white">Enviar</button>
            </form>
        </div>
    )
}
