import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { TokenModule } from '@@/libs/auth';

import { InfraModule } from '../../../libs/infra/module';
import { RolesGuardInterceptor } from '../../../libs/utils/interceptors/auth-guard.interceptor';
import { CatsModule } from './modules/cats/module';
import { LoginModule } from './modules/login/module';
import { LogoutModule } from './modules/logout/module';
import { UserModule } from './modules/user/module';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuardInterceptor
    }
  ],
  imports: [InfraModule, UserModule, LoginModule, LogoutModule, TokenModule, CatsModule]
})
export class AppModule {}
