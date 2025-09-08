import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class PollingCenter {
  @Prop({ required: true }) name: string; // e.g. "Ramlieh Public School"
  @Prop({ required: true }) districtId: string; // link to your districts if you have them
  @Prop({ required: true }) address: string;
  @Prop({ type: [String], default: [] }) stations: string[]; // e.g. ["A","B","C"]
}
export type PollingCenterDocument = HydratedDocument<PollingCenter>;
export const PollingCenterSchema = SchemaFactory.createForClass(PollingCenter);
