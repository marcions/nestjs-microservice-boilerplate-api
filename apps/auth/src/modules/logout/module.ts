import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TokenModule } from 'libs/auth/module';
import { LogoutUsecase } from 'libs/core/user/use-cases/user-logout';
import { ICacheAdapter } from 'libs/infra/cache';
import { RedisCacheModule } from 'libs/infra/cache/redis';
import { LoggerModule } from 'libs/infra/logger';
import { ISecretsAdapter, SecretsModule } from 'libs/infra/secrets';
import { IsLoggedMiddleware } from 'libs/utils/middlewares/is-logged.middleware';

import { ILogoutAdapter } from './adapter';
import { LogoutController } from './controller';

@Module({
  imports: [RedisCacheModule, SecretsModule, RedisCacheModule, TokenModule, LoggerModule],
  controllers: [LogoutController],
  providers: [
    {
      provide: ILogoutAdapter,
      useFactory: (cache: ICacheAdapter, secrets: ISecretsAdapter) => {
        return new LogoutUsecase(cache, secrets);
      },
      inject: [ICacheAdapter, ISecretsAdapter]
    }
  ],
  exports: [ILogoutAdapter]
})
export class LogoutModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(LogoutController);
  }
}
