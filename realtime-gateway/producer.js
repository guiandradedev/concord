const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "my-node-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

async function run() {
  try {
    await producer.connect();

    console.log("Producer conectado");

    const result = await producer.send({
      topic: "my-topic",
      messages: [
        {
          key: "my-topic",
          value: JSON.stringify({
            videoId: "video-123a",
            status: "PROCESSING",
          }),
        },
      ],
    });

    console.log("Mensagem enviada:", result);
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  } finally {
    await producer.disconnect();
  }
}

run();