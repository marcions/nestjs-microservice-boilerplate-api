import { z } from 'zod';

import { CatsEntity } from '@@/apps/common-old/src/core/cats/entity/cats';
import { ValidateSchema } from '@@/libs/utils/decorators/validate-schema.decorator';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@@/libs/utils/pagination';
import { SearchSchema } from '@@/libs/utils/search';
import { SortSchema } from '@@/libs/utils/sort';

import { ICatsRepository } from '../repository/cats';

export const CatsListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export type CatsListInput = PaginationInput<CatsEntity>;
export type CatsListOutput = PaginationOutput<CatsEntity>;

export class CatsListUsecase {
  constructor(private readonly catsRepository: ICatsRepository) {}

  @ValidateSchema(CatsListSchema)
  async execute(input: CatsListInput): Promise<CatsListOutput> {
    return await this.catsRepository.paginate(input);
  }
}
