"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const secrets_1 = require("../../secrets");
const service_1 = require("./service");
let PostgresDatabaseModule = class PostgresDatabaseModule {
};
PostgresDatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: ({ POSTGRES_URL, ENV }) => {
                    const conn = new service_1.PostgresService().getConnection({ URI: POSTGRES_URL });
                    return Object.assign(Object.assign({}, conn), { timeout: 5000, connectTimeout: 5000, logging: ENV === 'DEV', autoLoadEntities: true, synchronize: true, migrationsTableName: 'migration_collection' });
                },
                async dataSourceFactory(options) {
                    return new typeorm_2.DataSource(options);
                },
                imports: [secrets_1.SecretsModule],
                inject: [secrets_1.ISecretsAdapter]
            })
        ]
    })
], PostgresDatabaseModule);
exports.PostgresDatabaseModule = PostgresDatabaseModule;
//# sourceMappingURL=module.js.map