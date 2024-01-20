import { z } from 'zod';

import { DogsEntity } from '@@/apps/common-old/src/core/dogs/entity/dogs';
import { ValidateSchema } from '@@/libs/utils/decorators/validate-schema.decorator';
import { PaginationInput, PaginationOutput, PaginationSchema } from '@@/libs/utils/pagination';
import { SearchSchema } from '@@/libs/utils/search';
import { SortSchema } from '@@/libs/utils/sort';

import { IDogsRepository } from '../repository/dogs';

export const DogsListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export type DogsListInput = PaginationInput<DogsEntity>;
export type DogsListOutput = PaginationOutput<DogsEntity>;

export class DogsListUsecase {
  constructor(private readonly dogsRepository: IDogsRepository) {}

  @ValidateSchema(DogsListSchema)
  async execute(input: DogsListInput): Promise<DogsListOutput> {
    return await this.dogsRepository.paginate(input);
  }
}
