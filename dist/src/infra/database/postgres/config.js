"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const typeorm_1 = require("typeorm");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
const dataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DATABASE'),
    migrationsTableName: 'migrations_table',
    synchronize: configService.get('ENV').toLowerCase() !== 'prd',
    migrations: ['src/infra/database/postgres/migrations/*.ts'],
    entities: ['src/infra/database/postgres/schemas/*.ts']
});
exports.default = dataSource;
//# sourceMappingURL=config.js.map