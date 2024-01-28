import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TokenModule } from 'libs/auth';
import { RedisCacheModule } from 'libs/infra/cache/redis';
import { LoggerModule } from 'libs/infra/logger';
import { IsLoggedMiddleware } from 'libs/utils/middlewares/is-logged.middleware';

import { PrismaModule } from '@/prisma';

import { DogsController } from './controller';
import { DogsService } from './service';

@Module({
  imports: [TokenModule, LoggerModule, RedisCacheModule, PrismaModule],
  controllers: [DogsController],
  providers: [DogsService]
})
export class DogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(DogsController);
  }
}
