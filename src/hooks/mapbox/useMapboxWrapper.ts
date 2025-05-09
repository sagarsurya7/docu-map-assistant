
import { useState, useRef, useCallback, useEffect } from 'react';
import { Doctor } from '@/types';
import { useMapbox } from './useMapbox';
import { toast } from '@/components/ui/use-toast';
import { isCleanupInProgress } from './utils';

export const useMapboxWrapper = (
  doctors: Doctor[],
  selectedDoctor: Doctor | null,
  onCriticalError?: ((error: string) => void) | null,
  componentId = 'mapbox-wrapper'
) => {
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const updateMarkersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const markersUpdatedRef = useRef(false);
  const initialMarkersSet = useRef(false);
  const errorRetryCount = useRef(0);
  const hasCleanedUp = useRef(false);
  const [mapStabilized, setMapStabilized] = useState(false);
  const lastDoctorsRef = useRef<Doctor[]>(doctors);
  const lastSelectedDoctorRef = useRef<Doctor | null>(selectedDoctor);
  const prevSelectedDoctorIdRef = useRef<string | null>(null);
  
  // Store onCriticalError in a ref to avoid dependency changes
  const onCriticalErrorRef = useRef<((error: string) => void) | null | undefined>(null);
  
  // Only update the ref when the function changes
  useEffect(() => {
    onCriticalErrorRef.current = onCriticalError;
  }, [onCriticalError]);

  // Store current doctors and selectedDoctor in refs to avoid dependency changes
  useEffect(() => {
    lastDoctorsRef.current = doctors;
    lastSelectedDoctorRef.current = selectedDoctor;
  }, [doctors, selectedDoctor]);
  
  const handleMapInitialized = useCallback(() => {
    if (isMounted.current) {
      console.log(`[${componentId}] Map initialized callback in MapboxWrapper`);
      setIsLoading(false);
      errorRetryCount.current = 0;
      
      markersUpdatedRef.current = false;
      initialMarkersSet.current = false;
      
      // Use a ref to prevent multiple toasts
      const stabilizeTimerId = setTimeout(() => {
        if (isMounted.current) {
          console.log(`[${componentId}] Map stabilized after delay`);
          setMapStabilized(true);
        }
      }, 3000);
      
      return () => {
        clearTimeout(stabilizeTimerId);
      };
    }
  }, [componentId]);
  
  const handleMapError = useCallback((error: Error) => {
    if (isMounted.current) {
      setIsLoading(false);
      console.log(`[${componentId}] Map initialization error:`, error);
      
      if (errorRetryCount.current < 3) {
        errorRetryCount.current++;
        
        toast({
          title: "Map Error",
          description: `Retrying map initialization (attempt ${errorRetryCount.current})...`,
          variant: "destructive"
        });
        
        setTimeout(() => {
          if (isMounted.current) {
            setIsLoading(true);
            reinitializeMap();
          }
        }, 3000);
      } else {
        toast({
          title: "Map Error",
          description: error.message || "Failed to initialize map after multiple attempts",
          variant: "destructive"
        });
        
        if (onCriticalErrorRef.current) {
          try {
            const errorMessage = typeof error.message === 'string' ? error.message : "Failed to initialize map";
            onCriticalErrorRef.current(errorMessage);
          } catch (e) {
            console.error("Error calling onCriticalError:", e);
          }
        }
      }
    }
  }, [componentId]);
  
  const { 
    mapRef, 
    map,
    isMapInitialized, 
    mapError, 
    updateMarkers, 
    reinitializeMap,
    flyTo
  } = useMapbox({
    onMapInitialized: handleMapInitialized,
    onMapError: handleMapError,
    componentId
  });
  
  // Effect to set initial markers after map is stabilized - RUNS ONCE
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isMapInitialized && map && doctors.length > 0 && !initialMarkersSet.current && mapStabilized) {
      console.log(`[${componentId}] Initial map markers setup after stabilization`);
      
      initialMarkersSet.current = true;
      
      timer = setTimeout(() => {
        if (isMounted.current && map) {
          console.log(`[${componentId}] Executing initial marker update`);
          markersUpdatedRef.current = true;
          try {
            updateMarkers(doctors, selectedDoctor);
          } catch (error) {
            console.error(`[${componentId}] Error in initial marker update:`, error);
          }
        }
      }, 500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMapInitialized, map, mapStabilized, componentId, updateMarkers, doctors, selectedDoctor]); 
  
  // Track selected doctor changes and fly to location
  useEffect(() => {
    if (!map || !isMapInitialized || !mapStabilized) {
      return;
    }

    const currentSelectedId = selectedDoctor?.id || null;
    
    if (prevSelectedDoctorIdRef.current !== currentSelectedId && selectedDoctor) {
      console.log(`[${componentId}] Doctor selection changed: ${prevSelectedDoctorIdRef.current} -> ${currentSelectedId}`);
      prevSelectedDoctorIdRef.current = currentSelectedId;
      
      // Always update markers when selection changes
      try {
        updateMarkers(doctors, selectedDoctor);
        
        // Explicitly fly to the selected doctor's location
        if (selectedDoctor?.location) {
          console.log(`[${componentId}] Flying to doctor: ${selectedDoctor.id} at ${selectedDoctor.location.lat},${selectedDoctor.location.lng}`);
          
          setTimeout(() => {
            if (isMounted.current && map) {
              flyTo(selectedDoctor.location.lng, selectedDoctor.location.lat);
            }
          }, 200);
        }
      } catch (error) {
        console.error(`[${componentId}] Error updating markers or flying:`, error);
      }
    }
  }, [selectedDoctor, map, isMapInitialized, mapStabilized, componentId, updateMarkers, doctors, flyTo]);

  useEffect(() => {
    console.log(`[${componentId}] MapboxWrapper mounted`);
    isMounted.current = true;
    errorRetryCount.current = 0;
    hasCleanedUp.current = false;
    
    return () => {
      console.log(`[${componentId}] MapboxWrapper unmounting - ACTUAL UNMOUNT`);
      hasCleanedUp.current = true;
      isMounted.current = false;
      
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
        updateMarkersTimeoutRef.current = null;
      }
    };
  }, [componentId]);

  const handleManualRetry = useCallback(() => {
    if (isMounted.current) {
      setIsLoading(true);
      markersUpdatedRef.current = false;
      initialMarkersSet.current = false;
      setMapStabilized(false);
      errorRetryCount.current = 0;
      reinitializeMap();
    }
  }, [reinitializeMap]);

  return {
    mapRef,
    isLoading,
    mapError,
    isMapInitialized,
    handleManualRetry
  };
};
