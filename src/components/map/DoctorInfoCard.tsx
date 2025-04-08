
import React, { useCallback } from 'react';
import { Doctor } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, MessageSquare, Calendar } from 'lucide-react';
import { getDoctorImage, getFallbackImage, markImageAsFailed } from '@/utils/doctorImageUtils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DoctorInfoCardProps {
  doctor: Doctor;
  onClose?: () => void;
  onBookAppointment?: (doctor: Doctor) => void;
  className?: string;
}

const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({ 
  doctor, 
  onClose, 
  onBookAppointment,
  className = ''
}) => {
  // Add a guard clause to prevent rendering if doctor is undefined
  if (!doctor || !doctor.name) {
    console.warn("Invalid doctor data received in DoctorInfoCard");
    return null;
  }
  
  // Determine gender based on doctor data
  const genderValue = doctor.gender as 'male' | 'female' | undefined;
  const isFemale = genderValue === 'female' || (doctor.name.includes("Dr. ") && 
    ["Priya", "Meera", "Anjali", "Neha"].some(name => doctor.name.includes(name)));
  
  const gender = isFemale ? 'female' : 'male';
  
  // Use reliable image selection approach
  const profileImage = doctor.imageUrl || getDoctorImage(doctor.id, gender);
  const fallbackImg = getFallbackImage(gender);
  
  // Handle image error with memoization to avoid re-renders
  const handleImageError = useCallback(() => {
    console.log(`Image error for map card ${doctor.id}, using fallback: ${fallbackImg}`);
    markImageAsFailed(doctor.id, gender);
  }, [doctor.id, gender, fallbackImg]);
  
  return (
    <Card className={`w-full max-w-sm shadow-lg ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              <Avatar className="h-12 w-12">
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
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge 
            variant="outline" 
            className={`${doctor.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            {doctor.available ? 'Available Today' : 'Not Available Today'}
          </Badge>
          <Badge variant="outline">
            ₹{doctor.consultationFee}
          </Badge>
          <Badge variant="outline">
            {doctor.experience} years exp.
          </Badge>
        </div>
        
        {doctor.languages && doctor.languages.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Languages</p>
            <div className="flex flex-wrap gap-1">
              {doctor.languages.map((lang, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {lang}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {doctor.education && doctor.education.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-muted-foreground mb-1">Education</p>
            <ul className="text-xs list-disc list-inside">
              {doctor.education.map((edu, index) => (
                <li key={index}>{edu}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2">
        <Button 
          size="sm" 
          variant="default" 
          className="flex-1"
          onClick={() => onBookAppointment && onBookAppointment(doctor)}
        >
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

export default DoctorInfoCard;
