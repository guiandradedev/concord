import { describe, it, expect, vi, beforeEach } from "vitest";
import { handleMessage } from "./message.handler";
import { ConnectedUsers } from "../sessions/connected-users";

// O produtor envia o JSON serializado duas vezes
const encode = (payload: unknown) => JSON.stringify(JSON.stringify(payload));

describe("handleMessage", () => {
    let users: ConnectedUsers;
    const emitter = { emit: vi.fn() };

    beforeEach(() => {
        users = new ConnectedUsers();
        emitter.emit.mockClear();
    });

    it("envia a mensagem para o socket de um usuário", () => {
        users.add("user-1", "disp-1");
        const message = { target: "user-1", text: "oi" };

        const delivered = handleMessage(encode(message), users, emitter);

        expect(delivered).toBe(true);
        expect(emitter.emit).toHaveBeenCalledWith("disp-1", "new-message", message);
    });

    it("envia mensagem para todos os sockets de um usuário", () => {
        users.add("user-1", "disp-1");
        users.add("user-1", "disp-2");
        const message = { target: "user-1", text: "oi" };

        const delivered = handleMessage(encode(message), users, emitter);

        expect(delivered).toBe(true);
        expect(emitter.emit).toHaveBeenCalledWith("disp-1", "new-message", message);
        expect(emitter.emit).toHaveBeenCalledWith("disp-2", "new-message", message);
    })

    it("usa o próprio receiver quando não há target", () => {
        const message = { receiver: "user-1", text: "oi" };
        users.add("user-1", "disp-1");

        const delivered = handleMessage(encode(message), users, emitter);

        expect(delivered).toBe(true);
        expect(emitter.emit).toHaveBeenCalledWith("disp-1", "new-message", message);
    });

    it("prioriza target sobre receiver", () => {
        const message = { target: "user-1", receiver: "user-2", text: "oi" };
        users.add("user-1", "disp-1");
        users.add("user-2", "disp-2");

        const delivered = handleMessage(encode(message), users, emitter);

        expect(delivered).toBe(true);
        expect(emitter.emit).toHaveBeenCalledWith("disp-1", "new-message", message);
    });

    it("não envia para usuário offline", () => {
        const message = { target: "user-1", text: "oi" };

        const delivered = handleMessage(encode(message), users, emitter);

        expect(delivered).toBe(false);
        expect(emitter.emit).not.toHaveBeenCalled();
    });

    it("não envia mensagem para usuário desconhecido (target ou receiver inválidos)", () => {
        const message = { target: "user-1", text: "oi" };

        const delivered = handleMessage(encode(message), users, emitter);

        expect(delivered).toBe(false);
        expect(emitter.emit).not.toHaveBeenCalled();
    });

    it("retorna erro caso o payload seja inválido", () => {
        const message = { target: "user-1", text: "oi" };

        const delivered = handleMessage(encode(message), users, emitter);

        expect(delivered).toBe(false);
        expect(emitter.emit).not.toHaveBeenCalled();
    });
});
