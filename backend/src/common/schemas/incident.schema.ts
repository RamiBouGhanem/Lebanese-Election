import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Incident {
  @Prop({ required: true }) centerId: string;
  @Prop({ required: true }) station: string;
  @Prop({ required: true }) createdBy: string; // representative userId
  @Prop({ required: true, enum: ['Low', 'Medium', 'High'] }) severity: 'Low' | 'Medium' | 'High';
  @Prop({ required: true, enum: ['Security', 'Logistics', 'Technical', 'Other'] })
  category: 'Security' | 'Logistics' | 'Technical' | 'Other';
  @Prop({ required: true }) description: string;
  @Prop({ type: [String], default: [] }) photos?: string[];
}

export type IncidentDocument = HydratedDocument<Incident>;
export const IncidentSchema = SchemaFactory.createForClass(Incident);
