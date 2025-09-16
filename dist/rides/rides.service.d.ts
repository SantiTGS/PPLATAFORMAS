import { Ride } from './entities/ride.entity';
import { CreateRideDto } from './dto/create-ride.dto';
export declare class RidesService {
    private rides;
    private idSeq;
    findAll(): Ride[];
    findMine(userId: number): Ride[];
    create(dto: CreateRideDto, ownerId: number): Ride;
    accept(rideId: number): {
        ok: boolean;
        message: string;
        ride?: undefined;
    } | {
        ok: boolean;
        ride: Ride;
        message?: undefined;
    };
}
