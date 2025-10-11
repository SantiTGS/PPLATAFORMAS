import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
export declare class UsersController {
    private readonly users;
    constructor(users: UsersService);
    register(dto: CreateUserDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        id?: any;
        isNew: boolean;
        schema: import("mongoose").Schema;
        name: string;
        email: string;
        password?: string;
        roles: string[];
        active: boolean;
        __v: number;
    }>;
    all(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/user.schema").User, {}, {}> & import("../schemas/user.schema").User & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
}
