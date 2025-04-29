
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from '../../doctors/schemas/doctor.schema';
import { ChatOllama } from '@langchain/community/chat_models/ollama';

@Injectable()
export class DoctorFinderAgent {
  private model: ChatOllama;

  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>
  ) {
    this.model = new ChatOllama({
      baseUrl: process.env.OLLAMA_BASE_URL,
      model: process.env.OLLAMA_MODEL,
    });
  }

  async findDoctors(specialty: string, location: string) {
    console.log(`Finding doctors with specialty: ${specialty} in location: ${location}`);
    
    const doctors = await this.doctorModel.find({
      specialty: new RegExp(specialty, 'i'),
      city: new RegExp(location, 'i'),
      available: true
    }).sort({ rating: -1 }).limit(5);

    return doctors;
  }

  async generateRecommendation(doctors: any[], symptoms: string): Promise<string> {
    if (doctors.length === 0) {
      return "I couldn't find any doctors matching your criteria at the moment.";
    }

    const doctorList = doctors.map(d => 
      `- ${d.name} (${d.specialty}), located in ${d.area}, ${d.city}. Rating: ${d.rating}/5`
    ).join('\n');

    const prompt = `Based on your symptoms (${symptoms}), I found these doctors who can help:\n\n${doctorList}\n\nWould you like to book an appointment with any of them?`;
    
    return prompt;
  }
}
