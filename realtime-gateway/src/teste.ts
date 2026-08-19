import { Consumer, Kafka } from "kafkajs";

interface Message<T = unknown> {
  id: string;
  topic: string;
  key?: string;
  payload: T;
  headers?: Record<string, string>;
  timestamp: Date;
  correlationId?: string;
}

type AckResult = "ack" | "nack" | "retry";

interface MessageConsumer {
  subscribe<T>(
    topic: string,
    handler: (message: Message<T>) => Promise<AckResult>
  ): Promise<void>;
}

function normalizeHeaderValue(value: unknown): string {
  if (value == null) return "";

  if (typeof value === "string") return value;

  if (Buffer.isBuffer(value)) return value.toString("utf-8");

  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeHeaderValue(entry))
      .join(",");
  }

  return String(value);
}

function mapKafkaHeaders(headers: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      normalizeHeaderValue(value),
    ])
  );
}

async function publishToDLQ(message: Message<unknown>): Promise<void> {
  console.warn("Mensagem enviada para DLQ:", message);
}

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID ?? "realtime-gateway-client",
  brokers:
    process.env.KAFKA_BROKERS?.split(",").filter(Boolean) ?? [
      "localhost:9092",
    ],
});

export class KafkaConsumer implements MessageConsumer {
  constructor(private readonly consumer: Consumer) {}

  async subscribe<T>(
    topic: string,
    handler: (message: Message<T>) => Promise<AckResult>
  ): Promise<void> {
    await this.consumer.subscribe({ topic, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const rawValue = message.value;

        if (!rawValue) {
          console.warn(`[${topic}] Mensagem vazia recebida.`);
          return;
        }

        const correlationId = message.headers?.correlationId?.toString();

        const raw = message.value?.toString() ?? "";
        const payload = JSON.parse(raw);

        const parsed: Message<T> = {
          id: message.headers?.id?.toString() ?? String(message.offset),
          topic,
          payload,
          timestamp: new Date(Number(message.timestamp)),
          ...(message.key != null && { key: message.key.toString() }),
          ...(message.headers && {
            headers: mapKafkaHeaders(message.headers),
          }),
          ...(correlationId ? { correlationId } : {}),
        };

        const result = await handler(parsed);

        if (result === "nack") {
          await publishToDLQ(parsed);
        }
      },
    });
  }
}

export function createKafkaConsumer(groupId: string): KafkaConsumer {
  return new KafkaConsumer(kafka.consumer({ groupId }));
}

createKafkaConsumer("realtime-gateway-group").subscribe("my-topic", async (message) => {
    console.log("Mensagem recebida:", message);
    return "ack";
});