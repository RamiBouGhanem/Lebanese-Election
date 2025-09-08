import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Candidate extends Document {
  @Prop({ required: true })
  name: string;

  /**
   * Primary location key we filter on (what your data uses already).
   * Examples: "عاليه", "الشوف-عاليه", "بشري", "بيروت الثانية", ...
   */
  @Prop()
  area?: string;

  /**
   * Optional legacy/alternate field. We still store it for compatibility,
   * but filtering prefers `area`.
   */
  @Prop()
  district?: string;

  @Prop({ required: true })
  summary: string;

  @Prop()
  party?: string;

  @Prop()
  bio?: string;

  // public URL (S3) or local path (/uploads/xxx)
  @Prop()
  image?: string;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);

// Helpful indexes
CandidateSchema.index({ area: 1, name: 1 });
CandidateSchema.index({ district: 1, name: 1 });
