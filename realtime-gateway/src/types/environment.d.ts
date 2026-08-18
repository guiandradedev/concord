export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        KAFKA_CLIENT_ID: string;
        KAFKA_BROKERS: string;
    }
  }
}