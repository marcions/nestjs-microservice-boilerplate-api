/* eslint-disable security/detect-object-injection */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Microservice } from 'libs/utils/enum/index';
import { MicroserviceType } from 'libs/utils/type/index';

export class RabbitMQConfig {
  private scheme = 'amqp';
  private url: string;
  private port: string;
  private host: string;
  private vhost: string;
  private username: string;
  private password: string;
  private transport: Transport.RMQ;
  private queue: string;
  private noAck: boolean;
  private persistent: boolean;
  private durable: boolean;

  private configService: ConfigService;

  constructor() {
    this.configService = new ConfigService();
    this.setVariables();
  }

  public setVariables(): void {
    this.transport = Transport.RMQ;

    this.noAck = this.configService.get('RMQ_QUEUE_ACK_CONFIG') === 'true' ? true : false;
    this.persistent = this.configService.get('RMQ_PERSISTENT_CONFIG') === 'true' ? true : false;
    this.durable = this.configService.get('RMQ_QUEUE_DURABLE_CONFIG') === 'true' ? true : false;
    this.host = this.configService.get('RMQ_HOST');
    this.vhost = this.configService.get('RMQ_VHOST');
    this.port = this.configService.get('RMQ_PORT');
    this.username = this.configService.get('RMQ_USER');
    this.password = this.configService.get('RMQ_PASSWORD');

    // this.noAck = this.secretsService.RMQ_QUEUE_ACK_CONFIG === 'true' ? true : false;
    // this.persistent = this.secretsService.RMQ_PERSISTENT_CONFIG === 'true' ? true : false;
    // this.durable = this.secretsService.RMQ_QUEUE_DURABLE_CONFIG === 'true' ? true : false;
    // this.host = this.secretsService.RMQ_HOST;
    // this.vhost = this.secretsService.RMQ_VHOST;
    // this.port = this.secretsService.RMQ_PORT;
    // this.username = this.secretsService.RMQ_USER;
    // this.password = this.secretsService.RMQ_PASSWORD;

    this.url = `${this.scheme}://${this.username}:${this.password}@${this.host}:${this.port}${this.vhost}`;
  }

  public getOptions(microservice: MicroserviceType): any {
    const queueOptions = {
      [Microservice.DOGS]: () => {
        this.queue = Microservice.DOGS;
      }
    };

    queueOptions[microservice] && queueOptions[microservice]();

    return {
      transport: this.transport,
      options: {
        urls: [this.url],
        queue: this.queue,
        noAck: this.noAck,
        persistent: this.persistent,
        // prefetchCount: 1,
        queueOptions: {
          durable: this.durable
        },
        socketOptions: {
          heartbeatIntervalInSeconds: 60,
          reconnectTimeInSeconds: 5
        }
      }
    };
  }
}
