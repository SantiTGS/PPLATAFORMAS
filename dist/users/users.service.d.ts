import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
export declare class UsersService {
    private users;
    private idSeq;
    constructor();
    create(dto: CreateUserDto): Promise<User>;
    findByEmail(email: string): Promise<User | undefined>;
    findAll(): Promise<Omit<User, 'passwordHash'>[]>;
}
