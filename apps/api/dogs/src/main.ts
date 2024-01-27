import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

import { RabbitMQConfig } from '@/libs/infra/queue';
import { Microservice } from '@/libs/utils/enum';

import { MainModule } from './modules/module';

const rabbitMqConfig = new RabbitMQConfig();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MainModule,
    rabbitMqConfig.getOptions(Microservice.USER)
  );

  await app.listen();
}

bootstrap();
