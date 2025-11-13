import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RidesController } from '../controllers/rides.controller';
import { RidesService } from '../../rides/services/rides.service';
import { Ride, RideSchema } from '../schemas/ride.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }])],
  controllers: [RidesController],
  providers: [RidesService],
  exports: [RidesService],
})
export class RidesModule {}
