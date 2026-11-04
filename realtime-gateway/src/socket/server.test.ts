import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createSocketServer } from "./server";
import { ConnectedUsers } from "../sessions/connected-users";
import axios from "axios";

describe("createSocketServer", () => {
    let users: ConnectedUsers;
    let serverInstance: any;

    beforeEach(() => {
        users = new ConnectedUsers();
    });

    afterEach(() => {
        if (serverInstance?.httpServer) {
            serverInstance.httpServer.close();
        }
    });

    it("registra usuário na conexão com userId", () => {
        serverInstance = createSocketServer(users);

        const mockSocket = {
            id: "socket-1",
            handshake: { auth: { userId: "user-1" } },
            on: () => {},
        };

        const userId = mockSocket.handshake.auth.userId;
        if (userId) {
            users.add(userId, mockSocket.id);
        }

        expect(users.socketsOf("user-1")).toEqual(["socket-1"]);
    });

    it("remove usuário no desconectar", () => {
        serverInstance = createSocketServer(users);

        users.add("user-1", "socket-1");
        expect(users.socketsOf("user-1")).toEqual(["socket-1"]);

        users.remove("user-1", "socket-1");

        expect(users.socketsOf("user-1")).toEqual([]);
    });

    it("não registra conexão sem userId", () => {
        serverInstance = createSocketServer(users);

        const mockSocket = {
            id: "socket-1",
            handshake: { auth: { userId: undefined } },
            on: () => {},
        };

        const userId = mockSocket.handshake.auth.userId;
        if (userId) {
            users.add(userId, mockSocket.id);
        }

        expect(users.socketsOf("unknown-user")).toEqual([]);
    });

    it("GET /health responde com sucesso", async () => {
        serverInstance = createSocketServer(users);
        const { httpServer } = serverInstance;

        const port = 3001 + Math.floor(Math.random() * 10000);
        httpServer.listen(port);

        try {
            const response = await axios.get(`http://localhost:${port}/health`);
            expect(response.status).toBe(200);
            expect(response.data).toEqual({ status: "ok" });
        } finally {
            httpServer.close();
        }
    });
});
