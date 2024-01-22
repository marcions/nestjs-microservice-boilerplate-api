import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TokenModule } from 'libs/auth';
import { RedisCacheModule } from 'libs/infra/cache/redis';
import { IDataBaseAdapter } from 'libs/infra/database';
import { PostgresDatabaseModule } from 'libs/infra/database/postgres/module';
import { CatsSchema } from 'libs/infra/database/postgres/schemas/cats';
import { ILoggerAdapter, LoggerModule } from 'libs/infra/logger';
import { IsLoggedMiddleware } from 'libs/utils/middlewares/is-logged.middleware';
import { ModelCtor, Sequelize } from 'sequelize-typescript';

import { CatsEntity } from '../../core/entity/cats';
import { ICatsRepository } from '../../core/repository/cats';
import { CatsCreateUsecase } from '../../core/use-cases/cats-create';
import { CatsDeleteUsecase } from '../../core/use-cases/cats-delete';
import { CatsGetByIdUsecase } from '../../core/use-cases/cats-getByID';
import { CatsListUsecase } from '../../core/use-cases/cats-list';
import { CatsUpdateUsecase } from '../../core/use-cases/cats-update';
import {
  ICatsCreateAdapter,
  ICatsDeleteAdapter,
  ICatsGetByIDAdapter,
  ICatsListAdapter,
  ICatsUpdateAdapter
} from './adapter';
import { CatsController } from './controller';
import { CatsRepository } from './repository';

@Module({
  imports: [TokenModule, LoggerModule, RedisCacheModule, PostgresDatabaseModule],
  controllers: [CatsController],
  providers: [
    {
      provide: ICatsRepository,
      useFactory: (database: IDataBaseAdapter) => {
        const repossitory = database.getDatabase<Sequelize>().model(CatsSchema);
        return new CatsRepository(repossitory as ModelCtor<CatsSchema> & CatsEntity);
      },
      inject: [IDataBaseAdapter]
    },
    {
      provide: ICatsCreateAdapter,
      useFactory: (repository: ICatsRepository) => new CatsCreateUsecase(repository),
      inject: [ICatsRepository]
    },
    {
      provide: ICatsUpdateAdapter,
      useFactory: (logger: ILoggerAdapter, repository: ICatsRepository) => new CatsUpdateUsecase(repository, logger),
      inject: [ILoggerAdapter, ICatsRepository]
    },
    {
      provide: ICatsGetByIDAdapter,
      useFactory: (repository: ICatsRepository) => new CatsGetByIdUsecase(repository),
      inject: [ICatsRepository]
    },
    {
      provide: ICatsListAdapter,
      useFactory: (repository: ICatsRepository) => new CatsListUsecase(repository),
      inject: [ICatsRepository]
    },
    {
      provide: ICatsDeleteAdapter,
      useFactory: (repository: ICatsRepository) => new CatsDeleteUsecase(repository),
      inject: [ICatsRepository]
    }
  ],
  exports: []
})
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IsLoggedMiddleware).forRoutes(CatsController);
  }
}
