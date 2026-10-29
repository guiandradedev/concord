import { ConnectedUsers } from "../sessions/connected-users";

export interface Emitter {
    emit(socketId: string, event: string, payload: unknown): void;
}

export function handleMessage(raw: string, users: ConnectedUsers, emitter: Emitter): boolean {
    const data = JSON.parse(JSON.parse(raw));
    const targetUserId = data.target || data.receiver;
    const socketIds = targetUserId ? users.socketsOf(targetUserId) : [];

    console.log(`[Kafka] Mensagem recebida para o alvo: ${targetUserId}`);

    if (!socketIds.length) {
        console.log(`Usuario ${targetUserId} está offline. Ignorando.`);
        return false;
    }

    socketIds.forEach(socketId => emitter.emit(socketId, "new-message", data));
    console.log(`Mensagem repassada para o usuario ${targetUserId}`);

    return true;
}