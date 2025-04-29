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
  availability: {
    [key: string]: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
}

// List of Pune areas for autocomplete
export const puneAreas = [
  "Kalyani Nagar",
  "Koregaon Park",
  "Viman Nagar",
  "Aundh",
  "Baner",
  "Hinjewadi",
  "Wakad",
  "Kharadi",
  "Magarpatta",
  "Hadapsar",
  "Kondhwa",
  "Bibwewadi",
  "Katraj",
  "Swargate",
  "Deccan",
  "Shivaji Nagar",
  "Camp",
  "Kalyani Nagar",
  "Koregaon Park",
  "Viman Nagar",
  "Aundh",
  "Baner",
  "Hinjewadi",
  "Wakad",
  "Kharadi",
  "Magarpatta",
  "Hadapsar",
  "Kondhwa",
  "Bibwewadi",
  "Katraj",
  "Swargate",
  "Deccan",
  "Shivaji Nagar",
  "Camp"
];

// List of medical specialties
export const specialties = [
  "Cardiologist",
  "Neurologist",
  "Orthopedist",
  "Pediatrician",
  "Dermatologist",
  "ENT Specialist",
  "Ophthalmologist",
  "Psychiatrist",
  "Dentist",
  "General Physician",
  "Gynecologist",
  "Urologist",
  "Endocrinologist",
  "Pulmonologist",
  "Gastroenterologist",
  "Oncologist",
  "Radiologist",
  "Surgeon",
  "Physiotherapist",
  "Nutritionist"
];

