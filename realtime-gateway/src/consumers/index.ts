import { Consumer } from "./consumer";
import { MessageConsumer } from "./message.consumer.js";

export class ConsumersRunner {
    private consumers: Consumer[];

    constructor() {
        this.consumers = [new MessageConsumer()];
    }

    run(): void {
        this.consumers.forEach((consumer) => consumer.consume());
    }
}