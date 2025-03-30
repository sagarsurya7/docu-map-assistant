
import React from 'react';
import { Doctor } from '@/types';
import RadarMapWrapper from './map/RadarMapWrapper';

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
    <RadarMapWrapper
      doctors={doctors}
      selectedDoctor={selectedDoctor}
      onSelectDoctor={onSelectDoctor}
    />
  );
};

export default GoogleMap;
