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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
const roles_enum_1 = require("../common/roles.enum");
let UsersService = class UsersService {
    constructor() {
        this.users = [];
        this.idSeq = 1;
        (async () => {
            if (!(await this.findByEmail('admin@demo.com'))) {
                await this.create({
                    email: 'admin@demo.com',
                    name: 'Admin',
                    password: 'admin123',
                    roles: [roles_enum_1.Role.Admin],
                });
            }
        })();
    }
    async create(dto) {
        var _a;
        const u = new user_entity_1.User();
        u.id = this.idSeq++;
        u.email = dto.email.toLowerCase();
        u.name = dto.name;
        u.passwordHash = await bcrypt.hash(dto.password, 10);
        u.roles = ((_a = dto.roles) === null || _a === void 0 ? void 0 : _a.length) ? dto.roles : [roles_enum_1.Role.User];
        this.users.push(u);
        return u;
    }
    async findByEmail(email) {
        return this.users.find((u) => u.email === email.toLowerCase());
    }
    async findAll() {
        return this.users.map(({ passwordHash, ...rest }) => rest);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], UsersService);
//# sourceMappingURL=users.service.js.map