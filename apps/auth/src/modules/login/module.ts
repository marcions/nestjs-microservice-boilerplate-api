import { Module } from '@nestjs/common';
import { ITokenAdapter, TokenModule } from 'libs/auth';
import { IUserRepository } from 'libs/core/user/repository/user';
import { LoginUsecase } from 'libs/core/user/use-cases/user-login';

import { ILoginAdapter } from './adapter';
import { LoginController } from './controller';

@Module({
  imports: [TokenModule],
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
