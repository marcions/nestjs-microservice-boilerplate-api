import { Microservice } from '@libs/utils/enum/index';
import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';

import { MicroserviceProxy } from './microservice-proxy';
import { RabbitMQConfig } from './rabbitmq.config';

@Module({
  imports: [],
  providers: [
    {
      provide: Microservice.PRODUCT,
      useFactory: (rabbitMqConfig: RabbitMQConfig) => {
        rabbitMqConfig = new RabbitMQConfig();
        return ClientProxyFactory.create(rabbitMqConfig.getOptions(Microservice.PRODUCT));
      }
    },
    {
      provide: Microservice.PRODUCT_PRICE,
      useFactory: (rabbitMqConfig: RabbitMQConfig) => {
        rabbitMqConfig = new RabbitMQConfig();
        return ClientProxyFactory.create(rabbitMqConfig.getOptions(Microservice.PRODUCT_PRICE));
      }
    },
    {
      provide: Microservice.USER,
      useFactory: (rabbitMqConfig: RabbitMQConfig) => {
        rabbitMqConfig = new RabbitMQConfig();
        return ClientProxyFactory.create(rabbitMqConfig.getOptions(Microservice.USER));
      }
    },
    {
      provide: Microservice.CART,
      useFactory: (rabbitMqConfig: RabbitMQConfig) => {
        rabbitMqConfig = new RabbitMQConfig();
        return ClientProxyFactory.create(rabbitMqConfig.getOptions(Microservice.CART));
      }
    },
    {
      provide: Microservice.CHECKOUT,
      useFactory: (rabbitMqConfig: RabbitMQConfig) => {
        rabbitMqConfig = new RabbitMQConfig();
        return ClientProxyFactory.create(rabbitMqConfig.getOptions(Microservice.CHECKOUT));
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
