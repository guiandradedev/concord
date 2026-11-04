export class ConnectedUsers {
    private users = new Map<string, string[]>();

    add(userId: string, socketId: string): void {
        this.users.set(userId, [...(this.users.get(userId) ?? []), socketId]);
    }

    remove(userId: string, socketId: string): void {
        const remaining = (this.users.get(userId) ?? []).filter(id => id !== socketId);

        if (remaining.length) {
            this.users.set(userId, remaining);
        } else {
            this.users.delete(userId);
        }
    }

    socketsOf(userId: string): string[] {
        return this.users.get(userId) ?? [];
    }
}