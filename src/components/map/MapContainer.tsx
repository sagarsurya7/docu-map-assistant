
import React from 'react';
import MapStyles from './MapStyles';
import LoadingIndicator from './LoadingIndicator';
import MapError from './MapError';
import DoctorInfoCard from './DoctorInfoCard';
import { Doctor } from '@/types';
import { toast } from '@/components/ui/use-toast';

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
  // Show a toast notification when the map is initialized
  React.useEffect(() => {
    if (isMapInitialized && !isLoading) {
      toast({
        title: "Map Ready",
        description: "The map is now fully loaded and stable.",
        duration: 3000,
      });
    }
  }, [isMapInitialized, isLoading]);

  // Use a safe reference to the DOM element
  const mapContainerRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node && mapRef.current !== node) {
      // Only update if the ref has changed
      if (mapRef.current) {
        // Clean existing ref data to avoid potential memory/reference issues
        (mapRef as any).current = null;
      }
      
      // Set the new ref
      (mapRef as any).current = node;
    }
  }, [mapRef]);

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
          <div ref={mapContainerRef} className="h-full w-full mapbox-container"></div>
          {isLoading && <LoadingIndicator />}
          {!isLoading && isMapInitialized && (
            <div className="absolute top-4 left-4 bg-white/80 px-4 py-2 rounded-md shadow-md text-sm font-medium animate-pulse">
              Map is loading and stabilizing, locations will appear soon...
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
