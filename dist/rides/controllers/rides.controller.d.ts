import { RidesService } from '../services/rides.service';
import { CreateRideDto } from '../dto/create-ride.dto';
import { BookRideDto } from '../dto/book-ride.dto';
export declare class RidesController {
    private readonly rides;
    constructor(rides: RidesService);
    findAll(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    myRides(req: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    myBookings(req: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    findOne(id: string): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>>;
    create(dto: CreateRideDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    book(id: string, bookRideDto: BookRideDto, req: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    cancelBooking(id: string, req: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    start(id: string, req: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    complete(id: string, req: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    cancel(id: string, req: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("../schemas/ride.schema").Ride, {}, {}> & import("../schemas/ride.schema").Ride & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>) | null>;
    delete(id: string, req: any): Promise<{
        message: string;
        id: string;
    }>;
}
