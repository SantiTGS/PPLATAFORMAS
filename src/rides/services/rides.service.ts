import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Ride, RideDocument } from '../schemas/ride.schema';

function toObjectId(idLike: any): Types.ObjectId {
  const value = typeof idLike === 'string' ? idLike : (idLike?.id ?? idLike?._id ?? idLike?.sub ?? idLike);
  if (!value) throw new BadRequestException('User id missing');
  return new Types.ObjectId(String(value));
}

@Injectable()
export class RidesService {
  constructor(@InjectModel(Ride.name) private readonly rideModel: Model<RideDocument>) {}

  create(user: any, dto: Partial<Ride>) {
    const userId = toObjectId(user);
    return this.rideModel.create({
      origin: dto.origin, destination: dto.destination, price: dto.price,
      seats: dto.seats ?? 1, status: 'pending', createdBy: userId,
    });
  }

  findAll() {
    return this.rideModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  findMine(user: any) {
    const userId = toObjectId(user);
    return this.rideModel.find({ $or: [{ createdBy: userId }, { acceptedBy: userId }] })
      .sort({ createdAt: -1 }).lean().exec();
  }

  async accept(rideId: string, user: any) {
    if (!rideId) throw new BadRequestException('Ride id required');
    const userId = toObjectId(user);
    const updated = await this.rideModel.findOneAndUpdate(
      { _id: new Types.ObjectId(rideId), $or: [{ status: 'pending' }, { acceptedBy: { $exists: false } }] },
      { $set: { acceptedBy: userId, status: 'accepted' } },
      { new: true },
    ).lean();
    if (!updated) throw new NotFoundException('Ride not found or already accepted');
    return updated;
  }
}
