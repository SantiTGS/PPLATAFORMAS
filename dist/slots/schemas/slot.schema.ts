import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SlotDocument = HydratedDocument<Slot>;

class Passenger {
  @Prop({ required: true })
  name: string;

  @Prop({ default: Date.now })
  joinedAt: Date;
}

@Schema({ timestamps: true, collection: 'slots' })
export class Slot {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driver: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  capacity: number;

  @Prop()
  date?: string;

  @Prop({ type: [Object], default: [] })
  passengers: Passenger[];
}

export const SlotSchema = SchemaFactory.createForClass(Slot);
