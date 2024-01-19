import { UserRole } from '@/core/user/entity/user';
import { UserEntity } from '@/core/user/entity/user';

export const UserHubcontrolSeed = {
  id: '9269248e-54cc-46f9-80c0-7029c989c0e3',
  login: 'hubcontrol',
  password: 'hubcontrol',
  roles: [UserRole.USER],
  userId: 'b23fd7b8-b1eb-44df-b99e-297bf346e88e',
  createdBy: 'b23fd7b8-b1eb-44df-b99e-297bf346e88e'
} as UserEntity;
