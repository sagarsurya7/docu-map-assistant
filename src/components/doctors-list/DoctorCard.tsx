
import React from 'react';
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
import { getDoctorImage, getFallbackImage } from '@/utils/doctorImageUtils';

interface DoctorCardProps {
  doctor: Doctor;
  isSelected: boolean;
  onSelect: (doctor: Doctor) => void;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, isSelected, onSelect }) => {
  const isFemale = doctor.name.includes("Dr. ") && 
    ["Priya", "Meera", "Anjali", "Neha"].some(name => doctor.name.includes(name));
  
  const gender = isFemale ? 'female' : 'male';
  const profileImage = doctor.imageUrl || getDoctorImage(doctor.id, gender);
  
  return (
    <Card 
      key={doctor.id} 
      className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${
        isSelected ? 'border-medical border-2' : ''
      }`}
      onClick={() => onSelect(doctor)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              <img 
                src={profileImage}
                alt={doctor.name} 
                className="h-10 w-10 rounded-full object-cover" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackImage(gender);
                }}
              />
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
