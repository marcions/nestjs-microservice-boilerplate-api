import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ISecretsAdapter } from './adapter';

@Injectable()
export class SecretsService implements ISecretsAdapter {
  constructor(private readonly config: ConfigService) {}

  ENV = this.config.get('ENV');

  PORT = this.config.get<number>('PORT');

  HOST = this.config.get('HOST');

  LOGER_LEVEL = this.config.get('LOGER_LEVEL');

  REDIS_URL = this.config.get('REDIS_URL');

  POSTGRES_URL = `postgresql://${this.config.get('POSTGRES_USER')}:${this.config.get(
    'POSTGRES_PASSWORD'
  )}@${this.config.get('POSTGRES_HOST')}:${this.config.get('POSTGRES_PORT')}/${this.config.get('POSTGRES_DATABASE')}`;

  MONGO_URL = `${this.config.get('MONGO_URL')}/${this.config.get('MONGO_DATABASE')}${this.config.get('MONGO_PARAMS')}`;

  RMQ_HOST = this.config.get('RMQ_HOST');

  RMQ_USER = this.config.get('RMQ_USER');

  RMQ_PASSWORD = this.config.get('RMQ_PASSWORD');

  RMQ_PORT = this.config.get<number>('RMQ_PORT');

  RMQ_VHOST = this.config.get('RMQ_VHOST');

  RMQ_QUEUE_ACK_CONFIG = this.config.get('RMQ_QUEUE_ACK_CONFIG');

  RMQ_PERSISTENT_CONFIG = this.config.get('RMQ_PERSISTENT_CONFIG');

  RMQ_QUEUE_DURABLE_CONFIG = this.config.get('RMQ_QUEUE_DURABLE_CONFIG');

  RMQ_URL = `amqp://${this.config.get('RMQ_USER')}:${this.config.get('RMQ_PASSWORD')}@${this.config.get(
    'RMQ_HOST'
  )}:${this.config.get('RMQ_PORT')}${this.config.get('RMQ_VHOST')}`;

  RMQ_MANAGER_PORT = this.config.get<number>('RMQ_MANAGER_PORT');

  RMQ_MANAGER_URL = `http://${this.config.get('RMQ_HOST')}:${this.config.get('RMQ_MANAGER_PORT')}`;

  ZIPKIN_URL = this.config.get('ZIPKIN_URL');

  PROMETHUES_URL = this.config.get('PROMETHUES_URL');

  TOKEN_EXPIRATION = this.config.get<number>('TOKEN_EXPIRATION');

  JWT_SECRET_KEY = this.config.get('JWT_SECRET_KEY');

  RATE_LIMIT_BY_USER = this.config.get<number>('RATE_LIMIT_BY_USER');

  MONGO_EXPRESS_URL = this.config.get('MONGO_EXPRESS_URL');

  PGADMIN_URL = this.config.get('PGADMIN_URL');

  AUTH = {
    PORT: this.config.get<number>('AUTH_PORT'),
    HOST: this.config.get('HOST')
  };

  USERS = {
    PORT: this.config.get<number>('USERS_PORT'),
    HOST: this.config.get('HOST')
  };

  CATS = {
    PORT: this.config.get<number>('CATS_PORT'),
    HOST: this.config.get('HOST')
  };

  DOGS = {
    PORT: this.config.get<number>('DOGS_PORT'),
    HOST: this.config.get('HOST')
  };
}
