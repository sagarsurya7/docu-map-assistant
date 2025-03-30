
import React, { useState, useEffect } from 'react';
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
  
  // Component key to force remount if needed
  const [mapKey, setMapKey] = useState(Date.now());
  
  // Detect and handle persistent map errors
  useEffect(() => {
    if (mapError) {
      console.log(`Map error detected: ${mapError}`);
      const timer = setTimeout(() => {
        console.log("Forcing map component remount");
        setMapKey(Date.now()); // Force remount MapboxWrapper
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [mapError]);

  return (
    <div className="h-full relative">
      <MapboxWrapper
        key={mapKey}
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        onSelectDoctor={onSelectDoctor}
      />
    </div>
  );
};

export default GoogleMap;
