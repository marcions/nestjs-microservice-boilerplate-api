"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresRepository = void 0;
const typeorm_1 = require("typeorm");
const exception_1 = require("../../../utils/exception");
class PostgresRepository {
    constructor(repository) {
        this.repository = repository;
        this.excludeColumns = (columnsToExclude) => this.repository.metadata.columns
            .map(column => column.databaseName)
            .filter(columnName => !columnsToExclude.includes(columnName));
    }
    async create(document, saveOptions) {
        const entity = this.repository.create(document);
        const model = await entity.save(saveOptions);
        return { created: model.hasId(), id: model.id };
    }
    async findById(id) {
        return this.repository.findOne({
            where: { id, deletedAt: null }
        });
    }
    async insertMany(document) {
        await this.repository.insert(document);
    }
    async createOrUpdate(updated) {
        if (!updated['id']) {
            throw new exception_1.ApiBadRequestException('id is required');
        }
        const exists = await this.findById(updated['id']);
        if (!exists) {
            const created = await this.create(updated);
            return { id: created.id, created: true, updated: false };
        }
        const row = await this.repository.update({ id: exists.id }, Object.assign(Object.assign({}, exists), updated));
        return { id: exists.id, created: false, updated: row.affected > 0 };
    }
    async findAll() {
        return this.repository.find({
            where: { deletedAt: null }
        });
    }
    async find(filter) {
        return this.repository.find({
            where: Object.assign(Object.assign({}, filter), { deletedAt: null })
        });
    }
    async findIn(filter) {
        const key = Object.keys(filter)[0];
        return this.repository.find({
            where: { [key]: (0, typeorm_1.In)(filter[`${key}`]), deletedAt: null }
        });
    }
    async findByCommands(filterList) {
        const searchList = {
            deletedAt: null
        };
        const postgresSearch = {
            equal: {
                query: (value) => (0, typeorm_1.Raw)((alias) => `${alias} ILIKE ANY ('{${value.map((v) => `${`${v}`}`).join(', ')}}')`),
                like: false
            },
            not_equal: {
                query: (value) => (0, typeorm_1.Raw)((alias) => `${alias} NOT ILIKE ALL (ARRAY[${value.map((v) => `'${v}'`).join(', ')}])`),
                like: false
            },
            not_contains: {
                query: (value) => (0, typeorm_1.Raw)((alias) => `${alias} NOT ILIKE ALL (ARRAY[${value.map((v) => `'%${v}%'`).join(', ')}])`),
                like: true
            },
            contains: {
                query: (value) => (0, typeorm_1.Raw)((alias) => `${alias} ILIKE ANY ('{${value.map((v) => `${`%${v}%`}`).join(', ')}}')`),
                like: true
            }
        };
        for (const filter of filterList) {
            searchList[`${filter.property.toString()}`] = postgresSearch[filter.command].query(filter.value);
        }
        return this.repository.find({
            where: searchList
        });
    }
    async remove(filter) {
        const data = await this.repository.delete(filter);
        return { deletedCount: data.affected, deleted: !!data.affected };
    }
    async findOne(filter) {
        Object.assign(filter, { deletedAt: null });
        return this.repository.findOne({
            where: filter
        });
    }
    async updateOne(filter, updated) {
        const data = await this.repository.update(filter, updated);
        return {
            modifiedCount: data.affected,
            upsertedCount: 0,
            upsertedId: 0,
            matchedCount: data.affected,
            acknowledged: !!data.affected
        };
    }
    async findOneAndUpdate(filter, updated) {
        const data = await this.repository.update(filter, updated);
        if (data.affected === 0) {
            throw new exception_1.ApiNotFoundException();
        }
        return this.findOne(filter);
    }
    async updateMany(filter, updated) {
        Object.assign(filter, { deletedAt: null });
        const data = await this.repository.update(filter, updated);
        return {
            modifiedCount: data.affected,
            upsertedCount: 0,
            upsertedId: 0,
            matchedCount: data.affected,
            acknowledged: !!data.affected
        };
    }
    async findOneWithSelectFields(filter, includeProperties) {
        Object.assign(filter, { deletedAt: null });
        const select = includeProperties.map((e) => `${e.toString()}`);
        return this.repository.findOne({
            where: filter,
            select: select
        });
    }
    async findAllWithSelectFields(includeProperties, filter) {
        Object.assign(filter, { deletedAt: null });
        const select = includeProperties.map((e) => `${e.toString()}`);
        return this.repository.find({
            where: filter,
            select: select
        });
    }
    async seed(entityList) {
        try {
            const someHasNoID = entityList.some((e) => !e.id);
            if (someHasNoID) {
                throw new exception_1.ApiInternalServerException('seed id is required');
            }
            for (const model of entityList) {
                const data = await this.findById(model.id);
                if (!data) {
                    await this.create(model);
                }
            }
        }
        catch (error) {
            console.error('MongoRepository:Error', error);
        }
    }
    async findOneWithExcludeFields(filter, excludeProperties) {
        Object.assign(filter, { deletedAt: null });
        const select = excludeProperties.map((e) => `${e.toString()}`);
        return this.repository.findOne({
            where: filter,
            select: this.excludeColumns(select)
        });
    }
    async findAllWithExcludeFields(excludeProperties, filter) {
        const select = excludeProperties.map((e) => `${e.toString()}`);
        return this.repository.find({
            where: Object.assign({ deletedAt: null }, filter),
            select: this.excludeColumns(select)
        });
    }
}
exports.PostgresRepository = PostgresRepository;
//# sourceMappingURL=repository.js.map