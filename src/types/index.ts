
export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  rating: number;
  reviews: number;
  description: string;
  image: string;
  available: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
