import { Injectable } from '@nestjs/common';
import { CatsSchema } from 'libs/infra/database/postgres/schemas/cats';
import { SequelizeRepository } from 'libs/infra/repository/postgres/repository';
import { DatabaseOptionsSchema, DatabaseOptionsType } from 'libs/utils/database/sequelize';
import { ConvertPaginateInputToSequelizeFilter } from 'libs/utils/decorators/database/postgres/convert-paginate-input-to-sequelize-filter.decorator';
import { ValidateDatabaseSortAllowed } from 'libs/utils/decorators/database/validate-database-sort-allowed.decorator';
import { SearchTypeEnum } from 'libs/utils/decorators/types';
import { Transaction } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

import { CatsEntity } from '../../core/entity/cats';
import { ICatsRepository } from '../../core/repository/cats';
import { CatsListInput, CatsListOutput } from '../../core/use-cases/cats-list';

type Model = ModelCtor<CatsSchema> & CatsEntity;

@Injectable()
export class CatsRepository extends SequelizeRepository<Model> implements ICatsRepository {
  constructor(readonly repository: Model) {
    super(repository);
  }

  async startSession<TTransaction = Transaction>(): Promise<TTransaction> {
    const transaction = await this.repository.sequelize.transaction();

    return transaction as TTransaction;
  }

  @ValidateDatabaseSortAllowed<CatsEntity>('createdAt', 'breed')
  @ConvertPaginateInputToSequelizeFilter<CatsEntity>([
    { name: 'name', type: SearchTypeEnum.like },
    { name: 'breed', type: SearchTypeEnum.like },
    { name: 'age', type: SearchTypeEnum.equal }
  ])
  async paginate(input: CatsListInput, options: DatabaseOptionsType): Promise<CatsListOutput> {
    const { schema } = DatabaseOptionsSchema.parse(options);

    const list = await this.repository.schema(schema).findAndCountAll(input);

    return { docs: list.rows.map((r) => new CatsEntity(r)), limit: input.limit, page: input.page, total: list.count };
  }
}
