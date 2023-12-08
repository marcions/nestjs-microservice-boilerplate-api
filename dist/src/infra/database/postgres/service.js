"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresService = void 0;
const package_json_1 = require("../../../../package.json");
class PostgresService {
    getConnection({ URI }) {
        return {
            type: 'postgres',
            url: URI,
            database: package_json_1.name
        };
    }
}
exports.PostgresService = PostgresService;
//# sourceMappingURL=service.js.map