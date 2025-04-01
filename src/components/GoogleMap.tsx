
import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  
  // Use a stable key for the map instead of changing on every error
  // Only change this when we explicitly need to force a remount
  const [mapKey, setMapKey] = useState(() => Date.now());
  
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
      
      // Clean up immediately rather than deferring with setTimeout
      resetMapState();
    };
  }, []);

  // Handle critical errors by forcing a remount - use useCallback to stabilize
  const handleCriticalError = useCallback((error: string) => {
    if (isMounted.current) {
      console.error(`Critical map error: ${error}. Forcing remount.`);
      setMapError(error);
      
      // Reset map state and recreate component
      resetMapState();
      setMapKey(Date.now()); // Use state setter instead of directly modifying ref
    }
  }, []);

  // Use a stable memo to prevent unnecessary rerenders of MapboxWrapper
  // Only rerender when key props change
  return (
    <div className="h-full relative">
      <MapboxWrapper
        key={mapKey}
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        onSelectDoctor={onSelectDoctor}
        onCriticalError={handleCriticalError}
      />
    </div>
  );
};

export default React.memo(GoogleMap);
