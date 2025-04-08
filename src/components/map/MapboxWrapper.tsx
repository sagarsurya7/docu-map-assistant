
import React, { useRef, memo, useEffect } from 'react';
import { Doctor } from '@/types';
import MapContainer from './MapContainer';
import { useMapboxWrapper } from '@/hooks/mapbox/useMapboxWrapper';

interface MapboxWrapperProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
  onCriticalError?: (error: string) => void;
}

const MapboxWrapper: React.FC<MapboxWrapperProps> = ({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor,
  onCriticalError 
}) => {
  // Create a stable identifier for this instance
  const componentId = useRef(`mapbox-${Date.now().toString()}`).current;
  
  // Use the refactored hook for map functionality
  const {
    mapRef,
    isLoading,
    mapError,
    isMapInitialized,
    handleManualRetry
  } = useMapboxWrapper(doctors, selectedDoctor, onCriticalError, componentId);

  return (
    <MapContainer
      mapRef={mapRef}
      isLoading={isLoading}
      mapError={mapError}
      selectedDoctor={selectedDoctor}
      isMapInitialized={isMapInitialized}
      onRetry={handleManualRetry}
    />
  );
};

// Use React.memo to prevent unnecessary rerenders
export default memo(MapboxWrapper);
