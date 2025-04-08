
import React, { useState, useRef, memo } from 'react';
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
  const mapKey = useRef(`map-${Date.now().toString()}`).current;
  
  // Track if component is mounted
  const isMounted = useRef(true);
  
  // Safely memoize doctors array to prevent unnecessary re-renders
  const safeDoctors = React.useMemo(() => {
    return Array.isArray(doctors) ? doctors : [];
  }, [doctors]);
  
  // Handle critical errors
  const handleCriticalError = React.useCallback((error: string) => {
    if (isMounted.current) {
      console.error(`Critical map error: ${error}`);
      setMapError(error);
    }
  }, []);

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

// Use memo with custom comparison to prevent unnecessary re-renders
export default memo(GoogleMap, (prev, next) => {
  // Only re-render if selectedDoctor changes or doctors length changes
  return (
    prev.selectedDoctor?.id === next.selectedDoctor?.id &&
    (prev.doctors?.length || 0) === (next.doctors?.length || 0)
  );
});
