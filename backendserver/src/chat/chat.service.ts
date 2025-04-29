import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorsService } from '../doctors/doctors.service';
import { LocationsService } from '../locations/locations.service';
import { Chat } from './schemas/chat.schema';
import { ChatSession } from './schemas/chat-session.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(ChatSession.name) private chatSessionModel: Model<ChatSession>,
    private readonly doctorsService: DoctorsService,
    private readonly locationsService: LocationsService
  ) {}

  async processMessage(message: string, sessionId: string): Promise<{ response: string, sessionId: string }> {
    let session = await this.getOrCreateSession(sessionId);
    const response = await this.generateResponse(message, session);
    
    await this.chatModel.create({
      message,
      response: response.response,
      timestamp: new Date()
    });

    return { 
      response: response.response, 
      sessionId: session.sessionId 
    };
  }

  private async getOrCreateSession(sessionId: string): Promise<ChatSession> {
    let session = await this.chatSessionModel.findOne({ sessionId }).exec();
    
    if (!session) {
      session = await this.chatSessionModel.create({
        sessionId,
        lastUpdated: new Date()
      });
    }
    
    return session;
  }
  
  private isLocationInquiry(message: string): boolean {
    const locationPatterns = [
      'where', 'location', 'city', 'area', 'near me', 'nearby', 'closest'
    ];
    return locationPatterns.some(pattern => message.toLowerCase().includes(pattern));
  }
  
  private needsLocationContext(message: string): boolean {
    if (this.isLocationInquiry(message)) {
      return true;
    }
    
    const symptoms = this.extractSymptoms(message);
    if (symptoms.length > 0) {
      return true;
    }
    
    return message.includes('doctor') || 
           message.includes('specialist') || 
           message.includes('clinic') || 
           message.includes('hospital');
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
    message = message.toLowerCase();
    
    for (const [symptom, variations] of Object.entries(commonSymptoms)) {
      if (variations.some(variation => message.includes(variation))) {
        foundSymptoms.push(symptom);
      }
    }
    
    return foundSymptoms;
  }
  
  private mapSymptomsToSpecialties(symptoms: string[]): string[] {
    const symptomToSpecialty = {
      'headache': ['Neurology', 'General Medicine'],
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

  private async generateResponse(message: string, session: ChatSession): Promise<{ response: string }> {
    message = message.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return { response: "Hello! I'm your AI health assistant. How can I help you today?" };
    }
    
    const locationInfo = await this.smartExtractLocation(message);
    
    if (locationInfo) {
      session.city = locationInfo;
      await session.save();
    }
    
    if (!session.city && this.needsLocationContext(message)) {
      const cities = await this.locationsService.findAllCities();
      const cityNames = cities.map(city => city.name).join(', ');
      return { response: `To provide you with the most relevant doctor recommendations, could you please share your city? We have doctors in ${cityNames}.` };
    }
    
    const currentLocation = session.city || locationInfo;
    
    // Handle "yes" response for doctor details
    if (message === 'yes' && session.lastDoctor) {
      const doctor = await this.doctorsService.findOne(session.lastDoctor);
      if (doctor) {
        return {
          response: `Here are more details about Dr. ${doctor.name}:
- Specialty: ${doctor.specialty}
- Experience: ${doctor.experience} years
- Rating: ${doctor.rating}/5
- Location: ${doctor.area}, ${doctor.city}
- Consultation Fee: ₹${doctor.consultationFee}
- Languages: ${doctor.languages.join(', ')}
- Education: ${doctor.education.join(', ')}

Would you like to book an appointment with Dr. ${doctor.name}?`
        };
      }
    }
    
    if (message.includes('doctor') || message.includes('specialist')) {
      const filters: any = { available: true };
      if (currentLocation) {
        filters.city = currentLocation;
      }
      
      const doctors = await this.doctorsService.findAll(filters);
      
      if (doctors.length === 0) {
        if (currentLocation) {
          const cities = await this.locationsService.findAllCities();
          const cityNames = cities.map(city => city.name).join(', ');
          return { response: `I couldn't find any doctors in ${currentLocation} at the moment. We have doctors in ${cityNames}. Would you like to try another location?` };
        }
        return { response: "I couldn't find any doctors that match your criteria. You may want to try different search options or check back later when more doctors are available." };
      }
      
      const doctor = doctors[0];
      session.lastDoctor = doctor.id; // Store the last recommended doctor
      await session.save();
      return { 
        response: `I recommend consulting Dr. ${doctor.name}, a ${doctor.specialty} specialist with ${doctor.experience} years of experience${currentLocation ? ` in ${currentLocation}` : ''}. Would you like to know more about them?` 
      };
    }
    
    const symptoms = this.extractSymptoms(message);
    if (symptoms.length > 0) {
      const specialties = this.mapSymptomsToSpecialties(symptoms);
      
      if (specialties.length > 0) {
        let allDoctors = [];
        
        for (const specialty of specialties) {
          const doctorsForSpecialty = await this.doctorsService.findAll({ 
            specialty: specialty,
            available: true
          });
          
          allDoctors = [...allDoctors, ...doctorsForSpecialty];
        }
        
        const uniqueDoctorsMap = new Map();
        allDoctors.forEach(doctor => {
          if (!uniqueDoctorsMap.has(doctor.id)) {
            uniqueDoctorsMap.set(doctor.id, doctor);
          }
        });
        
        const uniqueDoctors = Array.from(uniqueDoctorsMap.values());
        
        if (uniqueDoctors.length === 0) {
          return { 
            response: `Based on your symptom(s) of ${symptoms.join(', ')}, I recommend consulting a ${specialties.join(' or ')}. These symptoms could indicate various conditions and a medical professional can provide proper diagnosis and treatment.` 
          };
        }
        
        return {
          response: this.generateSymptomResponse(symptoms, specialties, uniqueDoctors, currentLocation)
        };
      }
      
      return { 
        response: `I notice you mentioned ${symptoms.join(', ')}. Could you tell me more about your symptoms? For example, when did they start and how severe are they?` 
      };
    }
    
    if (message.includes('symptom') || message.includes('pain') || 
        message.includes('sick') || message.includes('hurt') || 
        message.includes('ache')) {
      
      if (currentLocation) {
        return { 
          response: `I'm sorry to hear that you're not feeling well. Could you please describe your symptoms in more detail? This will help me provide better assistance and recommend appropriate healthcare professionals in ${currentLocation}.` 
        };
      }
      
      return { 
        response: `I'm sorry to hear that you're not feeling well. Could you please describe your symptoms in more detail? This will help me provide better assistance and recommend appropriate healthcare professionals.` 
      };
    }
    
    if (currentLocation) {
      return { 
        response: `Thank you for sharing that you're in ${currentLocation}. How can I assist you with your health concerns today? If you're experiencing any symptoms, please describe them so I can recommend appropriate doctors in your area.` 
      };
    }
    
    return { 
      response: `I understand you're looking for health information. Could you provide more details about what you need help with? I can provide general health advice or help you find appropriate doctors.` 
    };
  }

  private async smartExtractLocation(message: string): Promise<string | null> {
    const words = message.split(/\s+/);
    
    for (const word of words) {
      if (word.length < 3 || ['the', 'and', 'for', 'this', 'that'].includes(word)) {
        continue;
      }
      
      const isCity = await this.locationsService.isValidCity(word);
      if (isCity) {
        const cities = await this.locationsService.findAllCities();
        return cities.find(city => 
          city.name.toLowerCase() === word.toLowerCase()
        )?.name || null;
      }
      
      const areaCheck = await this.locationsService.isValidArea(word);
      if (areaCheck.isValid && areaCheck.city) {
        return areaCheck.city;
      }
    }
    
    return null;
  }
  
  private generateSymptomResponse(
    symptoms: string[], 
    specialties: string[], 
    doctors: any[], 
    location: string | null
  ): string {
    const symptomsList = symptoms.join(', ');
    const specialtiesList = specialties.join(' or ');
    
    if (doctors && doctors.length > 0) {
      const doctorsList = doctors.slice(0, 3).map(doctor => 
        `Dr. ${doctor.name} (${doctor.specialty}, ${doctor.experience} years experience, ${doctor.city || 'location not specified'})`
      ).join('\n- ');
      
      if (location) {
        return `Based on your symptom(s) of ${symptomsList}, you might want to consult a ${specialtiesList}. 
I found these doctors in ${location} who could help:
- ${doctorsList}

Would you like to book an appointment with any of these doctors?`;
      } else {
        return `Based on your symptom(s) of ${symptomsList}, you might want to consult a ${specialtiesList}. 
I found these doctors who could help:
- ${doctorsList}

Would you like to book an appointment with any of these doctors?`;
      }
    }
    
    if (location) {
      return `Based on your symptom(s) of ${symptomsList}, I recommend consulting a ${specialtiesList}. 
These symptoms could indicate various conditions and a medical professional can provide proper diagnosis and treatment. 
I couldn't find any specialists in ${location} in our database.`;
    } else {
      return `Based on your symptom(s) of ${symptomsList}, I recommend consulting a ${specialtiesList}. 
These symptoms could indicate various conditions and a medical professional can provide proper diagnosis and treatment.`;
    }
  }

  async getChatHistory(): Promise<Chat[]> {
    return this.chatModel.find().sort({ timestamp: -1 }).exec();
  }
  
  async getSessionInfo(sessionId: string): Promise<ChatSession | null> {
    return this.chatSessionModel.findOne({ sessionId }).exec();
  }
}
