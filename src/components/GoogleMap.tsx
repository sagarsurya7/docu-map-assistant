
import React from 'react';
import { Doctor } from '@/types';
import MapboxWrapper from './map/MapboxWrapper';

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
    <MapboxWrapper
      doctors={doctors}
      selectedDoctor={selectedDoctor}
      onSelectDoctor={onSelectDoctor}
    />
  );
};

export default GoogleMap;
