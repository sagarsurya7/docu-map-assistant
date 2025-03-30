
import React from 'react';
import { Doctor } from '@/types';
import GoogleMapWrapper from './map/GoogleMapWrapper';

interface GoogleMapProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor 
}) => {
  return (
    <GoogleMapWrapper
      doctors={doctors}
      selectedDoctor={selectedDoctor}
      onSelectDoctor={onSelectDoctor}
    />
  );
};

export default GoogleMap;
