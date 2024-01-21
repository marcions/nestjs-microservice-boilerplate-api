import { UserRole } from 'apps/users/src/core/user/entity/user';
import { UserCreateInput } from '@@/apps/common-old/src/core/user/use-cases/user-create';
import { UserUpdateInput } from '@@/apps/common-old/src/core/user/use-cases/user-update';
import { getMockUUID } from '@@/libs/utils/tests/tests';

export const UsersRequest = {
  create: { login: 'login', password: '*****', roles: [UserRole.USER] } as UserCreateInput,
  update: { id: getMockUUID(), login: 'login', password: '*****', roles: [UserRole.USER] } as UserUpdateInput
};
