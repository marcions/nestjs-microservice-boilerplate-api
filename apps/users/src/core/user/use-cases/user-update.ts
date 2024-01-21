import { ILoggerAdapter } from 'libs/infra/logger';
import { ValidateSchema } from 'libs/utils/decorators/validate-schema.decorator';
import { ApiConflictException, ApiNotFoundException } from 'libs/utils/exception';
import { ApiTrancingInput } from 'libs/utils/request';
import { z } from 'zod';

import { UserEntity, UserEntitySchema } from '../entity/user';
import { IUserRepository } from '../repository/user';

export const UserUpdateSchema = UserEntitySchema.pick({
  id: true
}).merge(UserEntitySchema.omit({ id: true }).partial());

export type UserUpdateInput = Partial<z.infer<typeof UserUpdateSchema>>;
export type UserUpdateOutput = UserEntity;

export class UserUpdateUsecase {
  constructor(private readonly userRepository: IUserRepository, private readonly loggerService: ILoggerAdapter) {}

  @ValidateSchema(UserUpdateSchema)
  async execute(input: UserUpdateInput, { tracing, user: userData }: ApiTrancingInput): Promise<UserUpdateOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new ApiNotFoundException();
    }

    const entity = new UserEntity({ ...user, ...input });

    entity.setUpdated(user);

    const userExists = await this.userRepository.existsOnUpdate(
      { login: entity.login, password: entity.password },
      { id: entity.id }
    );

    if (userExists) {
      throw new ApiConflictException('user exists');
    }

    await this.userRepository.updateOne({ id: entity.id }, entity);

    this.loggerService.info({ message: 'user updated.', obj: { user: input } });

    const updated = await this.userRepository.findById(entity.id);

    const entityUpdated = new UserEntity(updated);

    entityUpdated.anonymizePassword();

    tracing.logEvent('user-updated', `user: ${user.login} updated by: ${userData.login}`);

    return entityUpdated;
  }
}
