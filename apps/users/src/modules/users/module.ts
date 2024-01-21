import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { IUserRepository } from 'libs/core/user/repository/user';
import { UserCreateUsecase } from 'libs/core/user/use-cases/user-create';
import { UserDeleteUsecase } from 'libs/core/user/use-cases/user-delete';
import { UserGetByIdUsecase } from 'libs/core/user/use-cases/user-getByID';
import { UserListUsecase } from 'libs/core/user/use-cases/user-list';
import { UserUpdateUsecase } from 'libs/core/user/use-cases/user-update';
import { TokenModule } from 'libs/auth';
import { RedisCacheModule } from 'libs/infra/cache/redis';
import { ConnectionName } from 'libs/infra/database/enum';
import { User, UserDocument, UserSchema } from 'libs/infra/database/mongo/schemas/user';
import { ILoggerAdapter, LoggerModule } from 'libs/infra/logger';
import { SecretsModule } from 'libs/infra/secrets';
import { MongoRepositoryModelSessionType } from 'libs/utils/database/mongoose';
import { IsLoggedMiddleware } from 'libs/utils/middlewares/is-logged.middleware';
import mongoose, { Connection, PaginateModel, Schema } from 'mongoose';

import {
  IUserCreateAdapter,
  IUserDeleteAdapter,
  IUserGetByIDAdapter,
  IUserListAdapter,
  IUserUpdateAdapter
} from './adapter';
import { UserController } from './controller';
import { UserRepository } from './repository';

@Module({
  imports: [TokenModule, SecretsModule, LoggerModule, RedisCacheModule],
  controllers: [UserController],
  providers: [
    {
      provide: IUserRepository,
      useFactory: async (connection: Connection) => {
        type Model = mongoose.PaginateModel<UserDocument>;

        //  use if you want transaction
        const repository: MongoRepositoryModelSessionType<PaginateModel<UserDocument>> = connection.model<
          UserDocument,
          Model
        >(User.name, UserSchema as Schema);

        repository.connection = connection;

        // use if you not want transaction
        // const repository: PaginateModel<UserDocument> = connection.model<UserDocument, Model>(
        //   User.name,
        //   UserSchema as Schema
        // );

        return new UserRepository(repository);
      },
      inject: [getConnectionToken(ConnectionName.USER)]
    },
    {
      provide: IUserCreateAdapter,
      useFactory: (userRepository: IUserRepository, loggerService: ILoggerAdapter) => {
        return new UserCreateUsecase(userRepository, loggerService);
      },
      inject: [IUserRepository, ILoggerAdapter]
    },
    {
      provide: IUserUpdateAdapter,
      useFactory: (userRepository: IUserRepository, loggerService: ILoggerAdapter) => {
        return new UserUpdateUsecase(userRepository, loggerService);
      },
      inject: [IUserRepository, ILoggerAdapter]
    },
    {
      provide: IUserListAdapter,
      useFactory: (userRepository: IUserRepository) => {
        return new UserListUsecase(userRepository);
      },
      inject: [IUserRepository]
    },
    {
      provide: IUserDeleteAdapter,
      useFactory: (userRepository: IUserRepository) => {
        return new UserDeleteUsecase(userRepository);
      },
      inject: [IUserRepository]
    },
    {
      provide: IUserGetByIDAdapter,
      useFactory: (userRepository: IUserRepository) => {
        return new UserGetByIdUsecase(userRepository);
      },
      inject: [IUserRepository]
    }
  ],
  exports: [
    IUserRepository,
    IUserCreateAdapter,
    IUserUpdateAdapter,
    IUserListAdapter,
    IUserDeleteAdapter,
    IUserGetByIDAdapter
  ]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(UserController);
  }
}
