import { z } from 'zod';

import { BaseEntity } from '@@/libs/utils/entity';

const ID = z.string().uuid();
const Login = z.string().trim().min(1).max(200);
const Password = z.string().trim().min(1).max(200);
const Status = z.boolean().default(true);
const Deleted = z.boolean().default(null).nullish();
const UserId = z.string().uuid().default(null).nullish();
const CreatedAt = z.date().nullish();
const CreatedBy = z.string().uuid().default(null).nullish();
const UpdatedAt = z.date().default(null).nullish();
const UpdatedBy = z.string().uuid().default(null).nullish();
const DeletedAt = z.date().default(null).nullish();
const DeletedBy = z.string().uuid().default(null).nullish();

export enum UserRole {
  USER = 'USER',
  BACKOFFICE = 'BACKOFFICE',
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR'
}

export const UserEntitySchema = z.object({
  id: ID,
  login: Login,
  password: Password,
  roles: z.array(z.nativeEnum(UserRole)),
  status: Status,
  deleted: Deleted,
  userId: UserId,
  createdAt: CreatedAt,
  createdBy: CreatedBy,
  updatedAt: UpdatedAt,
  updatedBy: UpdatedBy,
  deletedAt: DeletedAt,
  deletedBy: DeletedBy
});

type User = z.infer<typeof UserEntitySchema>;

export class UserEntity extends BaseEntity<UserEntity>(UserEntitySchema) {
  id: string;
  login: string;
  password: string;
  roles: UserRole[];

  constructor(entity: User) {
    super();
    Object.assign(this, this.validate(entity));
  }

  anonymizePassword() {
    this.password = '**********';
  }
}
