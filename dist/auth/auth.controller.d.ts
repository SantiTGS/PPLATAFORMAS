import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            _id: any;
            name: any;
            email: string;
            role: any;
        };
    }>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
        user: {
            _id: any;
            name: any;
            email: string;
            role: any;
        };
    }>;
}
