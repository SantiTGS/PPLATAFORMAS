import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RidesController } from '../controllers/rides.controller';
import { RidesService } from '../services/rides.service';  // ← CORREGIDO
import { Ride, RideSchema } from '../schemas/ride.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }])],
  controllers: [RidesController],
  providers: [RidesService],
  exports: [RidesService],
})
export class RidesModule {}