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
  gender?: 'male' | 'female';
  image?: string;
  description?: string;
  reviews?: any[];  // Adding reviews property to fix the TypeScript errors
  location?: {
    lat: number;
    lng: number;
  };
  availability?: {
    [key: string]: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
}

// Add ChatMessage interface that's being imported in multiple files
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  actions?: {
    type: 'see_on_map';
    doctorId?: string;
    doctorName?: string;
    location?: {
      lat: number;
      lng: number;
    };
  }[];
}
