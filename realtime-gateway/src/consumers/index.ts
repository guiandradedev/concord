import type { Kafka } from "kafkajs";
import type { Server } from "socket.io";
import { Consumer } from "./consumer";
import { MessageConsumer } from "./message.consumer";
import { ConnectedUsers } from "../sessions/connected-users";

export class ConsumersRunner {
    private consumers: Consumer[];

    constructor(kafka: Kafka, io: Server, users: ConnectedUsers) {
        this.consumers = [new MessageConsumer(kafka, io, users)];
    }

    run(): void {
        this.consumers.forEach((consumer) => consumer.consume());
    }
}