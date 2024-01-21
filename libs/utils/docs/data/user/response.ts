import { UserEntity, UserRole } from 'apps/users/src/core/user/entity/user';
import { getMockUUID } from 'libs/utils/tests/tests';

import { UserCreateOutput } from '@/apps/users/src/core/user/use-cases/user-create';
import { UserDeleteOutput } from '@/apps/users/src/core/user/use-cases/user-delete';
import { UserGetByIDOutput } from '@/apps/users/src/core/user/use-cases/user-getByID';
import { UserListOutput } from '@/apps/users/src/core/user/use-cases/user-list';
import { UserUpdateOutput } from '@/apps/users/src/core/user/use-cases/user-update';

const entity = new UserEntity({
  login: 'login',
  password: '**********',
  roles: [UserRole.USER]
});

const fullEntity = new UserEntity({
  ...entity,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
});

export const UsersResponse = {
  create: { created: true, id: getMockUUID() } as UserCreateOutput,
  delete: { ...fullEntity, deletedAt: new Date() } as UserDeleteOutput,
  update: fullEntity as UserUpdateOutput,
  getByID: fullEntity as UserGetByIDOutput,
  list: { docs: [fullEntity], limit: 10, page: 1, total: 1 } as UserListOutput
};
