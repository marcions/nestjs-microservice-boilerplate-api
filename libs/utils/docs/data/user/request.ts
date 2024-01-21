import { UserRole } from 'libs/core/user/entity/user';
import { getMockUUID } from 'libs/utils/tests/tests';

import { UserCreateInput } from '@/libs/core/user/use-cases/user-create';
import { UserUpdateInput } from '@/libs/core/user/use-cases/user-update';

export const UsersRequest = {
  create: { login: 'login', password: '*****', roles: [UserRole.USER] } as UserCreateInput,
  update: { id: getMockUUID(), login: 'login', password: '*****', roles: [UserRole.USER] } as UserUpdateInput
};
