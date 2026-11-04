import { describe, it, expect, beforeEach } from "vitest";
import { ConnectedUsers } from "./connected-users";

describe("ConnectedUsers", () => {
    let users: ConnectedUsers;

    beforeEach(() => {
        users = new ConnectedUsers();
    });

    it("registra um socket para o usuário", () => {
        users.add("user-1", "disp-1");

        expect(users.socketsOf("user-1")).toEqual(["disp-1"]);
    });

    it("remove o socket do usuário", () => {
        users.add("user-1", "disp-1");
        users.remove("user-1", "disp-1");

        expect(users.socketsOf("user-1")).toEqual([]);
    });

    it("usuário entra em múltiplos sockets (múltiplos dispositivos)", () => {
        users.add("user-1", "disp-1");
        users.add("user-1", "disp-2");

        expect(users.socketsOf("user-1")).toEqual(["disp-1", "disp-2"]);
    });

    it("remove apenas o socket informado quando há vários", () => {
        users.add("user-1", "disp-1");
        users.add("user-1", "disp-2");
        users.remove("user-1", "disp-1");

        expect(users.socketsOf("user-1")).toEqual(["disp-2"]);
    });

    it("remove o usuário quando o último socket é removido", () => {
        users.add("user-1", "disp-1");
        users.remove("user-1", "disp-1");

        expect(users.socketsOf("user-1")).toEqual([]);
    });

    it("remoção de usuário inválido é ignorada", () => {
        users.remove("user-1", "disp-1");

        expect(users.socketsOf("user-1")).toEqual([]);
    });

    it("retorna [] para usuário desconhecido", () => {
        expect(users.socketsOf("user-1")).toEqual([]);
    });
});
