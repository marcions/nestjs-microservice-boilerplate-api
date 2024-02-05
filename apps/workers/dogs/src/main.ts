/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RabbitMQConfig } from 'libs/infra/rabbitmq';
import { Microservice } from 'libs/utils/enum';

import { DogsModule } from './module';

const rabbitMqConfig = new RabbitMQConfig();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    DogsModule,
    rabbitMqConfig.getOptions(Microservice.DOGS)
  );
  await app.listen();
}

bootstrap();
