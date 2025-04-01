
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
  
  const onCriticalErrorRef = useRef<((error: string) => void) | null | undefined>(null);
  
  useEffect(() => {
    onCriticalErrorRef.current = onCriticalError;
  }, [onCriticalError]);
  
  const handleMapInitialized = useCallback((mapInstance: any) => {
    if (isMounted.current) {
      console.log(`[${componentId}] Map initialized callback in MapboxWrapper with map`);
      setIsLoading(false);
      errorRetryCount.current = 0;
      
      markersUpdatedRef.current = false;
      initialMarkersSet.current = false;
      
      setTimeout(() => {
        if (isMounted.current) {
          console.log(`[${componentId}] Map stabilized after delay`);
          setMapStabilized(true);
          
          toast({
            title: "Map Ready",
            description: "The map has been loaded and is ready to show locations.",
          });
        }
      }, 3000);
      
      toast({
        title: "Map Initialized",
        description: "The map has been successfully loaded. Preparing locations...",
      });
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
    reinitializeMap 
  } = useMapbox({
    onMapInitialized: handleMapInitialized,
    onMapError: handleMapError,
    componentId
  });
  
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
            toast({
              title: "Locations Added",
              description: `Added ${doctors.length} doctor locations to the map.`,
            });
          } catch (error) {
            console.error(`[${componentId}] Error in initial marker update:`, error);
          }
        }
      }, 500);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMapInitialized, map, doctors, selectedDoctor, updateMarkers, componentId, mapStabilized]);
  
  const updateMarkersWithDebounce = useCallback(() => {
    if (!markersUpdatedRef.current || !mapStabilized) {
      return;
    }
    
    if (updateMarkersTimeoutRef.current) {
      clearTimeout(updateMarkersTimeoutRef.current);
      updateMarkersTimeoutRef.current = null;
    }
    
    if (isMapInitialized && map && doctors.length > 0 && isMounted.current) {
      console.log(`[${componentId}] Scheduling marker update for doctor/selection change`, { 
        initialized: isMapInitialized, 
        doctorsCount: doctors.length,
        selectedDoctor: selectedDoctor?.id,
        mapExists: !!map
      });
      
      updateMarkersTimeoutRef.current = setTimeout(() => {
        if (isMounted.current && map) {
          console.log(`[${componentId}] Executing scheduled marker update`);
          try {
            updateMarkers(doctors, selectedDoctor);
          } catch (error) {
            console.error(`[${componentId}] Error updating markers:`, error);
          }
        } else {
          console.log(`[${componentId}] Component unmounted or map not available, skipping marker update`);
        }
      }, 500);
    } else {
      console.log(`[${componentId}] Not updating markers due to conditions not met`, { 
        initialized: isMapInitialized, 
        doctorsCount: doctors.length,
        isMounted: isMounted.current,
        mapExists: !!map
      });
    }
  }, [isMapInitialized, map, doctors, selectedDoctor, updateMarkers, componentId, mapStabilized]);
  
  useEffect(() => {
    updateMarkersWithDebounce();
    
    return () => {
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
        updateMarkersTimeoutRef.current = null;
      }
    };
  }, [updateMarkersWithDebounce]);

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
      
      if (isCleanupInProgress()) {
        console.log(`[${componentId}] Cleanup already in progress, skipping`);
      }
      
      // Removed the resetMapState() call to avoid excessive cleanup
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
