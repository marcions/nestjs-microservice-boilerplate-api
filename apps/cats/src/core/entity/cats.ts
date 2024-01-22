import { BaseEntity } from 'libs/utils/entity';
import { z } from 'zod';

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

export const CatsEntitySchema = z.object({
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

type Cat = z.infer<typeof CatsEntitySchema>;

export class CatsEntity extends BaseEntity<CatsEntity>(CatsEntitySchema) {
  name: string;
  breed: string;
  age: number;
  status: boolean;

  constructor(entity: Cat) {
    super();
    Object.assign(this, this.validate(entity));
  }
}
