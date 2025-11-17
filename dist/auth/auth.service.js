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
        const userRoles = user.roles || [];
        const userRole = userRoles[0] || 'passenger';
        const payload = {
            sub: userId,
            email: user.email,
            roles: userRoles
        };
        const access_token = await this.jwt.signAsync(payload);
        return {
            access_token,
            user: {
                _id: userId,
                name: user.name,
                email: user.email,
                role: userRole,
            },
        };
    }
    async login(loginDto) {
        var _a, _b, _c;
        if (!loginDto || !loginDto.email || !loginDto.password) {
            throw new common_1.UnauthorizedException('Email y contraseña son requeridos');
        }
        const user = await this.users.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const stored = (_a = user.passwordHash) !== null && _a !== void 0 ? _a : user.password;
        if (!stored) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        let ok = false;
        if (typeof stored === 'string' && stored.startsWith('$2')) {
            if (!loginDto.password) {
                throw new common_1.UnauthorizedException('Credenciales inválidas');
            }
            ok = await bcrypt.compare(loginDto.password, stored);
        }
        else {
            ok = stored === loginDto.password;
        }
        if (!ok) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const userId = ((_b = user._id) === null || _b === void 0 ? void 0 : _b.toString()) || user.id;
        const userRoles = (_c = user.roles) !== null && _c !== void 0 ? _c : [];
        const userRole = userRoles[0] || 'passenger';
        const payload = {
            sub: userId,
            email: user.email,
            roles: userRoles
        };
        const access_token = await this.jwt.signAsync(payload);
        const safeUser = {
            _id: userId,
            name: user.name,
            email: user.email,
            role: userRole,
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