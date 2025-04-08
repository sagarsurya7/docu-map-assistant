
import { Doctor } from '../types';
import { doctors } from './doctorsData';
import { puneAreas } from './locations';
import { specialties } from './specialties';
import { searchDoctors, filterDoctors } from './doctorsSearch';

// Re-export everything for backward compatibility
export { 
  doctors, 
  puneAreas, 
  specialties, 
  searchDoctors, 
  filterDoctors 
};

// Get unique values for filters
export function getUniqueSpecialties(): string[] {
  return [...new Set(doctors.map(doctor => doctor.specialty))];
}

export function getUniqueCities(): string[] {
  return [...new Set(doctors.map(doctor => doctor.city))];
}

export function getUniqueAreas(): string[] {
  return [...new Set(doctors.map(doctor => doctor.area))];
}
