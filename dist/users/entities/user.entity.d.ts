import { Role } from '../../common/roles.enum';
export declare class User {
    id: number;
    email: string;
    name: string;
    passwordHash: string;
    roles: Role[];
}
