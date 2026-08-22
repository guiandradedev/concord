import { kafka } from "../lib/kafka";
import { Consumer } from "./consumer";
import { io, connectedUsers } from "../socket/server";

export class MessageConsumer extends Consumer {
    private readonly topic = "my-topic";

    consume(): void {
        const consumer = kafka.consumer({ groupId: "my-group" });

        const run = async () => {
            await consumer.connect();
            await consumer.subscribe({ topic: this.topic, fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    try {
                        const rawValue = message.value?.toString() || "{}";
                        const parsedData = JSON.parse(JSON.parse(rawValue));
                        
                        const targetUserId = parsedData.target || parsedData.receiver;

                        console.log(`[Kafka] Mensagem recebida para o alvo: ${targetUserId}`);

                        if (targetUserId && connectedUsers.has(targetUserId)) {
                            const socketIds = connectedUsers.get(targetUserId);
                            
                            console.log(socketIds);

                            socketIds?.forEach(socketId => {
                                io.to(socketId).emit("new-message", parsedData);
                            })
                            
                            console.log(`Mensagem repassada para o usuario ${targetUserId}`);
                        } else {
                            console.log(`Usuario ${targetUserId} está offline. Ignorando.`);
                        }

                    } catch (error) {
                        console.error("Erro ao processar mensagem do Kafka:", error);
                    }
                },
            });
        };

        run().catch(console.error);
    }
}