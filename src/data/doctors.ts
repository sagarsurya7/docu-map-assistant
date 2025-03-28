
import { Doctor } from '../types';

export const doctors: Doctor[] = [
  {
    id: 1,
    name: "Dr. Rajesh Sharma",
    specialty: "Cardiologist",
    address: "123 MG Road, Pune, India 411001",
    location: {
      lat: 18.5204,
      lng: 73.8567
    },
    rating: 4.8,
    reviews: 126,
    description: "Specialist in cardiovascular health with over 15 years of experience.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    available: true
  },
  {
    id: 2,
    name: "Dr. Priya Patel",
    specialty: "Pediatrician",
    address: "456 FC Road, Pune, India 411005",
    location: {
      lat: 18.5281,
      lng: 73.8414
    },
    rating: 4.7,
    reviews: 98,
    description: "Child healthcare specialist with expertise in childhood development.",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    available: true
  },
  {
    id: 3,
    name: "Dr. Vikram Desai",
    specialty: "Orthopedic Surgeon",
    address: "789 Baner Road, Pune, India 411045",
    location: {
      lat: 18.5642,
      lng: 73.7769
    },
    rating: 4.5,
    reviews: 87,
    description: "Specializes in bone and joint treatments and surgical procedures.",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    available: false
  },
  {
    id: 4,
    name: "Dr. Sunita Joshi",
    specialty: "Dermatologist",
    address: "234 Koregaon Park, Pune, India 411001",
    location: {
      lat: 18.5362,
      lng: 73.8932
    },
    rating: 4.9,
    reviews: 143,
    description: "Expert in skin conditions and cosmetic dermatology.",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    available: true
  },
  {
    id: 5,
    name: "Dr. Amit Agarwal",
    specialty: "Neurologist",
    address: "567 Kalyani Nagar, Pune, India 411006",
    location: {
      lat: 18.5489,
      lng: 73.9089
    },
    rating: 4.6,
    reviews: 112,
    description: "Specializing in disorders of the nervous system including brain and spinal cord.",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    available: true
  },
  {
    id: 6,
    name: "Dr. Meera Shah",
    specialty: "Gynecologist",
    address: "890 Aundh, Pune, India 411007",
    location: {
      lat: 18.5679,
      lng: 73.8077
    },
    rating: 4.8,
    reviews: 156,
    description: "Women's health specialist with focus on reproductive health.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    available: true
  },
  {
    id: 7,
    name: "Dr. Kunal Mehta",
    specialty: "Psychiatrist",
    address: "432 Viman Nagar, Pune, India 411014",
    location: {
      lat: 18.5679,
      lng: 73.9143
    },
    rating: 4.7,
    reviews: 89,
    description: "Mental health specialist trained in diagnosis and treatment of mental illness.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    available: false
  },
  {
    id: 8,
    name: "Dr. Ananya Singh",
    specialty: "Endocrinologist",
    address: "765 Hadapsar, Pune, India 411028",
    location: {
      lat: 18.5089,
      lng: 73.9260
    },
    rating: 4.5,
    reviews: 76,
    description: "Specialist in hormonal imbalances and related diseases.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    available: true
  }
];
