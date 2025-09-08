import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class LiveStats {
  @Prop({ required: true }) centerId: string;
  @Prop({ required: true }) station: string;  // station code
  @Prop({ required: true }) dateKey: string;  // e.g. "2025-05-12"

  // candidateId -> count
  @Prop({ type: Map, of: Number, default: {} })
  counts: Map<string, number>;

  @Prop({ default: 0 }) totalCheckins: number;
}
export type LiveStatsDocument = HydratedDocument<LiveStats>;
export const LiveStatsSchema = SchemaFactory.createForClass(LiveStats);
