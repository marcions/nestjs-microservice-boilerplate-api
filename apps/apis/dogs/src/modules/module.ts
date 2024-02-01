import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TokenModule } from 'libs/auth';
import { InfraModule } from 'libs/infra/module';
import { RabbitMQModule } from 'libs/infra/queue';
import { RolesGuardInterceptor } from 'libs/utils/interceptors/auth-guard.interceptor';

import { DogsModule } from './dogs/module';
import { HealthModule } from './health/module';

@Global()
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuardInterceptor
    }
  ],
  imports: [ConfigModule.forRoot({}), DogsModule, HealthModule, InfraModule, TokenModule, RabbitMQModule],
  exports: [RabbitMQModule, ConfigModule.forRoot()]
})
export class MainModule {}
