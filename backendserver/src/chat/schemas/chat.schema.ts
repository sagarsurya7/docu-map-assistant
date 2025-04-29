
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Chat extends Document {
  @Prop({ required: true })
  message: string;

  @Prop({ required: true })
  timestamp: Date;

  @Prop()
  location?: string;

  @Prop()
  symptoms?: string[];

  @Prop()
  specialty?: string;

  @Prop()
  response?: string;

  @Prop()
  sessionId?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
