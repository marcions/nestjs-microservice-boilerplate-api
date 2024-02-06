import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { Microservice } from 'libs/utils/enum/index';

import { RabbitMQConfig } from './config';
import { MicroserviceProxy } from './microservice-proxy';

@Module({
  imports: [],
  providers: [
    {
      provide: Microservice.DOGS,
      useFactory: (rabbitMqConfig: RabbitMQConfig) => {
        rabbitMqConfig = new RabbitMQConfig();
        return ClientProxyFactory.create(rabbitMqConfig.getOptions(Microservice.DOGS));
      }
    },
    {
      provide: MicroserviceProxy.MICROSERVICE_PROXY_SERVICE,
      useClass: MicroserviceProxy
    }
  ],
  exports: [
    {
      provide: MicroserviceProxy.MICROSERVICE_PROXY_SERVICE,
      useClass: MicroserviceProxy
    }
  ]
})
export class RabbitMQModule {}
