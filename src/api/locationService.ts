
import apiClient from '../apiClient';

export interface City {
  name: string;
}

export interface Area {
  name: string;
  city: string;
}

export const getCities = async (): Promise<City[]> => {
  try {
    const response = await apiClient.get('/locations/cities');
    return response.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

export const getAreas = async (city?: string): Promise<Area[]> => {
  try {
    const params = city ? { city } : {};
    const response = await apiClient.get('/locations/areas', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching areas:', error);
    throw error;
  }
};

export const getAreasByCity = async (city: string): Promise<Area[]> => {
  try {
    const response = await apiClient.get(`/locations/cities/${city}/areas`);
    return response.data;
  } catch (error) {
    console.error('Error fetching areas for city:', error);
    throw error;
  }
};
