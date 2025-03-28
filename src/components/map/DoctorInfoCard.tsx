
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Doctor } from '@/types';

interface DoctorInfoCardProps {
  doctor: Doctor;
  className?: string;
}

const DoctorInfoCard: React.FC<DoctorInfoCardProps> = ({ doctor, className }) => {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center mb-2">
          <img 
            src={doctor.image} 
            alt={doctor.name} 
            className="h-10 w-10 rounded-full mr-3 object-cover" 
          />
          <div>
            <h3 className="font-semibold text-sm">{doctor.name}</h3>
            <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{doctor.address}</p>
        <p className="text-xs">{doctor.description}</p>
      </CardContent>
    </Card>
  );
};

export default DoctorInfoCard;
