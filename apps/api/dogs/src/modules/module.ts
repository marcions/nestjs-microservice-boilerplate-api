import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TokenModule } from 'libs/auth';
import { InfraModule } from 'libs/infra/module';
import { RolesGuardInterceptor } from 'libs/utils/interceptors/auth-guard.interceptor';

import { DogsModule } from './dogs/module';
import { HealthModule } from './health/module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuardInterceptor
    }
  ],
  imports: [DogsModule, HealthModule, InfraModule, TokenModule]
})
export class MainModule {}