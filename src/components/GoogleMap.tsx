
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Use a stable primitive string key for the map instead of Date object
  const [mapKey, setMapKey] = useState(() => Date.now().toString());
  
  // Track if component is mounted
  const isMounted = useRef(true);
  
  // Ensure doctors is always an array
  const safeDoctors = Array.isArray(doctors) ? doctors : [];
  
  // Simplified useEffect with minimal cleanup
  useEffect(() => {
    isMounted.current = true;
    console.log("GoogleMap component mounted");
    
    return () => {
      console.log("GoogleMap component ACTUAL unmount");
      isMounted.current = false;
    };
  }, []);

  // Handle critical errors by forcing a remount - use useCallback to stabilize
  const handleCriticalError = useCallback((error: string) => {
    if (isMounted.current) {
      console.error(`Critical map error: ${error}. Forcing remount.`);
      setMapError(error);
      
      // Create new primitive string key (never use Date objects directly)
      setMapKey(Date.now().toString());
    }
  }, []);

  // Use a stable memo to prevent unnecessary rerenders of MapboxWrapper
  // Only rerender when key props change
  return (
    <div className="h-full relative">
      <MapboxWrapper
        key={mapKey}
        doctors={safeDoctors}
        selectedDoctor={selectedDoctor}
        onSelectDoctor={onSelectDoctor}
        onCriticalError={handleCriticalError}
      />
    </div>
  );
};

export default React.memo(GoogleMap);
