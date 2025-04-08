
import React, { useEffect, memo } from 'react';
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
  // Using a ref to track initial load to prevent multiple toasts
  const initializedToastShown = React.useRef(false);
  
  useEffect(() => {
    if (isMapInitialized && !isLoading && !initializedToastShown.current) {
      initializedToastShown.current = true;
      toast({
        title: "Map Ready",
        description: "The map is now fully loaded and stable.",
        duration: 3000,
      });
    }
  }, [isMapInitialized, isLoading]);

  // Use a mutable ref for DOM assignment - handling it in a safe, serializable way
  const mapContainerRef = React.useCallback((node: HTMLDivElement | null) => {
    // Using safe object assignment to avoid circular references
    if (mapRef && typeof mapRef === 'object') {
      // Safely update the current property
      Object.defineProperty(mapRef, 'current', {
        writable: true,
        value: node
      });
    }
  }, [mapRef]);

  // Loading message shown only once after map initialization
  const [showStabilizingMessage, setShowStabilizingMessage] = React.useState(false);
  
  React.useEffect(() => {
    if (!isLoading && isMapInitialized) {
      setShowStabilizingMessage(true);
      // Hide stabilizing message after 5 seconds
      const timer = setTimeout(() => {
        setShowStabilizingMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isMapInitialized, isLoading]);

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
          {showStabilizingMessage && (
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

export default memo(MapContainer);
