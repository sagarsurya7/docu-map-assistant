
import { useState, useRef, useCallback, useEffect } from 'react';
import { Doctor } from '@/types';
import { useMapbox } from './useMapbox';
import { toast } from '@/components/ui/use-toast';
import { isCleanupInProgress, resetMapState } from './utils';

export const useMapboxWrapper = (
  doctors: Doctor[],
  selectedDoctor: Doctor | null,
  onCriticalError?: (error: string) => void,
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
  const onCriticalErrorRef = useRef(onCriticalError);
  
  // Update ref when onCriticalError changes to avoid dependency issues
  useEffect(() => {
    onCriticalErrorRef.current = onCriticalError;
  }, [onCriticalError]);
  
  // Memoize the callbacks passed to useMapbox to prevent unnecessary reinitializations
  const handleMapInitialized = useCallback((mapInstance: any) => {
    if (isMounted.current) {
      console.log(`[${componentId}] Map initialized callback in MapboxWrapper with map`);
      setIsLoading(false);
      errorRetryCount.current = 0;
      
      // Set a flag to update markers once the map is fully initialized
      markersUpdatedRef.current = false;
      initialMarkersSet.current = false;
      
      // Set a timer to mark the map as stabilized after 3 seconds
      setTimeout(() => {
        if (isMounted.current) {
          console.log(`[${componentId}] Map stabilized after delay`);
          setMapStabilized(true);
          
          // Show success toast
          toast({
            title: "Map Ready",
            description: "The map has been loaded and is ready to show locations.",
          });
        }
      }, 3000);
      
      // Show initial loading toast
      toast({
        title: "Map Initialized",
        description: "The map has been successfully loaded. Preparing locations...",
      });
    }
  }, [componentId]);
  
  const handleMapError = useCallback((error: Error) => {
    if (isMounted.current) {
      setIsLoading(false);
      console.error(`[${componentId}] Map initialization error:`, error);
      
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
        
        // Notify parent of critical error via ref to avoid dependency issues
        if (onCriticalErrorRef.current) {
          onCriticalErrorRef.current(error.message || "Failed to initialize map");
        }
      }
    }
  }, [componentId]);
  
  // Initialize Mapbox with memoized callbacks
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
  
  // Update markers when map is initialized with a delay - ALWAYS called, never conditional
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isMapInitialized && map && doctors.length > 0 && !initialMarkersSet.current && mapStabilized) {
      console.log(`[${componentId}] Initial map markers setup after stabilization`);
      
      // Mark that we've scheduled the initial update
      initialMarkersSet.current = true;
      
      // Add markers after the map has stabilized
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
      }, 500); // Small additional delay after stabilization
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMapInitialized, map, doctors, selectedDoctor, updateMarkers, componentId, mapStabilized]);
  
  // Use useCallback for marker updates to stabilize the effect dependency
  const updateMarkersWithDebounce = useCallback(() => {
    // Skip if initial markers haven't been set yet or map is not stabilized
    if (!markersUpdatedRef.current || !mapStabilized) {
      return;
    }
    
    // Clear any existing timeout
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
      
      // Add delay to ensure map is ready
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
  
  // Update markers when doctors or selected doctor changes - with stabilized callback
  useEffect(() => {
    updateMarkersWithDebounce();
    
    return () => {
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
        updateMarkersTimeoutRef.current = null;
      }
    };
  }, [updateMarkersWithDebounce]);

  // This effect is ALWAYS called regardless of any conditions - prevents hooks from changing between renders
  useEffect(() => {
    console.log(`[${componentId}] MapboxWrapper mounted`);
    // Reset global state on mount to ensure clean initialization
    resetMapState(); 
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
      
      // Skip cleanup if it's already in progress or completed
      if (isCleanupInProgress()) {
        console.log(`[${componentId}] Cleanup already in progress, skipping`);
      }
    };
  }, [componentId]);

  // Memoize handleManualRetry to prevent recreation on each render
  const handleManualRetry = useCallback(() => {
    if (isMounted.current) {
      setIsLoading(true);
      markersUpdatedRef.current = false;
      initialMarkersSet.current = false;
      setMapStabilized(false);
      errorRetryCount.current = 0;
      resetMapState(); // Add this to ensure we start fresh
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
