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
exports.RideSchema = exports.Ride = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../users/schemas/user.schema");
let Ride = class Ride {
};
exports.Ride = Ride;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Ride.prototype, "origin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Ride.prototype, "destination", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Ride.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, default: 1 }),
    __metadata("design:type", Number)
], Ride.prototype, "seats", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ['pending', 'accepted', 'completed', 'canceled'], default: 'pending' }),
    __metadata("design:type", String)
], Ride.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Ride.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: user_schema_1.User.name, required: false, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Ride.prototype, "acceptedBy", void 0);
exports.Ride = Ride = __decorate([
    (0, mongoose_1.Schema)({ collection: 'rides', timestamps: true })
], Ride);
exports.RideSchema = mongoose_1.SchemaFactory.createForClass(Ride);
exports.RideSchema.index({ status: 1, createdAt: -1 });
exports.RideSchema.index({ origin: 1, destination: 1 });
//# sourceMappingURL=ride.schema.js.map