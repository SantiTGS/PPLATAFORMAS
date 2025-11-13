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
    const value = typeof idLike === 'string'
        ? idLike
        : ((_c = (_b = (_a = idLike === null || idLike === void 0 ? void 0 : idLike.id) !== null && _a !== void 0 ? _a : idLike === null || idLike === void 0 ? void 0 : idLike._id) !== null && _b !== void 0 ? _b : idLike === null || idLike === void 0 ? void 0 : idLike.sub) !== null && _c !== void 0 ? _c : idLike);
    if (!value)
        throw new common_1.BadRequestException('ID de usuario faltante');
    return new mongoose_2.Types.ObjectId(String(value));
}
let RidesService = class RidesService {
    constructor(rideModel) {
        this.rideModel = rideModel;
    }
    async create(user, dto) {
        var _a, _b;
        const userId = toObjectId(user);
        const ride = await this.rideModel.create({
            origin: dto.origin,
            destination: dto.destination,
            price: dto.price,
            seats: (_a = dto.seats) !== null && _a !== void 0 ? _a : 1,
            availableSeats: (_b = dto.seats) !== null && _b !== void 0 ? _b : 1,
            description: dto.description,
            status: 'pending',
            createdBy: userId,
            passengers: [],
        });
        return ride.toObject();
    }
    async findAll() {
        return this.rideModel
            .find({ status: 'pending', availableSeats: { $gt: 0 } })
            .populate('createdBy', 'name email')
            .populate('passengers', 'name email')
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }
    async findMyRides(user) {
        const userId = toObjectId(user);
        return this.rideModel
            .find({ createdBy: userId })
            .populate('passengers', 'name email')
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }
    async findMyBookings(user) {
        const userId = toObjectId(user);
        return this.rideModel
            .find({ passengers: userId })
            .populate('createdBy', 'name email')
            .populate('passengers', 'name email')
            .sort({ createdAt: -1 })
            .lean()
            .exec();
    }
    async bookRide(rideId, user) {
        if (!rideId)
            throw new common_1.BadRequestException('ID de ride requerido');
        const userId = toObjectId(user);
        const ride = await this.rideModel.findById(rideId);
        if (!ride) {
            throw new common_1.NotFoundException('Ride no encontrado');
        }
        if (ride.createdBy.toString() === userId.toString()) {
            throw new common_1.ForbiddenException('No puedes reservar tu propio ride');
        }
        if (ride.status !== 'pending') {
            throw new common_1.BadRequestException('Este ride no está disponible');
        }
        if (ride.availableSeats <= 0) {
            throw new common_1.BadRequestException('No hay cupos disponibles');
        }
        if (ride.passengers.some(p => p.toString() === userId.toString())) {
            throw new common_1.BadRequestException('Ya has reservado este ride');
        }
        ride.passengers.push(userId);
        ride.availableSeats -= 1;
        if (ride.availableSeats === 0) {
            ride.status = 'accepted';
        }
        await ride.save();
        const updated = await this.rideModel
            .findById(ride._id)
            .populate('createdBy', 'name email')
            .populate('passengers', 'name email')
            .lean()
            .exec();
        return updated;
    }
    async cancelBooking(rideId, user) {
        const userId = toObjectId(user);
        const ride = await this.rideModel.findById(rideId);
        if (!ride) {
            throw new common_1.NotFoundException('Ride no encontrado');
        }
        const passengerIndex = ride.passengers.findIndex(p => p.toString() === userId.toString());
        if (passengerIndex === -1) {
            throw new common_1.BadRequestException('No tienes una reserva en este ride');
        }
        ride.passengers.splice(passengerIndex, 1);
        ride.availableSeats += 1;
        if (ride.status === 'accepted' && ride.availableSeats > 0) {
            ride.status = 'pending';
        }
        await ride.save();
        const updated = await this.rideModel
            .findById(ride._id)
            .populate('createdBy', 'name email')
            .populate('passengers', 'name email')
            .lean()
            .exec();
        return updated;
    }
    async completeRide(rideId, user) {
        const userId = toObjectId(user);
        const ride = await this.rideModel.findById(rideId);
        if (!ride) {
            throw new common_1.NotFoundException('Ride no encontrado');
        }
        if (ride.createdBy.toString() !== userId.toString()) {
            throw new common_1.ForbiddenException('Solo el conductor puede completar el ride');
        }
        ride.status = 'completed';
        await ride.save();
        const updated = await this.rideModel
            .findById(ride._id)
            .populate('createdBy', 'name email')
            .populate('passengers', 'name email')
            .lean()
            .exec();
        return updated;
    }
    async cancelRide(rideId, user) {
        const userId = toObjectId(user);
        const ride = await this.rideModel.findById(rideId);
        if (!ride) {
            throw new common_1.NotFoundException('Ride no encontrado');
        }
        if (ride.createdBy.toString() !== userId.toString()) {
            throw new common_1.ForbiddenException('Solo el conductor puede cancelar el ride');
        }
        ride.status = 'canceled';
        await ride.save();
        const updated = await this.rideModel
            .findById(ride._id)
            .populate('createdBy', 'name email')
            .populate('passengers', 'name email')
            .lean()
            .exec();
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