
import apiClient from './apiClient';
import { Doctor } from '@/types';

export interface DoctorFilters {
  search?: string;
  specialty?: string;
  city?: string;
  area?: string;
  rating?: number;
  available?: boolean;
}

export interface FilterOptions {
  specialties: string[];
  cities: string[];
  areas: string[];
}

export const getDoctors = async (filters: DoctorFilters = {}): Promise<Doctor[]> => {
  try {
    const response = await apiClient.get('/doctors', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

export const getFilterOptions = async (): Promise<FilterOptions> => {
  try {
    const response = await apiClient.get<FilterOptions>('/doctors/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};
