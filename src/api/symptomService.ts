import apiClient from '../apiClient';
import { BaseMessage } from '@langchain/core/messages';
import { toast } from '@/components/ui/use-toast';
import { sendChatMessage } from './chatService';

export interface Symptom {
  name: string;
  description?: string;
  severity: number;
  conditions: string[];
  doctorSpecialties: string[];
  associatedConditions: string[];
}

export interface SymptomAnalysisRequest {
  symptoms: string[];
}

export interface SymptomAnalysisResponse {
  symptoms: string[];
  possibleConditions: string[];
  aiRecommendation: BaseMessage;
  recommendedSpecialties: string[];
}

interface SymptomAnalysis {
  specialty: string;
  confidence: number;
  relatedSymptoms: string[];
  description: string;
}

export const getAllSymptoms = async (): Promise<Symptom[]> => {
  try {
    console.log('Fetching all symptoms from API...');
    const response = await apiClient.get<Symptom[]>('/symptoms');
    console.log('Symptoms API response data structure:', JSON.stringify(response.data, null, 2));
    
    // Check if response is wrapped in a data property (common API pattern)
    let symptoms = response.data;
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      console.log('Data is nested in a "data" property, extracting...');
      symptoms = (response.data as any).data;
    }
    
    // Check if data is in a 'symptoms' property
    if (response.data && typeof response.data === 'object' && 'symptoms' in response.data) {
      console.log('Data is nested in a "symptoms" property, extracting...');
      symptoms = (response.data as any).symptoms;
    }
    
    // Validate that we have actual symptom data
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      console.warn('API returned empty or invalid symptoms data');
      throw new Error('No symptoms data available');
    }
    
    // Validate each symptom object
    const validatedSymptoms = symptoms.filter(symptom => 
      symptom && 
      typeof symptom === 'object' && 
      typeof symptom.name === 'string' && 
      symptom.name.trim() !== ''
    );
    
    console.log(`Found ${validatedSymptoms.length} valid symptoms after processing`);
    
    if (validatedSymptoms.length === 0) {
      console.warn('No valid symptoms found in API response');
      throw new Error('No valid symptoms data');
    }
    
    return validatedSymptoms;
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    toast({
      title: 'Error Loading Symptoms',
      description: error instanceof Error ? error.message : 'Unknown error occurred',
      variant: 'destructive',
    });
    throw error;
  }
};

export const analyzeSymptoms = async (symptoms: string[]): Promise<SymptomAnalysis> => {
  try {
    // Map common symptoms to specialties that exist in our database
    const symptomToSpecialtyMap: Record<string, string> = {
      'fever': 'General Medicine',
      'headache': 'Neurology',
      'cough': 'Pulmonology',
      'sore throat': 'ENT (Ear, Nose, Throat)',
      'back pain': 'Orthopedics',
      'chest pain': 'Cardiology',
      'stomach pain': 'Gastroenterology',
      'rash': 'Dermatology',
      'joint pain': 'Orthopedics',
      'fatigue': 'General Medicine',
      'dizziness': 'Neurology',
      'nausea': 'Gastroenterology',
      'shortness of breath': 'Pulmonology',
      'abdominal pain': 'Gastroenterology',
      'diarrhea': 'Gastroenterology',
      'constipation': 'Gastroenterology',
      'vomiting': 'Gastroenterology',
      'ear pain': 'ENT (Ear, Nose, Throat)',
      'eye pain': 'Ophthalmology',
      'toothache': 'Dentistry',
      'urinary problems': 'Urology',
      'skin problems': 'Dermatology',
      'mental health': 'Psychiatry',
      'pregnancy': 'Obstetrics & Gynecology',
      'child health': 'Pediatrics',
      'cancer': 'Oncology',
      'diabetes': 'Endocrinology',
      'thyroid': 'Endocrinology',
      'allergy': 'Allergist',
      'sleep problems': 'Sleep Medicine',
      'nutrition': 'Nutritionist'
    };

    // Find the most relevant specialty for the given symptoms
    const specialty = symptoms.reduce((acc, symptom) => {
      const mappedSpecialty = symptomToSpecialtyMap[symptom.toLowerCase()];
      if (mappedSpecialty) {
        acc[mappedSpecialty] = (acc[mappedSpecialty] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Get the specialty with the highest count
    const recommendedSpecialty = Object.entries(specialty)
      .sort((a, b) => b[1] - a[1])
      .map(([specialty]) => specialty)[0] || 'General Medicine';

    return {
      specialty: recommendedSpecialty,
      confidence: 0.8, // High confidence as we're using predefined mappings
      relatedSymptoms: symptoms,
      description: `Based on your symptoms, I recommend seeing a ${recommendedSpecialty}. This specialty is best suited to address your concerns.`
    };
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    // Return a default response in case of error
    return {
      specialty: 'General Medicine',
      confidence: 0.5,
      relatedSymptoms: symptoms,
      description: 'Unable to determine specific specialty. Please consult a General Medicine specialist.'
    };
  }
};
