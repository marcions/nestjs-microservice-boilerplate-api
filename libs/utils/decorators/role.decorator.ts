import { SetMetadata } from '@nestjs/common';

import { UserRole } from 'apps/users/src/core/user/entity/user';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
