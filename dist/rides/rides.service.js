"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidesService = void 0;
const common_1 = require("@nestjs/common");
let RidesService = class RidesService {
    constructor() {
        this.rides = [];
        this.idSeq = 1;
    }
    findAll() {
        return this.rides;
    }
    findMine(userId) {
        return this.rides.filter((r) => r.ownerId === userId);
    }
    create(dto, ownerId) {
        const r = { id: this.idSeq++, ownerId, ...dto };
        this.rides.push(r);
        return r;
    }
    accept(rideId) {
        const r = this.rides.find((x) => x.id === rideId);
        if (!r || r.seatsAvailable <= 0)
            return { ok: false, message: 'No seats' };
        r.seatsAvailable -= 1;
        return { ok: true, ride: r };
    }
};
exports.RidesService = RidesService;
exports.RidesService = RidesService = __decorate([
    (0, common_1.Injectable)()
], RidesService);
//# sourceMappingURL=rides.service.js.map