// Sample doctors data
export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    address: "123, Shastri Nagar",
    area: "Kalyani Nagar",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.8,
    experience: 15,
    languages: ["Hindi", "English", "Marathi"],
    education: [
      "MBBS - BJ Medical College, Pune",
      "MD - Cardiology, AIIMS Delhi",
      "DM - Cardiology, AIIMS Delhi"
    ],
    available: true,
    consultationFee: 1500,
    imageUrl: "https://example.com/doctor1.jpg",
    availability: {
      Monday: { morning: true, afternoon: true, evening: false },
      Tuesday: { morning: true, afternoon: true, evening: false },
      Wednesday: { morning: true, afternoon: true, evening: false },
      Thursday: { morning: true, afternoon: true, evening: false },
      Friday: { morning: true, afternoon: true, evening: false },
      Saturday: { morning: true, afternoon: false, evening: false },
      Sunday: { morning: false, afternoon: false, evening: false }
    }
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    specialty: "Neurologist",
    address: "456, Koregaon Park",
    area: "Koregaon Park",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.9,
    experience: 12,
    languages: ["Hindi", "English", "Marathi"],
    education: [
      "MBBS - Grant Medical College, Mumbai",
      "MD - Neurology, NIMHANS Bangalore",
      "DM - Neurology, NIMHANS Bangalore"
    ],
    available: true,
    consultationFee: 2000,
    imageUrl: "https://example.com/doctor2.jpg",
    availability: {
      Monday: { morning: true, afternoon: false, evening: true },
      Tuesday: { morning: true, afternoon: false, evening: true },
      Wednesday: { morning: true, afternoon: false, evening: true },
      Thursday: { morning: true, afternoon: false, evening: true },
      Friday: { morning: true, afternoon: false, evening: true },
      Saturday: { morning: true, afternoon: false, evening: false },
      Sunday: { morning: false, afternoon: false, evening: false }
    }
  },
  {
    id: "3",
    name: "Dr. Amit Patel",
    specialty: "Orthopedist",
    address: "789, Viman Nagar",
    area: "Viman Nagar",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.7,
    experience: 10,
    languages: ["Hindi", "English", "Gujarati"],
    education: [
      "MBBS - GMC, Mumbai",
      "MS - Orthopedics, JJ Hospital, Mumbai",
      "MCh - Orthopedics, AIIMS Delhi"
    ],
    available: true,
    consultationFee: 1800,
    imageUrl: "https://example.com/doctor3.jpg",
    availability: {
      Monday: { morning: false, afternoon: true, evening: true },
      Tuesday: { morning: false, afternoon: true, evening: true },
      Wednesday: { morning: false, afternoon: true, evening: true },
      Thursday: { morning: false, afternoon: true, evening: true },
      Friday: { morning: false, afternoon: true, evening: true },
      Saturday: { morning: true, afternoon: false, evening: false },
      Sunday: { morning: false, afternoon: false, evening: false }
    }
  },
  {
    id: "4",
    name: "Dr. Meera Desai",
    specialty: "Pediatrician",
    address: "321, Aundh",
    area: "Aundh",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.9,
    experience: 8,
    languages: ["Hindi", "English", "Marathi", "Gujarati"],
    education: [
      "MBBS - BJ Medical College, Pune",
      "MD - Pediatrics, AIIMS Delhi",
      "Fellowship in Pediatric Emergency, UK"
    ],
    available: true,
    consultationFee: 1200,
    imageUrl: "https://example.com/doctor4.jpg",
    availability: {
      Monday: { morning: true, afternoon: true, evening: false },
      Tuesday: { morning: true, afternoon: true, evening: false },
      Wednesday: { morning: true, afternoon: true, evening: false },
      Thursday: { morning: true, afternoon: true, evening: false },
      Friday: { morning: true, afternoon: true, evening: false },
      Saturday: { morning: true, afternoon: false, evening: false },
      Sunday: { morning: false, afternoon: false, evening: false }
    }
  },
  {
    id: "5",
    name: "Dr. Suresh Verma",
    specialty: "Dermatologist",
    address: "555, Baner",
    area: "Baner",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.6,
    experience: 15,
    languages: ["Hindi", "English", "Marathi"],
    education: [
      "MBBS - GMC, Mumbai",
      "MD - Dermatology, AIIMS Delhi",
      "Fellowship in Cosmetic Dermatology, USA"
    ],
    available: true,
    consultationFee: 1600,
    imageUrl: "https://example.com/doctor5.jpg",
    availability: {
      Monday: { morning: false, afternoon: true, evening: true },
      Tuesday: { morning: false, afternoon: true, evening: true },
      Wednesday: { morning: false, afternoon: true, evening: true },
      Thursday: { morning: false, afternoon: true, evening: true },
      Friday: { morning: false, afternoon: true, evening: true },
      Saturday: { morning: true, afternoon: false, evening: false },
      Sunday: { morning: false, afternoon: false, evening: false }
    }
  },
  {
    id: "6",
    name: "Dr. Anjali Joshi",
    specialty: "ENT Specialist",
    address: "777, Hinjewadi",
    area: "Hinjewadi",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.7,
    experience: 11,
    languages: ["Hindi", "English", "Marathi"],
    education: [
      "MBBS - BJ Medical College, Pune",
      "MS - ENT, AIIMS Delhi",
      "Fellowship in Head and Neck Surgery, UK"
    ],
    available: true,
    consultationFee: 1400,
    imageUrl: "https://example.com/doctor6.jpg",
    availability: {
      Monday: { morning: true, afternoon: false, evening: true },
      Tuesday: { morning: true, afternoon: false, evening: true },
      Wednesday: { morning: true, afternoon: false, evening: true },
      Thursday: { morning: true, afternoon: false, evening: true },
      Friday: { morning: true, afternoon: false, evening: true },
      Saturday: { morning: true, afternoon: false, evening: false },
      Sunday: { morning: false, afternoon: false, evening: false }
    }
  },
  {
    id: "7",
    name: "Dr. Rahul Mehta",
    specialty: "Ophthalmologist",
    address: "888, Wakad",
    area: "Wakad",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.8,
    experience: 13,
    languages: ["Hindi", "English", "Marathi", "Gujarati"],
    education: [
      "MBBS - GMC, Mumbai",
      "MS - Ophthalmology, AIIMS Delhi",
      "Fellowship in Retina, USA"
    ],
    available: true,
    consultationFee: 1700,
    imageUrl: "https://example.com/doctor7.jpg",
    availability: {
      Monday: { morning: true, afternoon: true, evening: false },
      Tuesday: { morning: true, afternoon: true, evening: false },
      Wednesday: { morning: true, afternoon: true, evening: false },
      Thursday: { morning: true, afternoon: true, evening: false },
      Friday: { morning: true, afternoon: true, evening: false },
      Saturday: { morning: true, afternoon: false, evening: false },
      Sunday: { morning: false, afternoon: false, evening: false }
    }
  },
  {
    id: "8",
    name: "Dr. Neha Gupta",
    specialty: "Psychiatrist",
    address: "999, Kharadi",
    area: "Kharadi",
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    rating: 4.9,
    experience: 9,
    languages: ["Hindi", "English", "Marathi"],
    education: [
      "MBBS - BJ Medical College, Pune",
      "MD - Psychiatry, NIMHANS Bangalore",
      "Fellowship in Child Psychiatry, UK"
    ],
    available: true,
    consultationFee: 2000,
    imageUrl: "https://example.com/doctor8.jpg",
    availability: {
      Monday: { morning: false, afternoon: true, evening: true },
      Tuesday: { morning: false, afternoon: true, evening: true },
      Wednesday: { morning: false, afternoon: true, evening: true },
      Thursday: { morning: false, afternoon: true, evening: true },
      Friday: { morning: false, afternoon: true, evening: true },
      Saturday: { morning: true, afternoon: false, evening: false },
      Sunday: { morning: false, afternoon: false, evening: false }
    }
  }
];

// Search helper functions
export function searchDoctors(query: string): Doctor[] {
  const searchTerm = query.toLowerCase();
  return doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm) ||
    doctor.specialty.toLowerCase().includes(searchTerm) ||
    doctor.area.toLowerCase().includes(searchTerm) ||
    doctor.city.toLowerCase().includes(searchTerm)
  );
}

export function filterDoctors(filters: {
  specialty?: string;
  city?: string;
  area?: string;
  rating?: number;
  available?: boolean;
}): Doctor[] {
  return doctors.filter(doctor => {
    if (filters.specialty && doctor.specialty !== filters.specialty) return false;
    if (filters.city && doctor.city !== filters.city) return false;
    if (filters.area && doctor.area !== filters.area) return false;
    if (filters.rating && doctor.rating < filters.rating) return false;
    if (filters.available !== undefined && doctor.available !== filters.available) return false;
    return true;
  });
}

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