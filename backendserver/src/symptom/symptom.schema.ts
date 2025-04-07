import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SymptomDocument = Symptom & Document;

@Schema()
export class Symptom {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  severity: number;

  @Prop({ type: [String], default: [] })
  conditions: string[];

  @Prop({ type: [String], default: [] })
  doctorSpecialties: string[];

  @Prop({ type: [String], default: [] })
  associatedConditions: string[];
}

export const SymptomSchema = SchemaFactory.createForClass(Symptom); 