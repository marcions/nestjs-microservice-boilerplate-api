import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TokenModule } from 'libs/auth';
import { RedisCacheModule } from 'libs/infra/cache/redis';
import { ILoggerAdapter, LoggerModule } from 'libs/infra/logger';
import { MicroserviceProxy } from 'libs/infra/rabbitmq';
import { IsLoggedMiddleware } from 'libs/utils/middlewares/is-logged.middleware';

import { PrismaModule } from '@/prisma';

import { IDogsCreateAdapter } from './adapter';
import { DogsController } from './controller';
import { DogsService } from './service';

@Module({
  imports: [TokenModule, LoggerModule, RedisCacheModule, PrismaModule],
  controllers: [DogsController],
  providers: [
    DogsService,
    {
      provide: IDogsCreateAdapter,
      useFactory: (microserviceProxy: MicroserviceProxy, loggerService: ILoggerAdapter) =>
        new DogsService(microserviceProxy, loggerService),
      inject: []
    }
  ]
})
export class DogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(DogsController);
  }
}
