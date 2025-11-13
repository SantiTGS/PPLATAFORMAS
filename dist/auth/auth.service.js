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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/services/users.service");
let AuthService = class AuthService {
    constructor(users, jwt) {
        this.users = users;
        this.jwt = jwt;
    }
    async register(dto) {
        var _a;
        const existing = await this.users.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('El email ya está registrado');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.users.create({
            name: dto.name,
            email: dto.email,
            passwordHash,
            roles: dto.roles || ['passenger'],
            active: true,
        });
        const userId = ((_a = user._id) === null || _a === void 0 ? void 0 : _a.toString()) || user.id;
        const payload = {
            sub: userId,
            email: user.email,
            roles: user.roles
        };
        const access_token = await this.jwt.signAsync(payload);
        return {
            access_token,
            user: {
                id: userId,
                name: user.name,
                email: user.email,
                roles: user.roles,
            },
        };
    }
    async login(email, password) {
        var _a, _b, _c, _d;
        const user = await this.users.findByEmail(email);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const stored = (_a = user.passwordHash) !== null && _a !== void 0 ? _a : user.password;
        if (!stored) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        let ok = false;
        if (typeof stored === 'string' && stored.startsWith('$2')) {
            ok = await bcrypt.compare(password, stored);
        }
        else {
            ok = stored === password;
        }
        if (!ok) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const userId = ((_b = user._id) === null || _b === void 0 ? void 0 : _b.toString()) || user.id;
        const payload = {
            sub: userId,
            email: user.email,
            roles: (_c = user.roles) !== null && _c !== void 0 ? _c : []
        };
        const access_token = await this.jwt.signAsync(payload);
        const safeUser = {
            id: userId,
            name: user.name,
            email: user.email,
            roles: (_d = user.roles) !== null && _d !== void 0 ? _d : [],
        };
        return { access_token, user: safeUser };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map