
import apiClient from '../apiClient';
import { Doctor } from '../types';

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
  console.log('Frontend: Fetching doctors with filters:', filters);
  try {
    const response = await apiClient.get('/doctors', { params: filters });
    console.log('Frontend: Doctors API response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Frontend: Error fetching doctors:', error);
    if (error.response) {
      console.error('Frontend: Error response data:', error.response.data);
      console.error('Frontend: Error response status:', error.response.status);
    } else if (error.request) {
      console.error('Frontend: No response received from server');
    }
    throw error;
  }
};

export const getFilterOptions = async (): Promise<FilterOptions> => {
  console.log('Frontend: Fetching filter options');
  try {
    const response = await apiClient.get<FilterOptions>('/doctors/filters');
    console.log('Frontend: Filter options received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Frontend: Error fetching filter options:', error);
    throw error;
  }
};

// Get doctor by ID
export const getDoctorById = async (id: string): Promise<Doctor> => {
  console.log(`Frontend: Fetching doctor with ID ${id}`);
  try {
    const response = await apiClient.get<Doctor>(`/doctors/${id}`);
    console.log('Frontend: Doctor data received:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Frontend: Error fetching doctor with ID ${id}:`, error);
    throw error;
  }
};
