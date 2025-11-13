import { Model, Types } from 'mongoose';
import { Ride, RideDocument } from '../schemas/ride.schema';
import { CreateRideDto } from '../dto/create-ride.dto';
export declare class RidesService {
    private readonly rideModel;
    constructor(rideModel: Model<RideDocument>);
    create(user: any, dto: CreateRideDto): Promise<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findMyRides(user: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findMyBookings(user: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    bookRide(rideId: string, user: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    cancelBooking(rideId: string, user: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    completeRide(rideId: string, user: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>) | null>;
    cancelRide(rideId: string, user: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>) | null>;
}
