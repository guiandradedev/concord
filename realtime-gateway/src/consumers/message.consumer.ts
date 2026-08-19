import { kafka } from "../lib/kafka";
import { Consumer } from "./consumer";

export class MessageConsumer extends Consumer {
    private readonly topic = "my-topic";

    consume(): void {
        const consumer = kafka.consumer({ groupId: "my-group" });

        const run = async () => {
            await consumer.connect();
            await consumer.subscribe({ topic: this.topic, fromBeginning: true });

            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    console.log({
                        topic,
                        partition,
                        value: JSON.parse(JSON.parse(message.value?.toString() || "{}")),
                    });
                },
            });
        };

        run().catch(console.error);
    }
}