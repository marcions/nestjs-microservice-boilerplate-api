import { BaseEntity, FindOneOptions, FindOptionsSelectByString, FindOptionsWhere, In, Raw, Repository } from 'typeorm';

import { IEntity } from '@/utils/entity';
import { ApiBadRequestException, ApiInternalServerException, ApiNotFoundException } from '@/utils/exception';

import { IRepository } from '../adapter';
import { CreatedModel, CreatedOrUpdateModel, DatabaseOperationCommand, RemovedModel, UpdatedModel } from '../types';

type Model = BaseEntity & IEntity;

export class PostgresRepository<T extends Model> implements IRepository<T> {
  constructor(readonly repository: Repository<T>) {}

  async create<TOptions = unknown>(document: T, saveOptions?: TOptions): Promise<CreatedModel> {
    const entity = this.repository.create(document);
    const model = await entity.save(saveOptions);
    return { created: model.hasId(), id: model.id };
  }

  async findById(id: string): Promise<T> {
    return this.repository.findOne({
      where: { id, deletedAt: null }
    } as FindOneOptions<T>);
  }

  async insertMany(document: T[]): Promise<void> {
    await this.repository.insert(document as object[]);
  }

  async createOrUpdate<TUpdate = Partial<T>>(updated: TUpdate): Promise<CreatedOrUpdateModel> {
    if (!updated['id']) {
      throw new ApiBadRequestException('id is required');
    }

    const exists = await this.findById(updated['id']);

    if (!exists) {
      const created = await this.create(updated as unknown as T);

      return { id: created.id, created: true, updated: false };
    }

    const row = await this.repository.update(
      { id: exists.id } as FindOptionsWhere<T>,
      { ...exists, ...updated } as object
    );

    return { id: exists.id, created: false, updated: row.affected > 0 };
  }

  async findAll(): Promise<T[]> {
    return this.repository.find({
      where: { deletedAt: null }
    } as FindOneOptions<T>);
  }

  async find<TQuery = Partial<T>>(filter: TQuery): Promise<T[]> {
    return this.repository.find({
      where: { ...filter, deletedAt: null }
    } as FindOneOptions<T>);
  }

  async findIn(filter: { [key in keyof Partial<T>]: string[] }): Promise<T[]> {
    const key = Object.keys(filter)[0];
    return this.repository.find({
      where: { [key]: In(filter[`${key}`]), deletedAt: null }
    } as FindOneOptions<T>);
  }

  async findByCommands(filterList: DatabaseOperationCommand<T>[]): Promise<T[]> {
    const searchList = {
      deletedAt: null
    };

    const postgresSearch = {
      equal: {
        query: (value: unknown[]) =>
          Raw((alias) => `${alias} ILIKE ANY ('{${value.map((v) => `${`${v}`}`).join(', ')}}')`),
        like: false
      },
      not_equal: {
        query: (value: unknown[]) =>
          Raw((alias) => `${alias} NOT ILIKE ALL (ARRAY[${value.map((v) => `'${v}'`).join(', ')}])`),
        like: false
      },
      not_contains: {
        query: (value: unknown[]) =>
          Raw((alias) => `${alias} NOT ILIKE ALL (ARRAY[${value.map((v) => `'%${v}%'`).join(', ')}])`),
        like: true
      },
      contains: {
        query: (value: unknown[]) =>
          Raw((alias) => `${alias} ILIKE ANY ('{${value.map((v) => `${`%${v}%`}`).join(', ')}}')`),
        like: true
      }
    };

    for (const filter of filterList) {
      searchList[`${filter.property.toString()}`] = postgresSearch[filter.command].query(filter.value);
    }

    return this.repository.find({
      where: searchList
    } as FindOneOptions<T>);
  }

  async remove<TQuery = Partial<T>>(filter: TQuery): Promise<RemovedModel> {
    const data = await this.repository.delete(filter as FindOptionsWhere<T>);
    return { deletedCount: data.affected, deleted: !!data.affected };
  }

  async findOne<TQuery = Partial<T>>(filter: TQuery): Promise<T> {
    Object.assign(filter, { deletedAt: null });
    return this.repository.findOne({
      where: filter
    } as FindOneOptions<T>);
  }

  async updateOne<TQuery = Partial<T>, TUpdate = Partial<T>>(filter: TQuery, updated: TUpdate): Promise<UpdatedModel> {
    const data = await this.repository.update(filter as FindOptionsWhere<T>, updated as object);
    return {
      modifiedCount: data.affected,
      upsertedCount: 0,
      upsertedId: 0,
      matchedCount: data.affected,
      acknowledged: !!data.affected
    };
  }

  async findOneAndUpdate<TQuery = Partial<T>, TUpdate = Partial<T>>(filter: TQuery, updated: TUpdate): Promise<T> {
    const data = await this.repository.update(filter as FindOptionsWhere<T>, updated as object);

    if (data.affected === 0) {
      throw new ApiNotFoundException();
    }

    return this.findOne(filter);
  }

  async updateMany<TQuery = Partial<T>, TUpdate = Partial<T>>(filter: TQuery, updated: TUpdate): Promise<UpdatedModel> {
    Object.assign(filter, { deletedAt: null });
    const data = await this.repository.update(filter as FindOptionsWhere<T>, updated as object);
    return {
      modifiedCount: data.affected,
      upsertedCount: 0,
      upsertedId: 0,
      matchedCount: data.affected,
      acknowledged: !!data.affected
    };
  }

  async findOneWithSelectFields<TQuery = Partial<T>>(filter: TQuery, includeProperties: (keyof T)[]): Promise<T> {
    Object.assign(filter, { deletedAt: null });
    const select = includeProperties.map((e) => `${e.toString()}`);
    return this.repository.findOne({
      where: filter as FindOptionsWhere<T>,
      select: select as FindOptionsSelectByString<T>
    });
  }

  async findAllWithSelectFields<TQuery = Partial<T>>(includeProperties: (keyof T)[], filter?: TQuery): Promise<T[]> {
    const select = includeProperties.map((e) => `${e.toString()}`);
    return this.repository.find({
      where: { ...filter, deletedAt: null } as FindOptionsWhere<T>,
      select: select as FindOptionsSelectByString<T>
    });
  }

  async seed(entityList: T[]): Promise<void> {
    try {
      const someHasNoID = entityList.some((e) => !e.id);

      if (someHasNoID) {
        throw new ApiInternalServerException('seed id is required');
      }

      for (const model of entityList) {
        const data = await this.findById(model.id);
        if (!data) {
          await this.create(model);
        }
      }
    } catch (error) {
      console.error('MongoRepository:Error', error);
    }
  }

  async findOneWithExcludeFields(filter: unknown, excludeProperties: (keyof T)[]): Promise<T> {
    Object.assign(filter, { deletedAt: null });
    const select = excludeProperties.map((e) => `${e.toString()}`);
    return this.repository.findOne({
      where: filter as FindOptionsWhere<T>,
      select: this.excludeColumns(select) as FindOptionsSelectByString<T>
    });
  }

  async findAllWithExcludeFields<TQuery = Partial<T>>(excludeProperties: (keyof T)[], filter?: TQuery): Promise<T[]> {
    const select = excludeProperties.map((e) => `${e.toString()}`);
    return this.repository.find({
      where: { deletedAt: null, ...filter } as FindOptionsWhere<T>,
      select: this.excludeColumns(select) as FindOptionsSelectByString<T>
    });
  }

  private excludeColumns = (columnsToExclude: string[]): string[] =>
    this.repository.metadata.columns
      .map((column) => column.databaseName)
      .filter((columnName) => !columnsToExclude.includes(columnName));
}
