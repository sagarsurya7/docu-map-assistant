
import { Doctor } from '../types';

// Sample doctors data
export const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Rajesh Kumar",
    gender: "male",
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
    location: {
      lat: 18.5489,
      lng: 73.9089
    },
    reviews: [],
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
    gender: "female",
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
    location: {
      lat: 18.5362,
      lng: 73.8932
    },
    reviews: [],
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
    gender: "male",
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
    location: {
      lat: 18.5642,
      lng: 73.7769
    },
    reviews: [],
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
    gender: "female",
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
    location: {
      lat: 18.5204,
      lng: 73.8567
    },
    reviews: [],
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
    gender: "male",
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
    location: {
      lat: 18.5679,
      lng: 73.8077
    },
    reviews: [],
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
    gender: "female",
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
    location: {
      lat: 18.5281,
      lng: 73.8414
    },
    reviews: [],
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
    gender: "male",
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
    location: {
      lat: 18.5089,
      lng: 73.9260
    },
    reviews: [],
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
    gender: "female",
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
    location: {
      lat: 18.5679,
      lng: 73.9143
    },
    reviews: [],
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
