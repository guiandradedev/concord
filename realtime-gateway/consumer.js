const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-node-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "video-processing-group",
});

async function run() {
  await consumer.connect();

  await consumer.subscribe({
    topic: "videos",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        key: message.key?.toString(),
        value: message.value?.toString(),
      });
    },
  });
}

run().catch(console.error);
