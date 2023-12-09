import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CatsEntity } from '@/core/cats/entity/cats';
import { ICatsRepository } from '@/core/cats/repository/cats';
import { CatsListInput, CatsListOutput } from '@/core/cats/use-cases/cats-list';
import { CatsSchema } from '@/infra/database/postgres/schemas/cats';
import { PostgresRepository } from '@/infra/repository/postgres/repository';
import { ValidatePostgresFilter } from '@/utils/decorators/database/postgres/validate-typeorm-filter.decorator';
import { ValidateDatabaseSortAllowed } from '@/utils/decorators/database/validate-database-sort-allowed.decorator';
import { SearchTypeEnum } from '@/utils/decorators/types';
import { calucaleSkip } from '@/utils/pagination';

type Model = CatsSchema & CatsEntity;

@Injectable()
export class CatsRepository extends PostgresRepository<CatsEntity & CatsSchema> implements ICatsRepository {
  constructor(readonly repository: Repository<Model>) {
    super(repository);
  }

  @ValidateDatabaseSortAllowed<CatsEntity>('createdAt', 'breed')
  @ValidatePostgresFilter<CatsEntity>([
    { name: 'name', type: SearchTypeEnum.like },
    { name: 'breed', type: SearchTypeEnum.like },
    { name: 'age', type: SearchTypeEnum.equal }
  ])
  async paginate(input: CatsListInput): Promise<CatsListOutput> {
    const skip = calucaleSkip(input);

    const [docs, total] = await this.repository.findAndCount({
      take: input.limit,
      skip,
      order: input.sort,
      where: input.search as FindOptionsWhere<CatsEntity>
    });

    return { docs, total, page: input.page, limit: input.limit };
  }
}
