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
exports.CatsCreateUsecase = exports.CatsCreateSchema = void 0;
const validate_schema_decorator_1 = require("../../../utils/decorators/validate-schema.decorator");
const cats_1 = require("./../entity/cats");
exports.CatsCreateSchema = cats_1.CatsEntitySchema.pick({
    name: true,
    breed: true,
    age: true
});
class CatsCreateUsecase {
    constructor(catsRepository) {
        this.catsRepository = catsRepository;
    }
    async execute(input, { tracing, user }) {
        const entity = new cats_1.CatsEntity(input);
        const cats = await this.catsRepository.create(entity);
        tracing.logEvent('cats-created', `cats created by: ${user.login}`);
        return cats;
    }
}
__decorate([
    (0, validate_schema_decorator_1.ValidateSchema)(exports.CatsCreateSchema),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CatsCreateUsecase.prototype, "execute", null);
exports.CatsCreateUsecase = CatsCreateUsecase;
//# sourceMappingURL=cats-create.js.map