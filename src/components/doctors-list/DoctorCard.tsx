
import React, { useCallback } from 'react';
import { Doctor } from '@/types';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, MessageSquare, Calendar } from 'lucide-react';
import { getDoctorImage, markImageAsFailed, getFallbackImage } from '@/utils/doctorImageUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DoctorCardProps {
  doctor: Doctor;
  isSelected: boolean;
  onSelect: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isSelected, onSelect }) => {
  // Guard to prevent rendering issues with invalid doctor data
  if (!doctor || !doctor.name) {
    console.warn("Invalid doctor data received in DoctorCard");
    return null;
  }
  
  // Determine gender based on name or use the gender field if available
  const inferGender = (): 'male' | 'female' => {
    if (doctor.gender) return doctor.gender;
    
    // Infer from name if gender is not provided
    return (doctor.name.includes("Dr. ") && 
      ["Priya", "Meera", "Anjali", "Neha", "Alice", "Emily", "Linda"].some(name => doctor.name.includes(name)))
      ? 'female' 
      : 'male';
  };
  
  const gender = inferGender();
  
  // Use a more reliable image selection approach
  const profileImage = doctor.imageUrl || getDoctorImage(doctor.id, gender);
  const fallbackImg = getFallbackImage(gender);
  
  // Handle image error with memoization to avoid re-renders
  const handleImageError = useCallback(() => {
    console.log(`Image error for ${doctor.id}, using fallback: ${fallbackImg}`);
    markImageAsFailed(doctor.id, gender);
  }, [doctor.id, gender, fallbackImg]);
  
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${
        isSelected ? 'border-medical border-2' : ''
      }`}
      onClick={() => onSelect(doctor)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              <Avatar>
                <AvatarImage
                  src={profileImage}
                  alt={doctor.name}
                  onError={handleImageError}
                />
                <AvatarFallback>
                  {doctor.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-base">{doctor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" fill="currentColor" />
            <span className="text-sm font-medium">{doctor.rating}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3 pt-0">
        <div className="flex items-start text-sm text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
          <span>{doctor.address}</span>
        </div>
        <div className="flex items-center mt-2">
          <Badge 
            variant="outline" 
            className={`${doctor.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            {doctor.available ? 'Available Today' : 'Not Available Today'}
          </Badge>
          <Badge 
            variant="outline"
            className="ml-2"
          >
            ₹{doctor.consultationFee}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button size="sm" variant="outline" className="flex-1">
          <Calendar className="h-4 w-4 mr-1" />
          Book
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          <MessageSquare className="h-4 w-4 mr-1" />
          Chat
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorCard;
