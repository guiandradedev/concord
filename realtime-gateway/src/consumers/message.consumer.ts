import type { Kafka } from "kafkajs";
import type { Server } from "socket.io";
import { Consumer } from "./consumer";
import { ConnectedUsers } from "../sessions/connected-users";
import { handleMessage } from "../handlers/message.handler";

export class MessageConsumer extends Consumer {
    private readonly topic = "my-topic";

    constructor(
        private readonly kafka: Kafka,
        private readonly io: Server,
        private readonly users: ConnectedUsers,
    ) {
        super();
    }

    consume(): void {
        const consumer = this.kafka.consumer({ groupId: "my-group" });

        const run = async () => {
            await consumer.connect();
            await consumer.subscribe({ topic: this.topic, fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ message }) => {
                    try {
                        handleMessage(message.value?.toString() || '"{}"', this.users, {
                            emit: (socketId, event, payload) => this.io.to(socketId).emit(event, payload),
                        });
                    } catch (error) {
                        console.error("Erro ao processar mensagem do Kafka:", error);
                    }
                },
            });
        };

        run().catch(console.error);
    }
}