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
  // Create a stable identifier for this instance (using primitive string)
  const componentId = useRef(`mapbox-${Date.now().toString()}`).current;
  const renderCountRef = useRef(0);
  
  // Log render count for debugging
  useEffect(() => {
    renderCountRef.current += 1;
    console.log(`[${componentId}] MapboxWrapper rendering #${renderCountRef.current}`);
    return () => {
      console.log(`[${componentId}] MapboxWrapper unmounting`);
    };
  });

  // Ensure doctors is an array
  const validDoctors = React.useMemo(() => {
    return Array.isArray(doctors) ? doctors : [];
  }, [doctors]);
  
  // Use the refactored hook for map functionality
  const {
    mapRef,
    isLoading,
    mapError,
    isMapInitialized,
    handleManualRetry
  } = useMapboxWrapper(validDoctors, selectedDoctor, onCriticalError, componentId);

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

// Use React.memo with custom equality function to prevent unnecessary rerenders
export default memo(MapboxWrapper, (prevProps, nextProps) => {
  // Only re-render if selectedDoctor changes or doctors length/content changes
  const selectedDoctorChanged = prevProps.selectedDoctor?.id !== nextProps.selectedDoctor?.id;
  
  // Check if doctors array length changed
  const doctorsLengthChanged = 
    (prevProps.doctors?.length || 0) !== (nextProps.doctors?.length || 0);
  
  // Skip deep comparison if length changed
  if (selectedDoctorChanged || doctorsLengthChanged) {
    return false; // Not equal, should re-render
  }
  
  // Otherwise, consider props equal (skip re-render)
  return true;
});
