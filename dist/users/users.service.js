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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
        (async () => {
            const email = 'admin@demo.com';
            const exists = await this.findByEmail(email);
            if (!exists) {
                await this.create({
                    email,
                    name: 'Admin',
                    password: 'admin123',
                    roles: ['admin'],
                    active: true,
                });
            }
        })();
    }
    async create(data) {
        var _a, _b;
        try {
            const doc = await this.userModel.create({
                name: data.name,
                email: data.email,
                password: data.password,
                roles: (_a = data.roles) !== null && _a !== void 0 ? _a : [],
                active: (_b = data.active) !== null && _b !== void 0 ? _b : true,
            });
            return doc.toObject();
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.code) === 11000) {
                throw new common_1.ConflictException('Email ya existe');
            }
            throw err;
        }
    }
    async findAll() {
        return this.userModel.find().lean().exec();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email: email.toLowerCase().trim() }).lean().exec();
    }
    async findById(id) {
        return this.userModel.findById(id).lean().exec();
    }
    async update(id, patch) {
        const doc = await this.userModel
            .findByIdAndUpdate(id, {
            $set: {
                ...(patch.name !== undefined ? { name: patch.name } : {}),
                ...(patch.email !== undefined ? { email: patch.email } : {}),
                ...(patch.password !== undefined ? { password: patch.password } : {}),
                ...(patch.passwordHash !== undefined ? { passwordHash: patch.passwordHash } : {}),
                ...(patch.roles !== undefined ? { roles: patch.roles } : {}),
                ...(patch.active !== undefined ? { active: patch.active } : {}),
            },
        }, { new: true, runValidators: true })
            .lean()
            .exec();
        return doc;
    }
    async remove(id) {
        const res = await this.userModel.findByIdAndDelete(id).lean().exec();
        return res;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map