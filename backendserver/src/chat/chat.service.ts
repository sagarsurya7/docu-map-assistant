
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorsService } from '../doctors/doctors.service';
import { Chat } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private readonly doctorsService: DoctorsService
  ) {}

  async processMessage(message: string): Promise<{ response: string }> {
    const response = await this.generateResponse(message);
    
    // Save the chat interaction
    await this.chatModel.create({
      message,
      response: response.response,
      timestamp: new Date()
    });

    return response;
  }

  private async generateResponse(message: string): Promise<{ response: string }> {
    message = message.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return { response: "Hello! I'm your AI health assistant. How can I help you today?" };
    }
    
    if (message.includes('doctor') || message.includes('specialist')) {
      const doctors = await this.doctorsService.findAll({ available: true });
      if (doctors.length === 0) {
        return { response: "I couldn't find any doctors at the moment." };
      }
      
      const doctor = doctors[0];
      return { 
        response: `I recommend consulting Dr. ${doctor.name}, a ${doctor.specialty} specialist with ${doctor.experience} years of experience. Would you like to know more about them?` 
      };
    }
    
    if (message.includes('symptom') || message.includes('pain') || message.includes('sick')) {
      return { 
        response: "I'm sorry to hear that. Could you please describe your symptoms in more detail? This will help me provide better assistance." 
      };
    }
    
    return { 
      response: "I understand you're looking for health information. Could you provide more details about what you need help with?" 
    };
  }

  async getChatHistory(): Promise<Chat[]> {
    return this.chatModel.find().sort({ timestamp: -1 }).exec();
  }
}
