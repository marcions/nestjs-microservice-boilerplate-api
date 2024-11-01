import { ZodSchema } from 'zod';

import { DateUtils } from './date';
import { UUIDUtils } from './uuid';

export const withID = (entity: { _id?: string; id?: string }) => {
  Object.assign(entity, { id: [entity?.id, entity?._id, UUIDUtils.create()].find(Boolean) });
  return entity;
};

export interface IEntity {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;
}

export const BaseEntity = <T>(schema: ZodSchema) => {
  abstract class Entity implements IEntity {
    readonly id: string;

    readonly createdAt: Date;

    readonly updatedAt: Date;

    deletedAt?: Date;

    static nameOf = <D = keyof T>(name: keyof T) => name as D;

    deactivated() {
      this.deletedAt = DateUtils.getJSDate();
    }

    activated() {
      this.deletedAt = null;
    }

    validate<T>(entity: T): T {
      Object.assign(entity, withID(entity));
      Object.assign(this, { id: (entity as Pick<IEntity, 'id'>).id });
      return schema.parse(entity) as T;
    }
  }

  return Entity;
};
