export { };

declare global {
  namespace NodeJS {
    interface ProcessEnv {
        PORT?: string;
        KAFKA_CLIENT_ID: string;
        KAFKA_BROKERS: string;
    }
  }
}