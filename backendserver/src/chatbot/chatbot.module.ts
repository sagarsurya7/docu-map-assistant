import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { DoctorModule } from 'src/doctor/doctor.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Symptom, SymptomSchema } from 'src/symptom/symptom.schema';
import { Doctor, DoctorSchema } from 'src/doctor/schemas/doctor.schema';


@Module({
  imports: [ MongooseModule.forFeature([
    { name: Symptom.name, schema: SymptomSchema },
    { name: Doctor.name, schema: DoctorSchema },
  ]),DoctorModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}