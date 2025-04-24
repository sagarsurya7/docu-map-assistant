
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Doctor extends Document {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  specialty: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  area: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  experience: number;

  @Prop({ type: [String], required: true })
  languages: string[];

  @Prop({ type: [String], required: true })
  education: string[];

  @Prop({ required: true })
  available: boolean;

  @Prop({ required: true })
  consultationFee: number;

  @Prop()
  imageUrl: string;

  @Prop()
  gender?: 'male' | 'female';

  @Prop()
  description?: string;

  @Prop({ type: Object })
  location?: {
    lat: number;
    lng: number;
  };

  @Prop({ type: Object })
  availability?: {
    [key: string]: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
