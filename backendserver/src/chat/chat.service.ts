
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorsService } from '../doctors/doctors.service';
import { LocationsService } from '../locations/locations.service';
import { Chat } from './schemas/chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    private readonly doctorsService: DoctorsService,
    private readonly locationsService: LocationsService
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
      const cities = await this.locationsService.findAllCities();
      const cityNames = cities.map(city => city.name).join(', ');
      return { response: `To provide you with the most relevant doctor recommendations, could you please share your city? We have doctors in ${cityNames}.` };
    }

    // Check for location information
    const locationInfo = await this.extractLocation(message);
    console.log("Extracted location:", locationInfo);
    
    // Check for doctors or specialists requests
    if (message.includes('doctor') || message.includes('specialist')) {
      // If location is provided, use it for filtering
      const filters: any = { available: true };
      if (locationInfo) {
        filters.city = locationInfo;
      }
      
      const doctors = await this.doctorsService.findAll(filters);
      console.log(`Found ${doctors.length} doctors with filters:`, filters);
      
      if (doctors.length === 0) {
        if (locationInfo) {
          // Get all available cities to provide options
          const cities = await this.locationsService.findAllCities();
          const cityNames = cities.map(city => city.name).join(', ');
          return { response: `I couldn't find any doctors in ${locationInfo} at the moment. We have doctors in ${cityNames}. Would you like to try another location?` };
        }
        return { response: "I couldn't find any doctors that match your criteria. You may want to try different search options or check back later when more doctors are available." };
      }
      
      const doctor = doctors[0];
      return { 
        response: `I recommend consulting Dr. ${doctor.name}, a ${doctor.specialty} specialist with ${doctor.experience} years of experience${locationInfo ? ` in ${locationInfo}` : ''}. Would you like to know more about them?` 
      };
    }
    
    // Check for specific symptoms
    const symptoms = this.extractSymptoms(message);
    if (symptoms.length > 0) {
      const specialties = this.mapSymptomsToSpecialties(symptoms);
      
      if (specialties.length > 0) {
        // Modified approach - don't ask for location immediately
        // Just provide general advice first
        if (!locationInfo) {
          return { 
            response: `I notice you mentioned ${symptoms.join(', ')}. Based on these symptoms, you might want to consult a ${specialties.join(' or ')}. Would you like me to find doctors for you? If so, let me know which city you're in, and I can provide specific recommendations.` 
          };
        }
        
        console.log(`Looking for doctors in specialties: ${specialties.join(', ')} in location: ${locationInfo}`);
        
        // Modified - Now we'll fetch doctors for each specialty individually and combine the results
        let allDoctors = [];
        
        // Fetch doctors for each specialty and combine results
        for (const specialty of specialties) {
          const doctorsForSpecialty = await this.doctorsService.findAll({ 
            specialty: specialty,
            available: true,
            ...(locationInfo ? { city: locationInfo } : {})
          });
          
          console.log(`Found ${doctorsForSpecialty.length} doctors for specialty ${specialty} in ${locationInfo || 'any location'}`);
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
        console.log(`Final unique doctors count: ${uniqueDoctors.length}`);
        
        return {
          response: this.generateSymptomResponse(symptoms, specialties, uniqueDoctors, locationInfo)
        };
      }
      
      // If we have symptoms but couldn't map to specialties
      return { 
        response: `I notice you mentioned ${symptoms.join(', ')}. Could you tell me more about your symptoms? For example, when did they start and how severe are they?` 
      };
    }
    
    // General symptom inquiries
    if (message.includes('symptom') || message.includes('pain') || message.includes('sick') || 
        message.includes('hurt') || message.includes('ache')) {
      
      return { 
        response: `I'm sorry to hear that you're not feeling well. Could you please describe your symptoms in more detail? This will help me provide better assistance and recommend appropriate healthcare professionals.` 
      };
    }
    
    // If location is provided but no specific request
    if (locationInfo) {
      return { 
        response: `Thank you for sharing that you're in ${locationInfo}. How can I assist you with your health concerns today? If you're experiencing any symptoms, please describe them so I can recommend appropriate doctors in your area.` 
      };
    }
    
    // Default response without asking for location
    return { 
      response: `I understand you're looking for health information. Could you provide more details about what you need help with? I can provide general health advice or help you find appropriate doctors.` 
    };
  }
  
  private isLocationInquiry(message: string): boolean {
    const locationPatterns = [
      'where', 'location', 'city', 'area', 'near me', 'nearby', 'closest'
    ];
    
    return locationPatterns.some(pattern => message.includes(pattern));
  }
  
  private async extractLocation(message: string): Promise<string | null> {
    // Get all cities from the database
    const cities = await this.locationsService.findAllCities();
    const cityNames = cities.map(city => city.name.toLowerCase());
    
    // Check if any city name is mentioned in the message
    for (const cityName of cityNames) {
      if (message.includes(cityName.toLowerCase())) {
        // Return the properly capitalized city name
        return cities.find(city => city.name.toLowerCase() === cityName)?.name || null;
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
  
  private generateSymptomResponse(
    symptoms: string[], 
    specialties: string[], 
    doctors: any[], 
    location: string | null
  ): string {
    const symptomsList = symptoms.join(', ');
    const specialtiesList = specialties.join(' or ');
    
    // If we have doctors for these specialties
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
    
    // If no specific doctors found
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
}

