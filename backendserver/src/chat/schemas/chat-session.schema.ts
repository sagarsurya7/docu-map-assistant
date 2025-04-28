
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatSession extends Document {
  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: false })
  city: string;
  
  @Prop({ required: false })
  area: string;

  @Prop({ default: Date.now })
  lastUpdated: Date;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);
