import { Role } from '../../common/roles.enum';
export declare class CreateUserDto {
    email: string;
    name: string;
    password: string;
    roles?: Role[];
}
