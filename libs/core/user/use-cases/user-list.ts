import { ValidateSchema } from 'libs/utils/decorators/validate-schema.decorator';
import { PaginationInput, PaginationOutput, PaginationSchema } from 'libs/utils/pagination';
import { SearchSchema } from 'libs/utils/search';
import { SortSchema } from 'libs/utils/sort';
import { z } from 'zod';

import { UserEntity } from '../entity/user';
import { IUserRepository } from '../repository/user';

export const UserListSchema = z.intersection(PaginationSchema, SortSchema.merge(SearchSchema));

export type UserListInput = PaginationInput<UserEntity>;
export type UserListOutput = PaginationOutput<UserEntity>;

export class UserListUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  @ValidateSchema(UserListSchema)
  async execute(input: UserListInput): Promise<UserListOutput> {
    const users = await this.userRepository.paginate(input);

    return {
      docs: users.docs.map((u) => {
        const model = new UserEntity(u);
        model.anonymizePassword();

        return model;
      }),
      limit: users.limit,
      page: users.page,
      total: users.total
    };
  }
}