
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
    
    // Check for greetings
    if (message.includes('hello') || message.includes('hi')) {
      return { response: "Hello! I'm your AI health assistant. How can I help you today?" };
    }
    
    // Location inquiry for better doctor recommendations
    if (this.isLocationInquiry(message)) {
      return { response: "To provide you with the most relevant doctor recommendations, could you please share your city or area?" };
    }

    // Check for location information to save for future use
    const locationInfo = this.extractLocation(message);
    
    // Check for doctors or specialists requests
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
    
    // Check for specific symptoms
    const symptoms = this.extractSymptoms(message);
    if (symptoms.length > 0) {
      const specialties = this.mapSymptomsToSpecialties(symptoms);
      
      if (specialties.length > 0) {
        // Ask for location if not provided yet
        if (!locationInfo) {
          return { 
            response: `I notice you mentioned ${symptoms.join(', ')}. To suggest doctors in your area, could you please let me know which city you're located in?` 
          };
        }
        
        // Modified - Now we'll fetch doctors for each specialty individually and combine the results
        let allDoctors = [];
        
        // Fetch doctors for each specialty and combine results
        for (const specialty of specialties) {
          const doctorsForSpecialty = await this.doctorsService.findAll({ 
            specialty: specialty,
            available: true 
          });
          
          allDoctors = [...allDoctors, ...doctorsForSpecialty];
        }
        
        // Remove duplicates (if any)
        const uniqueDoctorsMap = new Map();
        allDoctors.forEach(doctor => {
          if (!uniqueDoctorsMap.has(doctor.id)) {
            uniqueDoctorsMap.set(doctor.id, doctor);
          }
        });
        
        const uniqueDoctors = Array.from(uniqueDoctorsMap.values());
        
        return {
          response: this.generateSymptomResponse(symptoms, specialties, uniqueDoctors)
        };
      }
      
      return { 
        response: `I notice you mentioned ${symptoms.join(', ')}. Could you tell me more about your symptoms? For example, when did they start and how severe are they? Also, which city are you located in so I can suggest appropriate doctors?` 
      };
    }
    
    // General symptom inquiries
    if (message.includes('symptom') || message.includes('pain') || message.includes('sick') || 
        message.includes('hurt') || message.includes('ache')) {
      return { 
        response: "I'm sorry to hear that you're not feeling well. Could you please describe your symptoms in more detail? This will help me provide better assistance. Additionally, it would help if you share your location so I can recommend nearby doctors." 
      };
    }
    
    return { 
      response: "I understand you're looking for health information. Could you provide more details about what you need help with?" 
    };
  }
  
  private isLocationInquiry(message: string): boolean {
    const locationPatterns = [
      'where', 'location', 'city', 'area', 'near me', 'nearby', 'closest'
    ];
    
    return locationPatterns.some(pattern => message.includes(pattern));
  }
  
  private extractLocation(message: string): string | null {
    // Common Indian cities
    const cities = [
      'mumbai', 'delhi', 'bangalore', 'pune', 'hyderabad', 'chennai', 
      'kolkata', 'ahmedabad', 'jaipur', 'surat', 'lucknow', 'kanpur',
      'nagpur', 'indore', 'thane', 'bhopal'
    ];
    
    for (const city of cities) {
      if (message.includes(city)) {
        return city;
      }
    }
    
    return null;
  }
  
  private extractSymptoms(message: string): string[] {
    const commonSymptoms = {
      'headache': ['headache', 'head ache', 'head pain', 'migraine'],
      'fever': ['fever', 'high temperature', 'feeling hot', 'temperature'],
      'cough': ['cough', 'coughing', 'chest cough', 'dry cough'],
      'sore throat': ['sore throat', 'throat pain', 'throat is hurting'],
      'runny nose': ['runny nose', 'stuffy nose', 'nasal congestion'],
      'fatigue': ['fatigue', 'tired', 'exhausted', 'no energy', 'tiredness'],
      'chest pain': ['chest pain', 'pain in chest', 'chest discomfort'],
      'back pain': ['back pain', 'pain in back', 'backache'],
      'stomach pain': ['stomach pain', 'abdominal pain', 'tummy ache', 'abdomen pain'],
      'nausea': ['nausea', 'feeling sick', 'want to vomit', 'queasy'],
      'dizziness': ['dizziness', 'dizzy', 'vertigo', 'lightheaded']
    };
    
    const foundSymptoms = [];
    
    // Check for each symptom and its variations
    for (const [symptom, variations] of Object.entries(commonSymptoms)) {
      if (variations.some(variation => message.includes(variation))) {
        foundSymptoms.push(symptom);
      }
    }
    
    return foundSymptoms;
  }
  
  private mapSymptomsToSpecialties(symptoms: string[]): string[] {
    // Updated mapping to be more accurate for symptoms
    const symptomToSpecialty = {
      'headache': ['Neurology', 'General Medicine'], // Removed Cardiology
      'fever': ['General Medicine', 'Infectious Disease'],
      'cough': ['Pulmonology', 'General Medicine', 'ENT (Ear, Nose, Throat)'],
      'sore throat': ['ENT (Ear, Nose, Throat)', 'General Medicine'],
      'runny nose': ['ENT (Ear, Nose, Throat)', 'Allergy and Immunology'],
      'fatigue': ['General Medicine', 'Endocrinology', 'Hematology'],
      'chest pain': ['Cardiology', 'Pulmonology'],
      'back pain': ['Orthopedics', 'Neurology', 'Rheumatology'],
      'stomach pain': ['Gastroenterology', 'General Medicine'],
      'nausea': ['Gastroenterology', 'General Medicine'],
      'dizziness': ['Neurology', 'ENT (Ear, Nose, Throat)', 'Cardiology']
    };
    
    const specialties = new Set<string>();
    
    for (const symptom of symptoms) {
      const relatedSpecialties = symptomToSpecialty[symptom] || ['General Medicine'];
      relatedSpecialties.forEach(specialty => specialties.add(specialty));
    }
    
    return Array.from(specialties);
  }
  
  private generateSymptomResponse(symptoms: string[], specialties: string[], doctors: any[]): string {
    const symptomsList = symptoms.join(', ');
    const specialtiesList = specialties.join(' or ');
    
    // If we have doctors for these specialties
    if (doctors && doctors.length > 0) {
      const doctorsList = doctors.slice(0, 3).map(doctor => 
        `Dr. ${doctor.name} (${doctor.specialty}, ${doctor.experience} years experience, ${doctor.city || 'location not specified'})`
      ).join('\n- ');
      
      return `Based on your symptom(s) of ${symptomsList}, you might want to consult a ${specialtiesList}. 
I found these doctors who could help:
- ${doctorsList}

Would you like to book an appointment with any of these doctors? If these doctors aren't in your area, please let me know your city or area for more relevant recommendations.`;
    }
    
    // If no specific doctors found
    return `Based on your symptom(s) of ${symptomsList}, I recommend consulting a ${specialtiesList}. 
These symptoms could indicate various conditions and a medical professional can provide proper diagnosis and treatment. 
Please let me know your city or area so I can help you find a doctor near you.`;
  }

  async getChatHistory(): Promise<Chat[]> {
    return this.chatModel.find().sort({ timestamp: -1 }).exec();
  }
}
