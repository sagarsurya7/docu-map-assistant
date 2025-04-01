import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Symptom extends Document {
  @Prop({ required: true })
  name: string;

  @Prop([String])
  conditions: string[];

  @Prop({ type: Map, of: String })
  doctorSpecialties: Map<string, string>;
}

export const SymptomSchema = SchemaFactory.createForClass(Symptom);