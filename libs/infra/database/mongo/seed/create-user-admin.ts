import { UserRole } from '@@/apps/common-old/src/core/user/entity/user';
import { UserEntity } from '@@/apps/common-old/src/core/user/entity/user';

export const UserAdminSeed = {
  id: 'b23fd7b8-b1eb-44df-b99e-297bf346e88e',
  login: 'admin',
  password: 'admin',
  roles: [UserRole.BACKOFFICE, UserRole.USER, UserRole.ADMIN, UserRole.OPERATOR],
  userId: 'b23fd7b8-b1eb-44df-b99e-297bf346e88e',
  createdBy: 'b23fd7b8-b1eb-44df-b99e-297bf346e88e'
} as UserEntity;
