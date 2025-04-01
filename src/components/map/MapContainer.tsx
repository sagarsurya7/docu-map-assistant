
import React from 'react';
import MapStyles from './MapStyles';
import LoadingIndicator from './LoadingIndicator';
import MapError from './MapError';
import DoctorInfoCard from './DoctorInfoCard';
import { Doctor } from '@/types';

interface MapContainerProps {
  mapRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  mapError: string | null;
  selectedDoctor: Doctor | null;
  isMapInitialized: boolean;
  onRetry: () => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  mapRef,
  isLoading,
  mapError,
  selectedDoctor,
  isMapInitialized,
  onRetry
}) => {
  return (
    <div className="h-full relative">
      <MapStyles />
      {mapError ? (
        <MapError 
          message={mapError} 
          onRetry={onRetry}
        />
      ) : (
        <>
          <div ref={mapRef} className="h-full w-full mapbox-container"></div>
          {isLoading && <LoadingIndicator />}
          {!isLoading && isMapInitialized && (
            <div className="absolute top-4 left-4 bg-white/80 px-4 py-2 rounded-md shadow-md text-sm font-medium animate-pulse">
              Map is stabilizing, locations will appear soon...
            </div>
          )}
        </>
      )}
      {selectedDoctor && !mapError && isMapInitialized && !isLoading && (
        <DoctorInfoCard 
          doctor={selectedDoctor} 
          className="absolute bottom-4 left-4 w-64 shadow-lg" 
        />
      )}
    </div>
  );
};

export default MapContainer;
