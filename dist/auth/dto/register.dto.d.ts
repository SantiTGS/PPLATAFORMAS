import { Role } from '../../common/roles.enum';
export declare class RegisterDto {
    name: string;
    email: string;
    password: string;
    roles?: Role[];
}
