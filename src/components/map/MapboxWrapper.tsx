
import React, { useEffect, useState, useRef } from 'react';
import { Doctor } from '@/types';
import DoctorInfoCard from './DoctorInfoCard';
import MapError from './MapError';
import MapStyles from './MapStyles';
import { useMapbox } from '@/hooks/mapbox/useMapbox';
import { toast } from '@/components/ui/use-toast';
import { isCleanupInProgress } from '@/hooks/mapbox/utils';

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
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const updateMarkersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const markersUpdatedRef = useRef(false);
  const initialMarkersSet = useRef(false);
  const errorRetryCount = useRef(0);
  const componentId = useRef(`mapbox-${Date.now()}`);
  
  console.log(`[${componentId.current}] MapboxWrapper rendering`);

  // Track if we've already cleaned up
  const hasCleanedUp = useRef(false);
  
  // Initialize Mapbox with callbacks
  const { 
    mapRef, 
    map,
    isMapInitialized, 
    mapError, 
    updateMarkers, 
    reinitializeMap 
  } = useMapbox({
    onMapInitialized: (mapInstance) => {
      if (isMounted.current) {
        console.log(`[${componentId.current}] Map initialized callback in MapboxWrapper with map`);
        setIsLoading(false);
        errorRetryCount.current = 0;
        
        // Set a flag to update markers once the map is fully initialized
        markersUpdatedRef.current = false;
        initialMarkersSet.current = false;
        
        // Show success toast
        toast({
          title: "Map Initialized",
          description: "The map has been successfully loaded.",
        });
      }
    },
    onMapError: (error) => {
      if (isMounted.current) {
        setIsLoading(false);
        console.error(`[${componentId.current}] Map initialization error:`, error);
        
        // Auto-retry up to 3 times
        if (errorRetryCount.current < 3) {
          errorRetryCount.current++;
          
          // Show retry toast
          toast({
            title: "Map Error",
            description: `Retrying map initialization (attempt ${errorRetryCount.current})...`,
            variant: "destructive"
          });
          
          // Wait before retrying
          setTimeout(() => {
            if (isMounted.current) {
              setIsLoading(true);
              reinitializeMap();
            }
          }, 3000);
        } else {
          // Show error toast after all retries failed
          toast({
            title: "Map Error",
            description: error.message || "Failed to initialize map after multiple attempts",
            variant: "destructive"
          });
        }
      }
    },
    componentId: componentId.current
  });
  
  // Update markers when map is initialized with a delay
  useEffect(() => {
    if (isMapInitialized && map && !initialMarkersSet.current && doctors.length > 0) {
      console.log(`[${componentId.current}] Initial map markers setup`);
      
      // Mark that we've scheduled the initial update
      initialMarkersSet.current = true;
      
      // Add markers after a delay to ensure map is fully ready
      const timer = setTimeout(() => {
        if (isMounted.current && map) {
          console.log(`[${componentId.current}] Executing initial marker update`);
          markersUpdatedRef.current = true;
          try {
            updateMarkers(doctors, selectedDoctor);
          } catch (error) {
            console.error(`[${componentId.current}] Error in initial marker update:`, error);
          }
        }
      }, 1000); // Increased delay for initial markers
      
      return () => clearTimeout(timer);
    }
  }, [isMapInitialized, map, doctors, selectedDoctor, updateMarkers]);
  
  // Update markers when doctors or selected doctor changes
  useEffect(() => {
    // Skip if initial markers haven't been set yet
    if (!markersUpdatedRef.current) {
      return;
    }
    
    // Clear any existing timeout
    if (updateMarkersTimeoutRef.current) {
      clearTimeout(updateMarkersTimeoutRef.current);
      updateMarkersTimeoutRef.current = null;
    }
    
    if (isMapInitialized && map && doctors.length > 0 && isMounted.current) {
      console.log(`[${componentId.current}] Scheduling marker update for doctor/selection change`, { 
        initialized: isMapInitialized, 
        doctorsCount: doctors.length,
        selectedDoctor: selectedDoctor?.id,
        mapExists: !!map
      });
      
      // Add delay to ensure map is ready
      updateMarkersTimeoutRef.current = setTimeout(() => {
        if (isMounted.current && map) {
          console.log(`[${componentId.current}] Executing scheduled marker update`);
          try {
            updateMarkers(doctors, selectedDoctor);
          } catch (error) {
            console.error(`[${componentId.current}] Error updating markers:`, error);
          }
        } else {
          console.log(`[${componentId.current}] Component unmounted or map not available, skipping marker update`);
        }
      }, 500);
    } else {
      console.log(`[${componentId.current}] Not updating markers due to conditions not met`, { 
        initialized: isMapInitialized, 
        doctorsCount: doctors.length,
        isMounted: isMounted.current,
        mapExists: !!map
      });
    }
    
    return () => {
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
        updateMarkersTimeoutRef.current = null;
      }
    };
  }, [isMapInitialized, doctors, selectedDoctor, updateMarkers, map]);

  // Cleanup on mount/unmount
  useEffect(() => {
    console.log(`[${componentId.current}] MapboxWrapper mounted`);
    isMounted.current = true;
    errorRetryCount.current = 0;
    hasCleanedUp.current = false;
    
    return () => {
      // Skip cleanup if it's already in progress or completed
      if (hasCleanedUp.current || isCleanupInProgress()) {
        console.log(`[${componentId.current}] Cleanup already done or in progress, skipping`);
        return;
      }
      
      console.log(`[${componentId.current}] MapboxWrapper unmounting - ACTUAL UNMOUNT`);
      hasCleanedUp.current = true;
      isMounted.current = false;
      
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
        updateMarkersTimeoutRef.current = null;
      }
    };
  }, []);

  // If there's an error and we've exceeded retry attempts, provide a manual retry option
  const handleManualRetry = () => {
    if (isMounted.current) {
      setIsLoading(true);
      markersUpdatedRef.current = false;
      initialMarkersSet.current = false;
      errorRetryCount.current = 0;
      reinitializeMap();
    }
  };

  // Only re-render when really needed
  console.log(`[${componentId.current}] MapboxWrapper rendering complete`);

  return (
    <div className="h-full relative">
      <MapStyles />
      {mapError ? (
        <MapError 
          message={mapError} 
          onRetry={handleManualRetry}
        />
      ) : (
        <>
          <div ref={mapRef} className="h-full w-full mapbox-container"></div>
          {isLoading && (
            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical mb-4"></div>
                <p className="text-medical-dark">Loading map...</p>
              </div>
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

export default MapboxWrapper;
