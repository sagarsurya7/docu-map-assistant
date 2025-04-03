
import apiClient from './apiClient';
import { BaseMessage } from '@langchain/core/messages';

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
    const response = await apiClient.get<Symptom[]>('/symptoms');
    return response.data;
  } catch (error) {
    console.error('Error fetching symptoms:', error);
    throw error;
  }
};

export const analyzeSymptoms = async (symptoms: string[]): Promise<SymptomAnalysisResponse> => {
  try {
    const response = await apiClient.post<SymptomAnalysisResponse>('/symptoms/analyze', { symptoms });
    return response.data;
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
};
