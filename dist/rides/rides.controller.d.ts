import { RidesService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';
export declare class RidesController {
    private readonly rides;
    constructor(rides: RidesService);
    all(): import("./entities/ride.entity").Ride[];
    mine(req: any): import("./entities/ride.entity").Ride[];
    create(dto: CreateRideDto, req: any): import("./entities/ride.entity").Ride;
    accept(id: number): {
        ok: boolean;
        message: string;
        ride?: undefined;
    } | {
        ok: boolean;
        ride: import("./entities/ride.entity").Ride;
        message?: undefined;
    };
}
