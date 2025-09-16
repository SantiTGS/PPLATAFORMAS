import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type RideDocument = HydratedDocument<Ride>;
export type RideStatus = 'pending' | 'accepted' | 'completed' | 'canceled';

@Schema({ collection: 'rides', timestamps: true })
export class Ride {
  @Prop({ required: true, trim: true }) origin: string;
  @Prop({ required: true, trim: true }) destination: string;
  @Prop({ required: true, min: 0 }) price: number;
  @Prop({ required: true, min: 1, default: 1 }) seats: number;
  @Prop({ type: String, enum: ['pending','accepted','completed','canceled'], default: 'pending' }) status: RideStatus;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: false, index: true })
  acceptedBy?: Types.ObjectId;
}
export const RideSchema = SchemaFactory.createForClass(Ride);
RideSchema.index({ status: 1, createdAt: -1 });
RideSchema.index({ origin: 1, destination: 1 });
