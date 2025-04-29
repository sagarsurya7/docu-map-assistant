
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schemas/chat.schema';
import { ChatSession, ChatSessionSchema } from './schemas/chat-session.schema';
import { DoctorsModule } from '../doctors/doctors.module';
import { LocationsModule } from '../locations/locations.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: ChatSession.name, schema: ChatSessionSchema }
    ]),
    DoctorsModule,
    LocationsModule
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
