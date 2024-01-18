import { z } from 'zod';

import { BaseEntity, withID } from '@/utils/entity';

const Id = z.string().uuid();
const Name = z.string().trim().min(1).max(200);
const Breed = z.string().trim().min(1).max(200);
const Age = z.number().min(0).max(30);
const Status = z.boolean().default(true);
const Deleted = z.boolean().default(null).nullish();
const UserId = z.string().uuid().default(null).nullish();
const CreatedAt = z.date().nullish();
const CreatedBy = z.string().uuid().default(null).nullish();
const UpdatedAt = z.date().default(null).nullish();
const UpdatedBy = z.string().uuid().default(null).nullish();
const DeletedAt = z.date().default(null).nullish();
const DeletedBy = z.string().uuid().default(null).nullish();

export const DogsEntitySchema = z.object({
  id: Id,
  name: Name,
  breed: Breed,
  age: Age,
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

type Dogs = z.infer<typeof DogsEntitySchema>;

export class DogsEntity extends BaseEntity<DogsEntity>(DogsEntitySchema) {
  name: string;
  breed: string;
  age: number;
  status: boolean;

  constructor(entity: Dogs) {
    super();
    Object.assign(this, DogsEntitySchema.parse(withID(entity)));
  }
}
