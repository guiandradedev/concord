import { describe, it, expect, vi, beforeEach } from "vitest";
import { MessageConsumer } from "./message.consumer";
import type { Kafka } from "kafkajs";
import type { Server } from "socket.io";
import { ConnectedUsers } from "../sessions/connected-users";

describe("MessageConsumer", () => {
    let consumer: MessageConsumer;
    let kafkaMock: Kafka;
    let ioMock: Partial<Server>;
    let users: ConnectedUsers;
    let kafkaConsumerMock: any;

    beforeEach(() => {
        users = new ConnectedUsers();

        kafkaConsumerMock = {
            connect: vi.fn().mockResolvedValue(undefined),
            subscribe: vi.fn().mockResolvedValue(undefined),
            run: vi.fn().mockResolvedValue(undefined),
        };

        kafkaMock = {
            consumer: vi.fn().mockReturnValue(kafkaConsumerMock),
        } as any;

        ioMock = {
            to: vi.fn().mockReturnThis(),
            emit: vi.fn(),
        };

        consumer = new MessageConsumer(kafkaMock, ioMock as Server, users);
    });

    it("se inscreve no tópico", async () => {
        consumer.consume();

        await new Promise(resolve => setTimeout(resolve, 50));

        expect(kafkaConsumerMock.subscribe).toHaveBeenCalledWith({
            topic: "my-topic",
            fromBeginning: true,
        });
    });

    it("envia a mensagem para os sockets do usuário", async () => {
        users.add("user-1", "socket-1");
        const message = { target: "user-1", text: "oi" };
        const encoded = JSON.stringify(JSON.stringify(message));

        let eachMessageFn: any;
        kafkaConsumerMock.run.mockImplementation(async (config: any) => {
            eachMessageFn = config.eachMessage;
        });

        consumer.consume();
        await new Promise(resolve => setTimeout(resolve, 50));

        if (eachMessageFn) {
            await eachMessageFn({
                message: { value: Buffer.from(encoded) },
            });
        }

        expect(ioMock.to).toHaveBeenCalledWith("socket-1");
        expect(ioMock.emit).toHaveBeenCalledWith("new-message", message);
    });

    it("continua consumindo com payload inválido", async () => {
        let eachMessageFn: any;
        kafkaConsumerMock.run.mockImplementation(async (config: any) => {
            eachMessageFn = config.eachMessage;
        });

        consumer.consume();
        await new Promise(resolve => setTimeout(resolve, 50));

        if (eachMessageFn) {
            await eachMessageFn({
                message: { value: Buffer.from("invalid json") },
            });
        }

        expect(kafkaConsumerMock.run).toHaveBeenCalled();
    });
});
