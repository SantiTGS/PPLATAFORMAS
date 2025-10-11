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
exports.RidesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const ride_schema_1 = require("../schemas/ride.schema");
function toObjectId(idLike) {
    var _a, _b, _c;
    const value = typeof idLike === 'string' ? idLike : ((_c = (_b = (_a = idLike === null || idLike === void 0 ? void 0 : idLike.id) !== null && _a !== void 0 ? _a : idLike === null || idLike === void 0 ? void 0 : idLike._id) !== null && _b !== void 0 ? _b : idLike === null || idLike === void 0 ? void 0 : idLike.sub) !== null && _c !== void 0 ? _c : idLike);
    if (!value)
        throw new common_1.BadRequestException('User id missing');
    return new mongoose_2.Types.ObjectId(String(value));
}
let RidesService = class RidesService {
    constructor(rideModel) {
        this.rideModel = rideModel;
    }
    create(user, dto) {
        var _a;
        const userId = toObjectId(user);
        return this.rideModel.create({
            origin: dto.origin, destination: dto.destination, price: dto.price,
            seats: (_a = dto.seats) !== null && _a !== void 0 ? _a : 1, status: 'pending', createdBy: userId,
        });
    }
    findAll() {
        return this.rideModel.find().sort({ createdAt: -1 }).lean().exec();
    }
    findMine(user) {
        const userId = toObjectId(user);
        return this.rideModel.find({ $or: [{ createdBy: userId }, { acceptedBy: userId }] })
            .sort({ createdAt: -1 }).lean().exec();
    }
    async accept(rideId, user) {
        if (!rideId)
            throw new common_1.BadRequestException('Ride id required');
        const userId = toObjectId(user);
        const updated = await this.rideModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(rideId), $or: [{ status: 'pending' }, { acceptedBy: { $exists: false } }] }, { $set: { acceptedBy: userId, status: 'accepted' } }, { new: true }).lean();
        if (!updated)
            throw new common_1.NotFoundException('Ride not found or already accepted');
        return updated;
    }
};
exports.RidesService = RidesService;
exports.RidesService = RidesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(ride_schema_1.Ride.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RidesService);
//# sourceMappingURL=rides.service.js.map