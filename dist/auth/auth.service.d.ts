import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/services/users.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly users;
    private readonly jwt;
    constructor(users: UsersService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: string;
            roles: any;
        };
    }>;
    login(email: string, password: string): Promise<{
        access_token: string;
        user: {
            id: any;
            name: any;
            email: string;
            roles: any;
        };
    }>;
}
