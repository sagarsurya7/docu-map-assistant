
import React, { useState, useEffect, useRef } from 'react';
import { Doctor } from '@/types';
import MapboxWrapper from './map/MapboxWrapper';
import { resetMapState } from '@/hooks/mapbox/utils';

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
  
  // Use ref instead of state to prevent unnecessary remounts
  const mapKeyRef = useRef(Date.now());
  
  // Track if component is mounted
  const isMounted = useRef(true);
  
  // Reset map state on component mount/unmount
  useEffect(() => {
    isMounted.current = true;
    console.log("GoogleMap component mounted");
    
    // Reset map state on mount to ensure clean state
    resetMapState();
    
    return () => {
      console.log("GoogleMap component ACTUAL unmount");
      isMounted.current = false;
      
      // Allow some time for child components to clean up properly
      setTimeout(() => {
        // Reset map state again after unmount to ensure we start fresh next time
        resetMapState();
      }, 300);
    };
  }, []);

  // Handle critical errors by forcing a remount
  const handleCriticalError = (error: string) => {
    if (isMounted.current) {
      console.error(`Critical map error: ${error}. Forcing remount.`);
      setMapError(error);
      
      // Reset map state and recreate component
      resetMapState();
      mapKeyRef.current = Date.now();
    }
  };

  return (
    <div className="h-full relative">
      <MapboxWrapper
        key={mapKeyRef.current}
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        onSelectDoctor={onSelectDoctor}
      />
    </div>
  );
};

export default GoogleMap;
