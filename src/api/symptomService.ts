
import apiClient from '../../apiClient';
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

export const analyzeSymptoms = async (symptoms: string[]): Promise<SymptomAnalysisResponse> => {
  try {
    console.log('Analyzing symptoms:', symptoms);
    const response = await apiClient.post<SymptomAnalysisResponse>('/symptoms/analyze', { symptoms });
    console.log('Symptom analysis response structure:', JSON.stringify(response.data, null, 2));
    
    // Check if response is wrapped in a data property
    let analysisResult = response.data;
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      console.log('Analysis result is nested in a "data" property, extracting...');
      analysisResult = (response.data as any).data;
    }
    
    // Validate response data
    if (!analysisResult || typeof analysisResult !== 'object') {
      throw new Error('Invalid analysis response from server');
    }
    
    // Ensure all expected fields exist
    const defaultAnalysis: Partial<SymptomAnalysisResponse> = {
      symptoms: symptoms,
      possibleConditions: [],
      recommendedSpecialties: [],
      aiRecommendation: { content: "No recommendation available." } as BaseMessage
    };
    
    // Merge with defaults to ensure all fields exist
    const completeAnalysis: SymptomAnalysisResponse = {
      ...defaultAnalysis,
      ...analysisResult,
      // Ensure symptoms array exists and matches request
      symptoms: Array.isArray(analysisResult.symptoms) ? analysisResult.symptoms : symptoms,
      // Ensure these are arrays
      possibleConditions: Array.isArray(analysisResult.possibleConditions) ? analysisResult.possibleConditions : [],
      recommendedSpecialties: Array.isArray(analysisResult.recommendedSpecialties) ? analysisResult.recommendedSpecialties : []
    };
    
    return completeAnalysis;
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
