
import apiClient from './apiClient';
import { BaseMessage } from '@langchain/core/messages';
import { toast } from '@/components/ui/use-toast';

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

export const getAllSymptoms = async (): Promise<Symptom[]> => {
  try {
    console.log('Fetching all symptoms from API...');
    const response = await apiClient.get<Symptom[]>('/symptoms');
    console.log('Symptoms API response:', response.data);
    
    // Validate that we have actual symptom data
    if (!Array.isArray(response.data) || response.data.length === 0) {
      console.warn('API returned empty or invalid symptoms data');
      throw new Error('No symptoms data available');
    }
    
    // Validate each symptom object
    const validatedSymptoms = response.data.filter(symptom => 
      symptom && 
      typeof symptom === 'object' && 
      typeof symptom.name === 'string' && 
      symptom.name.trim() !== ''
    );
    
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

export const analyzeSymptoms = async (symptoms: string[]): Promise<SymptomAnalysisResponse> => {
  try {
    console.log('Analyzing symptoms:', symptoms);
    const response = await apiClient.post<SymptomAnalysisResponse>('/symptoms/analyze', { symptoms });
    console.log('Symptom analysis response:', response.data);
    
    // Validate response data
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid analysis response from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    toast({
      title: 'Symptom Analysis Failed',
      description: error instanceof Error ? error.message : 'Unknown error occurred',
      variant: 'destructive',
    });
    throw error;
  }
};
