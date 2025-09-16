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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidesController = void 0;
const common_1 = require("@nestjs/common");
const rides_service_1 = require("./rides.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_ride_dto_1 = require("./dto/create-ride.dto");
let RidesController = class RidesController {
    constructor(rides) {
        this.rides = rides;
    }
    all() {
        return this.rides.findAll();
    }
    mine(req) {
        return this.rides.findMine(req.user.sub);
    }
    create(dto, req) {
        return this.rides.create(dto, req.user.sub);
    }
    accept(id) {
        return this.rides.accept(id);
    }
};
exports.RidesController = RidesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "all", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "mine", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ride_dto_1.CreateRideDto, Object]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/accept'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], RidesController.prototype, "accept", null);
exports.RidesController = RidesController = __decorate([
    (0, common_1.Controller)('rides'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [rides_service_1.RidesService])
], RidesController);
//# sourceMappingURL=rides.controller.js.map