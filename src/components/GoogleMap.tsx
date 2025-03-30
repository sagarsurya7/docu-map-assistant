import React, { useState } from 'react';
import { Doctor } from '@/types';
import MapboxWrapper from './map/MapboxWrapper';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);

  // This component doesn't actually need to handle map errors anymore
  // since MapboxWrapper handles errors internally
  // but we keep the state for potential future use
  return (
    <div className="h-full relative">
      <MapboxWrapper
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        onSelectDoctor={onSelectDoctor}
      />
    </div>
  );
};

export default GoogleMap;
