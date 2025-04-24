import { Injectable } from '@nestjs/common';
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { DoctorService } from '../doctor/doctor.service';
import { Model } from 'mongoose';
import { Symptom } from 'src/symptom/schemas/symptom.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor } from 'src/doctor/schemas/doctor.schema';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

@Injectable()
export class ChatbotService {
  private model: ChatOllama;

  constructor(
    @InjectModel(Symptom.name) private symptomModel: Model<Symptom>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    private doctorService: DoctorService
  ) {
    this.model = new ChatOllama({ model: 'llama3.2:1b' });
  }

  async getResponse(message: string): Promise<any> {
    try {
      const response = await this.model.call([
        new SystemMessage(
          `You are a medical assistant. Read the user's message and ONLY if it clearly contains a symptom or disease, reply in this strict JSON format:
        {
          "disease": "<most likely disease>",
          "specialty": "<type of doctor the patient should see>"
        }
        If there is NO clear symptom or disease, DO NOT reply in JSON. Just respond naturally in a helpful tone.`
        ),
        new HumanMessage(message),
      ]);

      let parsedResult: { disease: string; specialty: string } | null = null;

      try {
        const parsed = JSON.parse(response.content.toString().trim());

        if (
          typeof parsed === 'object' &&
          parsed.disease &&
          parsed.specialty &&
          typeof parsed.disease === 'string' &&
          typeof parsed.specialty === 'string'
        ) {
          parsedResult = {
            disease: parsed.disease.trim(),
            specialty: this.normalizeSpecialty(parsed.specialty.trim())
          };
        }
      } catch (_) {
        // Not JSON — natural language response
      }

      if (parsedResult) {
        const doctors = await this.doctorModel.find({
          specialty: { $regex: new RegExp(`^${parsedResult.specialty}$`, 'i') }
        });

        const doctorList = doctors.map(doc => ({
          name: doc.name,
          experience: doc.experience,
          rating: doc.rating ?? null
        }));

        return {
          message: `Based on your symptoms, the condition may be ${parsedResult.disease}. You should consult a ${parsedResult.specialty}${doctorList.length ? '.' : '. No doctors found.'}`,
          disease: parsedResult.disease,
          specialty: parsedResult.specialty,
          doctors: doctorList
        };
      }

      return {
        message: response.content,
        disease: null,
        specialty: null,
        doctors: []
      };

    } catch (error) {
      console.error('Error:', error);
      return {
        message: 'An error occurred while processing your request.',
        disease: null,
        specialty: null,
        doctors: []
      };
    }
  }

  private normalizeSpecialty(specialty: string): string {
    const specialtyMap: Record<string, string> = {
      "Cardiology": "Cardiologist",
      "Neurology": "Neurologist",
      "Dermatology": "Dermatologist",
      "Orthopedics": "Orthopedic",
      "Pediatrics": "Pediatrician",
      "Gastroenterology": "Gastroenterologist",
      "Endocrinology": "Endocrinologist",
      "Psychology": "Psychologist",
      "Psychiatry": "Psychiatrist"
    };
    return specialtyMap[specialty] || specialty;
  }

  private async findDoctorsForSpecialty(specialty: string) {
    return this.doctorModel.find({ specialty: new RegExp(`^${specialty}$`, 'i') });
  }
}
