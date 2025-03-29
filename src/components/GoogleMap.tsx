
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
  // Note: This component is named GoogleMap for backward compatibility,
  // but we're actually using Radar for the map services
  return (
    <GoogleMapWrapper
      doctors={doctors}
      selectedDoctor={selectedDoctor}
      onSelectDoctor={onSelectDoctor}
    />
  );
};

export default GoogleMap;
