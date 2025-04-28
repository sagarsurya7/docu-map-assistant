
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
    // Get or create session
    let session = await this.getOrCreateSession(sessionId);
    
    // Process the message with session context
    const response = await this.generateResponse(message, session);
    
    // Save the chat interaction
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
  
  // Utility method to check if this message type requires location context
  private needsLocationContext(message: string): boolean {
    // Check for explicit location inquiries
    if (this.isLocationInquiry(message)) {
      return true;
    }
    
    // Check for symptoms - we want location to recommend doctors
    const symptoms = this.extractSymptoms(message);
    if (symptoms.length > 0) {
      return true;
    }
    
    // Check for doctor or specialist requests
    if (message.includes('doctor') || message.includes('specialist') || 
        message.includes('clinic') || message.includes('hospital')) {
      return true;
    }
    
    // For generic health queries, we don't need to prompt for location
    return false;
  }
  
  // Check if message is a location inquiry
  private isLocationInquiry(message: string): boolean {
    const locationPatterns = [
      'where', 'location', 'city', 'area', 'near me', 'nearby', 'closest'
    ];
    
    return locationPatterns.some(pattern => message.includes(pattern));
  }

  private async generateResponse(message: string, session: ChatSession): Promise<{ response: string }> {
    message = message.toLowerCase();
    
    // Check for greetings
    if (message.includes('hello') || message.includes('hi')) {
      return { response: "Hello! I'm your AI health assistant. How can I help you today?" };
    }
    
    // Extract and validate location data
    const locationInfo = await this.smartExtractLocation(message);
    
    // If location is found in this message, update the session
    if (locationInfo) {
      session.city = locationInfo;
      await session.save();
      console.log(`Updated session ${session.sessionId} with city: ${locationInfo}`);
    }
    
    // If we don't have a location yet, and this is a location inquiry or health question that needs location context, ask for location
    if (!session.city && this.needsLocationContext(message)) {
      const cities = await this.locationsService.findAllCities();
      const cityNames = cities.map(city => city.name).join(', ');
      return { response: `To provide you with the most relevant doctor recommendations, could you please share your city? We have doctors in ${cityNames}.` };
    }
    
    // Use the session's stored location if available
    const currentLocation = session.city || locationInfo;
    console.log("Using location from session or message:", currentLocation);
    
    // Check for doctors or specialists requests
    if (message.includes('doctor') || message.includes('specialist')) {
      // If location is provided (from session or current message), use it for filtering
      const filters: any = { available: true };
      if (currentLocation) {
        filters.city = currentLocation;
      }
      
      const doctors = await this.doctorsService.findAll(filters);
      console.log(`Found ${doctors.length} doctors with filters:`, filters);
      
      if (doctors.length === 0) {
        if (currentLocation) {
          // Get all available cities to provide options
          const cities = await this.locationsService.findAllCities();
          const cityNames = cities.map(city => city.name).join(', ');
          return { response: `I couldn't find any doctors in ${currentLocation} at the moment. We have doctors in ${cityNames}. Would you like to try another location?` };
        }
        return { response: "I couldn't find any doctors that match your criteria. You may want to try different search options or check back later when more doctors are available." };
      }
      
      const doctor = doctors[0];
      return { 
        response: `I recommend consulting Dr. ${doctor.name}, a ${doctor.specialty} specialist with ${doctor.experience} years of experience${currentLocation ? ` in ${currentLocation}` : ''}. Would you like to know more about them?` 
      };
    }
    
    // Check for specific symptoms
    const symptoms = this.extractSymptoms(message);
    if (symptoms.length > 0) {
      const specialties = this.mapSymptomsToSpecialties(symptoms);
      
      if (specialties.length > 0) {
        // If we don't have a location yet, provide general advice first
        if (!currentLocation) {
          return { 
            response: `I notice you mentioned ${symptoms.join(', ')}. Based on these symptoms, you might want to consult a ${specialties.join(' or ')}. Would you like me to find doctors for you? If so, let me know which city you're in, and I can provide specific recommendations.` 
          };
        }
        
        console.log(`Looking for doctors in specialties: ${specialties.join(', ')} in location: ${currentLocation}`);
        
        // Fetch doctors for each specialty individually and combine the results
        let allDoctors = [];
        
        // Fetch doctors for each specialty and combine results
        for (const specialty of specialties) {
          const doctorsForSpecialty = await this.doctorsService.findAll({ 
            specialty: specialty,
            available: true,
            ...(currentLocation ? { city: currentLocation } : {})
          });
          
          console.log(`Found ${doctorsForSpecialty.length} doctors for specialty ${specialty} in ${currentLocation || 'any location'}`);
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
          response: this.generateSymptomResponse(symptoms, specialties, uniqueDoctors, currentLocation)
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
      
      if (currentLocation) {
        return { 
          response: `I'm sorry to hear that you're not feeling well. Could you please describe your symptoms in more detail? This will help me provide better assistance and recommend appropriate healthcare professionals in ${currentLocation}.` 
        };
      }
      
      return { 
        response: `I'm sorry to hear that you're not feeling well. Could you please describe your symptoms in more detail? This will help me provide better assistance and recommend appropriate healthcare professionals.` 
      };
    }
    
    // If location is provided but no specific request
    if (currentLocation) {
      return { 
        response: `Thank you for sharing that you're in ${currentLocation}. How can I assist you with your health concerns today? If you're experiencing any symptoms, please describe them so I can recommend appropriate doctors in your area.` 
      };
    }
    
    // Default response without asking for location
    return { 
      response: `I understand you're looking for health information. Could you provide more details about what you need help with? I can provide general health advice or help you find appropriate doctors.` 
    };
  }

  // Enhanced location extraction that validates against database
  private async smartExtractLocation(message: string): Promise<string | null> {
    const words = message.split(/\s+/);
    
    // Check each word against our database of cities and areas
    for (const word of words) {
      // Skip very short words or common words
      if (word.length < 3 || ['the', 'and', 'for', 'this', 'that'].includes(word)) {
        continue;
      }
      
      // Check if word is a city
      const isCity = await this.locationsService.isValidCity(word);
      if (isCity) {
        // Get the properly cased city name
        const cities = await this.locationsService.findAllCities();
        return cities.find(city => 
          city.name.toLowerCase() === word.toLowerCase()
        )?.name || null;
      }
      
      // Check if word is an area, and if so, return its city
      const areaCheck = await this.locationsService.isValidArea(word);
      if (areaCheck.isValid && areaCheck.city) {
        return areaCheck.city;
      }
    }
    
    // If we reach here, check the old method as a fallback
    return this.extractLocation(message);
  }
  
  // Extract location from message
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
  
  // Extract symptoms from message
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
  
  // Map symptoms to specialties
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
  
  // Generate symptom response
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
  
  async getSessionInfo(sessionId: string): Promise<ChatSession | null> {
    return this.chatSessionModel.findOne({ sessionId }).exec();
  }
}
