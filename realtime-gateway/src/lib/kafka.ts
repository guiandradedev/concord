import { Kafka } from "kafkajs";

export function createKafka(): Kafka {
  return new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: process.env.KAFKA_BROKERS?.split(",") || ["localhost:9092"],
  });
}