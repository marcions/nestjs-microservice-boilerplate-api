import { Module } from '@nestjs/common';

import { IUserRepository } from '@@/apps/common-old/src/core/user/repository/user';
import { LoginUsecase } from '@@/apps/common-old/src/core/user/use-cases/user-login';
import { ITokenAdapter, TokenModule } from '@@/libs/auth';

import { UserModule } from '../user/module';
import { ILoginAdapter } from './adapter';
import { LoginController } from './controller';

@Module({
  imports: [TokenModule, UserModule],
  controllers: [LoginController],
  providers: [
    {
      provide: ILoginAdapter,
      useFactory: (repository: IUserRepository, tokenService: ITokenAdapter) => {
        return new LoginUsecase(repository, tokenService);
      },
      inject: [IUserRepository, ITokenAdapter]
    }
  ]
})
export class LoginModule {}
