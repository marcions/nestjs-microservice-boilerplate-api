import { Module } from '@nestjs/common';
//TODO: Rever essa importação de UserModule, pois é outro MS
import { UserModule } from 'api/users/src/modules/users/module';
import { ITokenAdapter, TokenModule } from 'libs/auth';
import { IUserRepository } from 'libs/core/user/repository/user';
import { LoginUsecase } from 'libs/core/user/use-cases/user-login';

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
