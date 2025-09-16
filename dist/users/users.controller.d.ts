import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../common/roles.enum';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    register(dto: CreateUserDto): Promise<{
        id: number;
        email: string;
        name: string;
        roles: Role[];
    }>;
    all(): Promise<Omit<import("./entities/user.entity").User, "passwordHash">[]>;
}
