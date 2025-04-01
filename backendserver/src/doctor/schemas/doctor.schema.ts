import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Doctor extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialty: string;

  @Prop()
  experience: number;

  @Prop()
  rating: number;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);