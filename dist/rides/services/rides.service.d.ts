import { Model, Types } from 'mongoose';
import { Ride, RideDocument } from '../schemas/ride.schema';
export declare class RidesService {
    private readonly rideModel;
    constructor(rideModel: Model<RideDocument>);
    create(user: any, dto: Partial<Ride>): Promise<import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: Types.ObjectId;
    }>>;
    findAll(): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    findMine(user: any): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>)[]>;
    accept(rideId: string, user: any): Promise<import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Ride, {}, {}> & Ride & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: Types.ObjectId;
    }>>;
}
