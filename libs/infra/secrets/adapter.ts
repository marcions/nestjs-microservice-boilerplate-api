export abstract class ISecretsAdapter {
  ENV: string;
  PORT: number;
  HOST: string;
  LOGER_LEVEL: string;
  MONGO_URL: string;
  POSTGRES_URL: string;
  RMQ_HOST: string;
  RMQ_USER: string;
  RMQ_PASSWORD: string;
  RMQ_PORT: number;
  RMQ_VHOST: string;
  RMQ_QUEUE_ACK_CONFIG: string;
  RMQ_PERSISTENT_CONFIG: string;
  RMQ_QUEUE_DURABLE_CONFIG: string;
  RMQ_URL: string;
  RMQ_MANAGER_PORT: number;
  RMQ_MANAGER_URL: string;
  MONGO_EXPRESS_URL: string;
  PGADMIN_URL: string;
  REDIS_URL: string;
  ZIPKIN_URL: string;
  PROMETHUES_URL: string;
  TOKEN_EXPIRATION: number;
  RATE_LIMIT_BY_USER: number;
  JWT_SECRET_KEY: string;
  AUTH: {
    PORT: number;
    HOST: string;
  };
  USERS: {
    PORT: number;
    HOST: string;
  };
  CATS: {
    PORT: number;
    HOST: string;
  };
  DOGS: {
    PORT: number;
    HOST: string;
  };
}
