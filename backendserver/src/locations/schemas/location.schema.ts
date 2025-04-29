
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class City extends Document {
  @Prop({ required: true, unique: true })
  name: string;
}

export const CitySchema = SchemaFactory.createForClass(City);

@Schema()
export class Area extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  city: string;
}

export const AreaSchema = SchemaFactory.createForClass(Area);
