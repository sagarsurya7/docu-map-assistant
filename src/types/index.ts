import { BaseMessage } from '@langchain/core/messages';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  address: string;
  area: string;
  city: string;
  state: string;
  country: string;
  rating: number;
  experience: number;
  languages: string[];
  education: string[];
  available: boolean;
  consultationFee: number;
  imageUrl: string;
  location?: {
    lat: number;
    lng: number;
  };
  availability?: {
    [key: string]: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
}

export interface Symptom {
  name: string;
  description?: string;
  severity: number;
  conditions: string[];
  doctorSpecialties: string[] | Record<string, string>;
  associatedConditions?: string[];
}

export interface SymptomAnalysis {
  symptoms: string[];
  possibleConditions: string[];
  aiRecommendation: BaseMessage;
  recommendedSpecialties: string[];
}
