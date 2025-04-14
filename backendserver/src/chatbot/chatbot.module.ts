import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { DoctorModule } from 'src/doctor/doctor.module';


@Module({
  imports: [DoctorModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}