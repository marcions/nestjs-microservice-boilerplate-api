import { Injectable } from '@nestjs/common';
import { Transaction } from 'sequelize';
import { ModelCtor } from 'sequelize-typescript';

import { DogsEntity } from '@/core/dogs/entity/dogs';
import { IDogsRepository } from '@/core/dogs/repository/dogs';
import { DogsListInput, DogsListOutput } from '@/core/dogs/use-cases/dogs-list';
import { DogsSchema } from '@/infra/database/postgres/schemas/dogs';
import { SequelizeRepository } from '@/infra/repository/postgres/repository';
import { DatabaseOptionsSchema, DatabaseOptionsType } from '@/utils/database/sequelize';
import { ConvertPaginateInputToSequelizeFilter } from '@/utils/decorators/database/postgres/convert-paginate-input-to-sequelize-filter.decorator';
import { ValidateDatabaseSortAllowed } from '@/utils/decorators/database/validate-database-sort-allowed.decorator';
import { SearchTypeEnum } from '@/utils/decorators/types';

type Model = ModelCtor<DogsSchema> & DogsEntity;

@Injectable()
export class DogsRepository extends SequelizeRepository<Model> implements IDogsRepository {
  constructor(readonly repository: Model) {
    super(repository);
  }

  async startSession<TTransaction = Transaction>(): Promise<TTransaction> {
    const transaction = await this.repository.sequelize.transaction();

    return transaction as TTransaction;
  }

  @ValidateDatabaseSortAllowed('createdAt', 'name')
  @ConvertPaginateInputToSequelizeFilter([{ name: 'name', type: SearchTypeEnum.like }])
  async paginate(input: DogsListInput, options: DatabaseOptionsType): Promise<DogsListOutput> {
    const { schema } = DatabaseOptionsSchema.parse(options);

    const list = await this.repository.schema(schema).findAndCountAll(input);

    return { docs: list.rows.map((r) => new DogsEntity(r)), limit: input.limit, page: input.page, total: list.count };
  }
}
