import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TokenModule } from 'libs/auth';
import { InfraModule } from 'libs/infra/module';
import { RolesGuardInterceptor } from 'libs/utils/interceptors/auth-guard.interceptor';

import { HealthModule } from './health/module';
import { UserModule } from './users/module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuardInterceptor
    }
  ],
  imports: [UserModule, HealthModule, InfraModule, TokenModule]
})
export class MainModule {}
