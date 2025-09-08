import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Voter {
  @Prop({ required: true }) centerId: string;
  @Prop({ required: true }) station: string;    // e.g. "A" | "B"
  @Prop({ required: true }) fullName: string;
  @Prop({ required: true }) nationalId: string;

  @Prop({ default: false }) checkedIn: boolean;
  @Prop() checkedInAt?: Date;
  @Prop() checkedInBy?: string;

  // NEW: one-time prediction chosen at check-in (candidate _id)
  @Prop() predictedCandidateId?: string;
}
export type VoterDocument = HydratedDocument<Voter>;
export const VoterSchema = SchemaFactory.createForClass(Voter);
