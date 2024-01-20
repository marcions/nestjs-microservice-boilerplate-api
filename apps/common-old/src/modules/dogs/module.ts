import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ModelCtor, Sequelize } from 'sequelize-typescript';

import { DogsEntity } from '@@/apps/common-old/src/core/dogs/entity/dogs';
import { IDogsRepository } from '@@/apps/common-old/src/core/dogs/repository/dogs';
import { DogsCreateUsecase } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-create';
import { DogsDeleteUsecase } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-delete';
import { DogsGetByIdUsecase } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-getByID';
import { DogsListUsecase } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-list';
import { DogsUpdateUsecase } from '@@/apps/common-old/src/core/dogs/use-cases/dogs-update';
import { RedisCacheModule } from '@@/libs/infra/cache/redis';
import { IDataBaseAdapter } from '@@/libs/infra/database';
import { PostgresDatabaseModule } from '@@/libs/infra/database/postgres/module';
import { DogsSchema } from '@@/libs/infra/database/postgres/schemas/dogs';
import { ILoggerAdapter, LoggerModule } from '@@/libs/infra/logger';
import { TokenModule } from '@@/libs/auth';
import { IsLoggedMiddleware } from '@@/libs/utils/middlewares/is-logged.middleware';

import {
  IDogsCreateAdapter,
  IDogsDeleteAdapter,
  IDogsGetByIDAdapter,
  IDogsListAdapter,
  IDogsUpdateAdapter
} from './adapter';
import { DogsController } from './controller';
import { DogsRepository } from './repository';

@Module({
  imports: [TokenModule, LoggerModule, RedisCacheModule, PostgresDatabaseModule],
  controllers: [DogsController],
  providers: [
    {
      provide: IDogsRepository,
      useFactory: (database: IDataBaseAdapter) => {
        const repossitory = database.getDatabase<Sequelize>().model(DogsSchema);
        return new DogsRepository(repossitory as ModelCtor<DogsSchema> & DogsEntity);
      },
      inject: [IDataBaseAdapter]
    },
    {
      provide: IDogsCreateAdapter,
      useFactory: (logger: ILoggerAdapter, repository: IDogsRepository) => new DogsCreateUsecase(repository, logger),
      inject: [ILoggerAdapter, IDogsRepository]
    },
    {
      provide: IDogsUpdateAdapter,
      useFactory: (logger: ILoggerAdapter, repository: IDogsRepository) => new DogsUpdateUsecase(repository, logger),
      inject: [ILoggerAdapter, IDogsRepository]
    },
    {
      provide: IDogsGetByIDAdapter,
      useFactory: (repository: IDogsRepository) => new DogsGetByIdUsecase(repository),
      inject: [IDogsRepository]
    },
    {
      provide: IDogsListAdapter,
      useFactory: (repository: IDogsRepository) => new DogsListUsecase(repository),
      inject: [IDogsRepository]
    },
    {
      provide: IDogsDeleteAdapter,
      useFactory: (repository: IDogsRepository) => new DogsDeleteUsecase(repository),
      inject: [IDogsRepository]
    }
  ],
  exports: []
})
export class DogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(DogsController);
  }
}
