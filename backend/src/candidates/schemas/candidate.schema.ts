import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Candidate extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  area: string;

  @Prop({ required: true })
  summary: string;

  @Prop()
  party?: string;

  @Prop()
  bio?: string;

  @Prop()
  image?: string;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);
