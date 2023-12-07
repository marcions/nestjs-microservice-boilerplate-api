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
exports.HttpLoggerInterceptor = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const logger_1 = require("../../infra/logger");
let HttpLoggerInterceptor = exports.HttpLoggerInterceptor = class HttpLoggerInterceptor {
    constructor(logger) {
        this.logger = logger;
    }
    intercept(executionContext, next) {
        var _a;
        const context = `${executionContext.getClass().name}/${executionContext.getHandler().name}`;
        const request = executionContext.switchToHttp().getRequest();
        const res = executionContext.switchToHttp().getResponse();
        request['context'] = context;
        if (!((_a = request.headers) === null || _a === void 0 ? void 0 : _a.traceid)) {
            request.headers.traceid = (0, uuid_1.v4)();
            request.id = request.headers.traceid;
        }
        this.logger.logger(request, res);
        return next.handle();
    }
};
exports.HttpLoggerInterceptor = HttpLoggerInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_1.ILoggerAdapter])
], HttpLoggerInterceptor);
//# sourceMappingURL=http-logger.interceptor.js.map