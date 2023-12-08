"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const repository_1 = require("../../infra/repository/postgres/repository");
const validate_typeorm_filter_decorator_1 = require("../../utils/decorators/database/postgres/validate-typeorm-filter.decorator");
const validate_database_sort_allowed_decorator_1 = require("../../utils/decorators/database/validate-database-sort-allowed.decorator");
const types_1 = require("../../utils/decorators/types");
const pagination_1 = require("../../utils/pagination");
let CatsRepository = class CatsRepository extends repository_1.PostgresRepository {
    constructor(repository) {
        super(repository);
        this.repository = repository;
    }
    async paginate(input) {
        const skip = (0, pagination_1.calucaleSkip)(input);
        const [docs, total] = await this.repository.findAndCount({
            take: input.limit,
            skip,
            order: input.sort,
            where: input.search
        });
        return { docs, total, page: input.page, limit: input.limit };
    }
};
__decorate([
    (0, validate_database_sort_allowed_decorator_1.ValidateDatabaseSortAllowed)('createdAt', 'breed'),
    (0, validate_typeorm_filter_decorator_1.ValidatePostgresFilter)([
        { name: 'name', type: types_1.SearchTypeEnum.like },
        { name: 'breed', type: types_1.SearchTypeEnum.like },
        { name: 'age', type: types_1.SearchTypeEnum.equal }
    ]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatsRepository.prototype, "paginate", null);
CatsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], CatsRepository);
exports.CatsRepository = CatsRepository;
//# sourceMappingURL=repository.js.map