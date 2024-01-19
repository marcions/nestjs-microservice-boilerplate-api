import { v4 as uuidv4 } from 'uuid';
import { ZodSchema, ZodType } from 'zod';

export const withID = (entity: { _id?: string; id?: string }) => {
  entity.id = [entity?.id, entity?._id, uuidv4()].find(Boolean);
  return entity;
};

export interface IEntity {
  id: string;
  userId: string;
  status: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt?: Date;
  updatedBy?: string;
  deleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export const BaseEntity = <T>(schema: ZodSchema) => {
  abstract class Entity implements IEntity {
    readonly id: string;
    status: boolean;
    userId: string;
    readonly createdAt: Date;
    createdBy: string;
    updatedAt?: Date;
    updatedBy?: string;
    deleted?: boolean;
    deletedAt?: Date;
    deletedBy?: string;

    static nameOf = (name: keyof T) => name;

    setCreated(user: UserEntity) {
      this.userId = user.id;
      this.createdBy = user.id;
    }

    setUpdated(user: UserEntity) {
      this.updatedAt = new Date();
      this.updatedBy = user.id;
    }

    setDeleted(user: UserEntity) {
      this.deletedAt = new Date();
      this.deletedBy = user.id;
      this.deleted = true;
      this.status = false;
    }

    validate<T>(entity: T): ZodType {
      Object.assign(entity, withID(entity));
      Object.assign(this, { id: entity['id'] });
      return schema.parse(entity);
    }
  }

  return Entity;
};
