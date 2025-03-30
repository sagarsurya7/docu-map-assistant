
import React, { useEffect } from 'react';
import { Doctor } from '@/types';
import DoctorInfoCard from './DoctorInfoCard';
import MapError from './MapError';
import MapStyles from './MapStyles';
import { useMapbox } from '@/hooks/useMapbox';

interface MapboxWrapperProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const MapboxWrapper: React.FC<MapboxWrapperProps> = ({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor 
}) => {
  // Initialize Mapbox
  const { mapRef, isMapInitialized, mapError, updateMarkers } = useMapbox();
  
  // Update markers when doctors or selected doctor changes
  useEffect(() => {
    if (isMapInitialized && doctors.length > 0) {
      updateMarkers(doctors, selectedDoctor);
    }
  }, [isMapInitialized, doctors, selectedDoctor, updateMarkers]);

  return (
    <div className="h-full relative">
      <MapStyles />
      {mapError ? (
        <MapError message={mapError} />
      ) : (
        <div ref={mapRef} className="h-full w-full mapbox-container"></div>
      )}
      {selectedDoctor && !mapError && (
        <DoctorInfoCard 
          doctor={selectedDoctor} 
          className="absolute bottom-4 left-4 w-64 shadow-lg" 
        />
      )}
    </div>
  );
};

export default MapboxWrapper;
