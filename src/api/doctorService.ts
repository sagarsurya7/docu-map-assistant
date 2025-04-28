
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
    console.log('Making request to /doctors endpoint...');
    const response = await apiClient.get('/doctors', { params: filters });
    console.log('Frontend: Doctors API response received:', response.data);
    
    // Verify that we received an array of doctors
    if (!Array.isArray(response.data)) {
      console.error('Frontend: Expected an array but received:', typeof response.data);
      return [];
    }
    
    console.log(`Frontend: Received ${response.data.length} doctors from API`);
    
    // Add debugging for Pune doctors
    const puneDoctors = response.data.filter(doc => doc.city === 'Pune');
    console.log(`Frontend: Pune doctors count: ${puneDoctors.length}`);
    if (puneDoctors.length > 0) {
      console.log('Frontend: Sample Pune doctor:', puneDoctors[0].name, puneDoctors[0].specialty);
    }
    
    // Log all unique cities in the response
    const cities = [...new Set(response.data.map((doc: Doctor) => doc.city))];
    console.log('Frontend: Cities in response:', cities.join(', '));
    
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

// Add a utility function to clear all doctors from the database
export const clearAllDoctors = async (): Promise<void> => {
  console.log('Frontend: Clearing all doctors from database');
  try {
    const response = await apiClient.delete('/doctors');
    console.log('Frontend: Clear doctors response:', response.data);
  } catch (error) {
    console.error('Frontend: Error clearing doctors:', error);
    throw error;
  }
};

// Add a utility function to reload doctors from JSON file
export const reloadDoctorsFromJson = async (): Promise<void> => {
  console.log('Frontend: Reloading doctors from JSON file');
  try {
    await clearAllDoctors();
    // Sleep for a moment to ensure deletion completes
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Fetch doctors to trigger reloading from JSON
    const doctors = await getDoctors();
    console.log(`Frontend: Reloaded ${doctors.length} doctors from JSON file`);
  } catch (error) {
    console.error('Frontend: Error reloading doctors:', error);
    throw error;
  }
};
