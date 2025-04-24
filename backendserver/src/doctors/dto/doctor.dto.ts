
import { IsString, IsNumber, IsBoolean, IsArray, IsOptional, Min, Max, IsEnum, IsObject } from 'class-validator';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class DoctorDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  specialty: string;

  @IsString()
  address: string;

  @IsString()
  area: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNumber()
  @Min(0)
  experience: number;

  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @IsArray()
  @IsString({ each: true })
  education: string[];

  @IsBoolean()
  available: boolean;

  @IsNumber()
  @Min(0)
  consultationFee: number;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: 'male' | 'female';

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  reviews?: any[];

  @IsOptional()
  @IsObject()
  location?: {
    lat: number;
    lng: number;
  };

  @IsOptional()
  @IsObject()
  availability?: {
    [key: string]: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
  };
}

export class FilterOptionsDto {
  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @IsArray()
  @IsString({ each: true })
  cities: string[];

  @IsArray()
  @IsString({ each: true })
  areas: string[];
}

export class DoctorFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
  
  @IsOptional()
  @IsString()
  specialty?: string;
  
  @IsOptional()
  @IsString()
  city?: string;
  
  @IsOptional()
  @IsString()
  area?: string;
  
  @IsOptional()
  @IsNumber()
  rating?: number;
  
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
