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
  console.log('🔍 Frontend API: getDoctors called with filters:', filters);
  
  try {
    console.log('📡 Frontend API: Making request to /doctors endpoint...');
    console.log('📡 Frontend API: Base URL:', apiClient.defaults.baseURL);
    console.log('📡 Frontend API: Full URL would be:', `${apiClient.defaults.baseURL}/doctors`);
    
    const response = await apiClient.get('/doctors', { params: filters });
    
    console.log('✅ Frontend API: Response received!');
    console.log('📊 Frontend API: Response status:', response.status);
    console.log('📊 Frontend API: Response headers:', response.headers);
    console.log('📊 Frontend API: Raw response data:', response.data);
    console.log('📊 Frontend API: Response data type:', typeof response.data);
    console.log('📊 Frontend API: Is response.data an array?', Array.isArray(response.data));
    
    if (!Array.isArray(response.data)) {
      console.error('❌ Frontend API: Expected an array but received:', typeof response.data, response.data);
      return [];
    }
    
    const doctors = response.data;
    console.log(`✅ Frontend API: Successfully received ${doctors.length} doctors from backend`);
    
    // Detailed logging for each doctor
    doctors.forEach((doctor, index) => {
      console.log(`👨‍⚕️ Doctor ${index + 1}:`, {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        city: doctor.city,
        area: doctor.area
      });
    });
    
    // Count doctors by city
    const cityCounts = doctors.reduce((acc: Record<string, number>, doctor) => {
      acc[doctor.city] = (acc[doctor.city] || 0) + 1;
      return acc;
    }, {});
    console.log('🏙️ Frontend API: Doctors by city:', cityCounts);
    
    // Special focus on Pune doctors
    const puneDoctors = doctors.filter(doc => doc.city === 'Pune');
    console.log(`🏙️ Frontend API: Found ${puneDoctors.length} Pune doctors:`, 
      puneDoctors.map(d => `${d.name} (${d.specialty})`));
    
    return doctors;
    
  } catch (error: any) {
    console.error('❌ Frontend API: Error in getDoctors:', error);
    console.error('❌ Frontend API: Error message:', error.message);
    
    if (error.response) {
      console.error('❌ Frontend API: Error response status:', error.response.status);
      console.error('❌ Frontend API: Error response data:', error.response.data);
      console.error('❌ Frontend API: Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('❌ Frontend API: No response received. Request details:', error.request);
      console.error('❌ Frontend API: This could indicate a network issue or backend not running');
    } else {
      console.error('❌ Frontend API: Error in request setup:', error.message);
    }
    
    // Don't throw the error, return empty array to see if that helps
    console.log('🔄 Frontend API: Returning empty array instead of throwing error');
    return [];
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
