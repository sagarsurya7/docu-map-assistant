
import { Doctor } from '../types';
import { puneAreas } from './locations';
import { specialties } from './specialties';
import { getDoctors } from '@/api/doctorService';

// Fallback doctors data - will be used if API fails
const fallbackDoctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. John Doe",
    specialty: "Cardiologist",
    address: "100, MG Road",
    area: "Camp",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.5,
    experience: 10,
    languages: ["English", "Hindi"],
    education: ["MBBS - AFMC Pune", "MD - Cardiology, AIIMS Delhi"],
    available: true,
    consultationFee: 1500,
    imageUrl: "https://example.com/doctor1.jpg",
    gender: "male",
    location: { lat: 18.5204, lng: 73.8567 }
  },
  {
    id: "2",
    name: "Dr. Alice Smith",
    specialty: "Dermatologist",
    address: "200, FC Road",
    area: "Shivajinagar",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.5,
    experience: 8,
    languages: ["English", "Marathi"],
    education: ["MBBS - BJMC", "MD - Dermatology, KEM Mumbai"],
    available: true,
    consultationFee: 1000,
    imageUrl: "https://example.com/doctor2.jpg",
    gender: "female",
    location: { lat: 18.5300, lng: 73.8450 }
  }
];

// Export an array of doctors for use in components
export const doctors = fallbackDoctors;

// Export areas and specialties arrays
export { puneAreas, specialties };

// Search helper functions with typesafety
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
