
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
