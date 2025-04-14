import { Injectable } from '@nestjs/common';
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { DoctorService } from '../doctor/doctor.service'; // adjust path as needed

@Injectable()
export class ChatbotService {
  private model: ChatOllama;

  constructor(private doctorService: DoctorService) {
    this.model = new ChatOllama({
      model: 'llama3.2:1b',
    });
  }

  async getResponse(message: string): Promise<string> {
    try {
      // List of known specialties (could be pulled from DB too)
      const specialties = ['cardiologist', 'neurologist', 'dermatologist', 'orthopedic', 'pediatrician'];

      // Check if message contains any specialty
      const matchedSpecialty = specialties.find(specialty =>
        message.toLowerCase().includes(specialty.toLowerCase())
      );
       console.log("matchedSpecialty",matchedSpecialty)
      if (matchedSpecialty) {
        console.log("matchedSpecialty",matchedSpecialty)
        const doctors = await this.doctorService.findBySpecialties([matchedSpecialty]);
        if (doctors.length === 0) {
          return `No doctors found for specialty: ${matchedSpecialty}`;
        }

        const doctorList = doctors.map(doc => 
          `Name: ${doc.name}, Experience: ${doc.experience} years, Rating: ${doc.rating ?? 'N/A'}`
        ).join('; '); // or use ', ' if you prefer
        

        return `Here are some ${matchedSpecialty}s:${doctorList}`;
      }

      // Default to LLM response
      const response = await this.model.invoke(message);
      console.log("res123", response);

      if (response && typeof response === 'object' && 'content' in response) {
        if (typeof response.content === 'string') {
          return response.content;
        } else if (Array.isArray(response.content)) {
          return response.content.map(item => (typeof item === 'string' ? item : JSON.stringify(item))).join(' ');
        }
      }

      return 'I could not understand that.';
    } catch (error) {
      console.error('Error communicating with Ollama or fetching doctors:', error);
      return 'There was an error processing your request.';
    }
  }
}
