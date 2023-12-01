"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "MongoRepository", {
    enumerable: true,
    get: function() {
        return MongoRepository;
    }
});
const _mongoose = require("mongoose");
const _convertmongoosefilterdecorator = require("../../../utils/decorators/database/mongo/convert-mongoose-filter.decorator");
const _exception = require("../../../utils/exception");
const _util = require("../util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let MongoRepository = class MongoRepository {
    async insertMany(documents, saveOptions) {
        await this.model.insertMany(documents, saveOptions);
    }
    async create(document, saveOptions) {
        const createdEntity = new this.model({
            ...document,
            _id: document.id
        });
        const savedResult = await createdEntity.save(saveOptions);
        return {
            id: savedResult.id,
            created: !!savedResult.id
        };
    }
    async createOrUpdate(document, options) {
        if (!document['id']) {
            throw new _exception.ApiBadRequestException('id is required');
        }
        const exists = await this.findById(document['id']);
        if (!exists) {
            const createdEntity = new this.model({
                ...document,
                _id: document['id']
            });
            const savedResult = await createdEntity.save(options);
            return {
                id: savedResult.id,
                created: true,
                updated: false
            };
        }
        await this.model.updateOne({
            _id: exists.id
        }, document, options);
        return {
            id: exists.id,
            created: false,
            updated: true
        };
    }
    async find(filter, options) {
        return (await this.model.find(filter, undefined, options)).map((u)=>u.toObject({
                virtuals: true
            }));
    }
    async findById(id) {
        const model = await this.model.findById(id);
        if (!model) return null;
        return model.toObject({
            virtuals: true
        });
    }
    async findOne(filter, options) {
        const data = await this.model.findOne(filter, undefined, options);
        if (!data) return null;
        return data.toObject({
            virtuals: true
        });
    }
    async findAll(filter) {
        const modelList = await this.model.find(filter);
        return (modelList || []).map((u)=>u.toObject({
                virtuals: true
            }));
    }
    async remove(filter) {
        const { deletedCount } = await this.model.deleteOne(filter);
        return {
            deletedCount,
            deleted: !!deletedCount
        };
    }
    async updateOne(filter, updated, options) {
        return await this.model.updateOne(filter, updated, options);
    }
    async findOneAndUpdate(filter, updated, options = {}) {
        Object.assign(options, {
            new: true
        });
        const model = await this.model.findOneAndUpdate(filter, updated, options);
        if (!model) {
            return null;
        }
        return model.toObject({
            virtuals: true
        });
    }
    async updateMany(filter, updated, options) {
        return await this.model.updateMany(filter, updated, options);
    }
    async findIn(input, options) {
        const key = Object.keys(input)[0];
        const filter = {
            [key]: {
                $in: input[key === 'id' ? '_id' : key]
            },
            deletedAt: null
        };
        return await this.model.find(filter, null, options);
    }
    async findByCommands(filterList, options) {
        const mongoSearch = {
            equal: {
                type: '$in',
                like: false
            },
            not_equal: {
                type: '$nin',
                like: false
            },
            not_contains: {
                type: '$nin',
                like: true
            },
            contains: {
                type: '$in',
                like: true
            }
        };
        const searchList = {};
        (0, _util.validateFindByCommandsFilter)(filterList);
        for (const filter of filterList){
            const command = mongoSearch[filter.command];
            if (command.like) {
                Object.assign(searchList, {
                    [filter.property]: {
                        [command.type]: filter.value.map((value)=>new RegExp(`^${value}`, 'i'))
                    }
                });
                continue;
            }
            Object.assign(searchList, {
                [filter.property]: {
                    [command.type]: filter.value
                }
            });
        }
        Object.assign(searchList, {
            deletedAt: null
        });
        const data = await this.model.find(searchList, null, options);
        return data.map((d)=>d.toObject({
                virtuals: true
            }));
    }
    async findOneWithExcludeFields(filter, excludeProperties, options) {
        const exclude = excludeProperties.map((e)=>`-${e.toString()}`);
        const data = await this.model.findOne(filter, undefined, options).select(exclude.join(' '));
        if (!data) return null;
        return data.toObject({
            virtuals: true
        });
    }
    async findAllWithExcludeFields(excludeProperties, filter, options) {
        const exclude = excludeProperties.map((e)=>`-${e.toString()}`);
        filter = this.applyFilterWhenFilterParameterIsNotFirstOption(filter);
        const data = await this.model.find(filter, undefined, options).select(exclude.join(' '));
        return data.map((d)=>d.toObject({
                virtuals: true
            }));
    }
    async findOneWithSelectFields(filter, includeProperties, options) {
        const exclude = includeProperties.map((e)=>`${e.toString()}`);
        const data = await this.model.findOne(filter, undefined, options).select(exclude.join(' '));
        if (!data) return null;
        return data.toObject({
            virtuals: true
        });
    }
    async findAllWithSelectFields(includeProperties, filter, options) {
        const exclude = includeProperties.map((e)=>`${e.toString()}`);
        filter = this.applyFilterWhenFilterParameterIsNotFirstOption(filter);
        const data = await this.model.find(filter, undefined, options).select(exclude.join(' '));
        return data.map((d)=>d.toObject({
                virtuals: true
            }));
    }
    async seed(entityList) {
        try {
            const someHasNoID = entityList.some((e)=>!e.id);
            if (someHasNoID) {
                throw new _exception.ApiInternalServerException('seed id is required');
            }
            for (const model of entityList){
                const data = await this.findById(model.id);
                if (!data) {
                    await this.create(model);
                }
            }
        } catch (error) {
            console.error('MongoRepository:Error', error);
        }
    }
    applyFilterWhenFilterParameterIsNotFirstOption(filter) {
        if (!filter) {
            filter = {
                deletedAt: null
            };
        }
        if (filter?.id) {
            filter._id = filter.id;
            delete filter.id;
        }
        return filter;
    }
    constructor(model){
        this.model = model;
    }
};
_ts_decorate([
    (0, _convertmongoosefilterdecorator.ConvertMongoFilterToBaseRepository)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.FilterQuery === "undefined" ? Object : _mongoose.FilterQuery,
        typeof _mongoose.QueryOptions === "undefined" ? Object : _mongoose.QueryOptions
    ])
], MongoRepository.prototype, "find", null);
_ts_decorate([
    (0, _convertmongoosefilterdecorator.ConvertMongoFilterToBaseRepository)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.FilterQuery === "undefined" ? Object : _mongoose.FilterQuery,
        typeof _mongoose.QueryOptions === "undefined" ? Object : _mongoose.QueryOptions
    ])
], MongoRepository.prototype, "findOne", null);
_ts_decorate([
    (0, _convertmongoosefilterdecorator.ConvertMongoFilterToBaseRepository)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.FilterQuery === "undefined" ? Object : _mongoose.FilterQuery
    ])
], MongoRepository.prototype, "findAll", null);
_ts_decorate([
    (0, _convertmongoosefilterdecorator.ConvertMongoFilterToBaseRepository)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.FilterQuery === "undefined" ? Object : _mongoose.FilterQuery
    ])
], MongoRepository.prototype, "remove", null);
_ts_decorate([
    (0, _convertmongoosefilterdecorator.ConvertMongoFilterToBaseRepository)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.FilterQuery === "undefined" ? Object : _mongoose.FilterQuery,
        Object,
        typeof _mongoose.QueryOptions === "undefined" ? Object : _mongoose.QueryOptions
    ])
], MongoRepository.prototype, "updateOne", null);
_ts_decorate([
    (0, _convertmongoosefilterdecorator.ConvertMongoFilterToBaseRepository)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.FilterQuery === "undefined" ? Object : _mongoose.FilterQuery,
        Object,
        typeof _mongoose.QueryOptions === "undefined" ? Object : _mongoose.QueryOptions
    ])
], MongoRepository.prototype, "findOneAndUpdate", null);
_ts_decorate([
    (0, _convertmongoosefilterdecorator.ConvertMongoFilterToBaseRepository)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.FilterQuery === "undefined" ? Object : _mongoose.FilterQuery,
        Object,
        typeof _mongoose.QueryOptions === "undefined" ? Object : _mongoose.QueryOptions
    ])
], MongoRepository.prototype, "updateMany", null);
_ts_decorate([
    (0, _convertmongoosefilterdecorator.ConvertMongoFilterToBaseRepository)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.FilterQuery === "undefined" ? Object : _mongoose.FilterQuery,
        typeof Array === "undefined" ? Object : Array,
        typeof _mongoose.QueryOptions === "undefined" ? Object : _mongoose.QueryOptions
    ])
], MongoRepository.prototype, "findOneWithExcludeFields", null);
_ts_decorate([
    (0, _convertmongoosefilterdecorator.ConvertMongoFilterToBaseRepository)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _mongoose.FilterQuery === "undefined" ? Object : _mongoose.FilterQuery,
        typeof Array === "undefined" ? Object : Array,
        typeof _mongoose.QueryOptions === "undefined" ? Object : _mongoose.QueryOptions
    ])
], MongoRepository.prototype, "findOneWithSelectFields", null);

//# sourceMappingURL=repository.js.map