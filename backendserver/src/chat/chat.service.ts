
import { Injectable } from '@nestjs/common';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class ChatService {
  constructor(private readonly doctorsService: DoctorsService) {}

  // This is a placeholder that will be replaced with actual AI integration later
  async processMessage(message: string): Promise<{ response: string }> {
    message = message.toLowerCase();
    
    // Simple pattern matching for now
    if (message.includes('hello') || message.includes('hi')) {
      return { response: "Hello! I'm your AI health assistant. How can I help you today?" };
    }
    
    if (message.includes('doctor') || message.includes('specialist')) {
      const doctors = await this.doctorsService.findAll({ available: true });
      if (doctors.length === 0) {
        return { response: "I couldn't find any doctors at the moment." };
      }
      
      const doctor = doctors[0]; // Just get the first one for now
      return { 
        response: `I recommend consulting Dr. ${doctor.name}, a ${doctor.specialty} specialist with ${doctor.experience} years of experience. Would you like to know more about them?` 
      };
    }
    
    if (message.includes('symptom') || message.includes('pain') || message.includes('sick')) {
      return { 
        response: "I'm sorry to hear that. Could you please describe your symptoms in more detail? This will help me provide better assistance." 
      };
    }
    
    // Default response
    return { 
      response: "I understand you're looking for health information. Could you provide more details about what you need help with?" 
    };
  }
}
