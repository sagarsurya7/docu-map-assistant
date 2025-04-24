
import { Doctor } from '@/types';

// Search helper functions
export function searchDoctors(doctorsList: Doctor[], query: string): Doctor[] {
  const searchTerm = query.toLowerCase();
  return doctorsList.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm) ||
    doctor.specialty.toLowerCase().includes(searchTerm) ||
    doctor.area.toLowerCase().includes(searchTerm) ||
    doctor.city.toLowerCase().includes(searchTerm)
  );
}

export function filterDoctors(doctorsList: Doctor[], filters: {
  specialty?: string;
  city?: string;
  area?: string;
  rating?: number;
  available?: boolean;
}): Doctor[] {
  return doctorsList.filter(doctor => {
    if (filters.specialty && doctor.specialty !== filters.specialty) return false;
    if (filters.city && doctor.city !== filters.city) return false;
    if (filters.area && doctor.area !== filters.area) return false;
    if (filters.rating && doctor.rating < filters.rating) return false;
    if (filters.available !== undefined && doctor.available !== filters.available) return false;
    return true;
  });
}

// Get unique values for filters
export function getUniqueSpecialties(doctors: Doctor[]): string[] {
  return [...new Set(doctors.map(doctor => doctor.specialty))];
}

export function getUniqueCities(doctors: Doctor[]): string[] {
  return [...new Set(doctors.map(doctor => doctor.city))];
}

export function getUniqueAreas(doctors: Doctor[]): string[] {
  return [...new Set(doctors.map(doctor => doctor.area))];
}
