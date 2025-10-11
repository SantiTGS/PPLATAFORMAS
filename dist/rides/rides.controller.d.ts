import { RidesService } from './rides.service';
export declare class RidesController {
    private readonly rides;
    constructor(rides: RidesService);
    all(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/ride.schema").Ride, {}, {}> & import("./schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    mine(req: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/ride.schema").Ride, {}, {}> & import("./schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    create(dto: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("./schemas/ride.schema").Ride, {}, {}> & import("./schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("./schemas/ride.schema").Ride, {}, {}> & import("./schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    accept(id: string, req: any): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/ride.schema").Ride, {}, {}> & import("./schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
}
