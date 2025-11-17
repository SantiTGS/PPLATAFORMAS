import { HydratedDocument, Types } from 'mongoose';
export type RideDocument = HydratedDocument<Ride>;
export type RideStatus = 'pending' | 'accepted' | 'completed' | 'canceled';
export declare class Ride {
    origin: string;
    destination: string;
    date?: string;
    time?: string;
    price: number;
    seats: number;
    availableSeats: number;
    description?: string;
    status: RideStatus;
    createdBy: Types.ObjectId;
    passengers: Types.ObjectId[];
}
export declare const RideSchema: import("mongoose").Schema<Ride, import("mongoose").Model<Ride, any, any, any, import("mongoose").Document<unknown, any, Ride, any, {}> & Ride & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Ride, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Ride>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Ride> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
