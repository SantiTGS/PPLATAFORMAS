import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Slot, SlotDocument } from './schemas/slot.schema';

function toObjectId(user: any) {
  const value = typeof user === 'string' ? user : (user?.sub ?? user?.id ?? user?._id ?? user);
  if (!value) throw new BadRequestException('User id missing');
  return new Types.ObjectId(String(value));
}

@Injectable()
export class SlotsService {
  constructor(@InjectModel(Slot.name) private readonly slotModel: Model<SlotDocument>) {}

  create(user: any, dto: Partial<Slot>) {
    const driverId = toObjectId(user);
    return this.slotModel.create({
      driver: driverId,
      title: dto.title,
      capacity: dto.capacity ?? 1,
      date: dto.date,
      passengers: [],
    });
  }

  findAll() {
    return this.slotModel.find().sort({ createdAt: -1 }).lean().exec();
  }

  async join(slotId: string, name: string) {
    const slot = await this.slotModel.findById(slotId).exec();
    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.passengers.length >= slot.capacity) throw new BadRequestException('Slot full');
    slot.passengers.push({ name, joinedAt: new Date() } as any);
    await slot.save();
    return slot.toObject();
  }

  async removePassenger(slotId: string, passengerIndex: number, user: any) {
    const slot = await this.slotModel.findById(slotId).exec();
    if (!slot) throw new NotFoundException('Slot not found');
    const userId = toObjectId(user);
    if (!slot.driver.equals(userId)) throw new ForbiddenException('Not the owner');
    if (passengerIndex < 0 || passengerIndex >= slot.passengers.length) throw new NotFoundException('Passenger not found');
    const removed = slot.passengers.splice(passengerIndex,1)[0];
    await slot.save();
    return removed;
  }

  async removeSlot(slotId: string, user: any) {
    const slot = await this.slotModel.findById(slotId).exec();
    if (!slot) throw new NotFoundException('Slot not found');
    const userId = toObjectId(user);
    if (!slot.driver.equals(userId)) throw new ForbiddenException('Not the owner');
    await this.slotModel.deleteOne({ _id: slot._id }).exec();
    return { deleted: true };
  }
}
