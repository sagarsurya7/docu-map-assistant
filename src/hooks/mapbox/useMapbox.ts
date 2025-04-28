
import { useRef, useState, useEffect } from 'react';
import { Doctor } from '@/types';
import { UseMapboxProps } from './types';
import { useMapInitialization } from './useMapInitialization';
import { useMapMarkers } from './useMapMarkers';
import { markCleanupInProgress, markCleanupComplete, isMapValid } from './utils';

export const useMapbox = ({ onMapInitialized, onMapError, componentId = 'unknown' }: UseMapboxProps & { componentId?: string } = {}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const mountedRef = useRef(true);
  const mapUpdateScheduled = useRef(false);
  const hasBeenCleanedUp = useRef(false);
  
  // Use the map initialization hook
  const {
    isMapInitialized,
    mapError,
    setMapError,
    initMap,
    reinitializeMap
  } = useMapInitialization(mapRef, map, setMap, (mapInstance) => {
    console.log(`[${componentId}] Map initialized callback triggered with map instance:`, mapInstance);
    if (onMapInitialized) {
      onMapInitialized(mapInstance);
    }
  }, onMapError);
  
  // Use the map markers hook
  const {
    updateMarkers: updateMarkersInternal,
    cleanupMarkers
  } = useMapMarkers(map, isMapInitialized, mountedRef);
  
  // Fly to a specific location on the map
  const flyTo = (lng: number, lat: number, zoom: number = 15) => {
    if (!map || !isMapValid(map)) {
      console.log(`[${componentId}] Cannot fly to location - map not valid`);
      return;
    }
    
    try {
      console.log(`[${componentId}] Flying to location: ${lat},${lng} with zoom ${zoom}`);
      
      map.flyTo({
        center: [lng, lat],
        zoom: zoom,
        essential: true,
        duration: 1000
      });
    } catch (error) {
      console.error(`[${componentId}] Error flying to location:`, error);
    }
  };
  
  // Wrapper for updateMarkers to ensure map is passed
  const updateMarkers = (doctors: Doctor[], selectedDoctor: Doctor | null) => {
    console.log(`[${componentId}] useMapbox.updateMarkers called, map:`, map, "isMapInitialized:", isMapInitialized);
    
    if (map && isMapInitialized) {
      updateMarkersInternal(doctors, selectedDoctor);
    } else if (isMapInitialized && !map) {
      // If map should be initialized but map object is missing, schedule retry
      if (!mapUpdateScheduled.current) {
        console.log(`[${componentId}] Map should be initialized but map object is missing, scheduling retry`);
        mapUpdateScheduled.current = true;
        
        setTimeout(() => {
          mapUpdateScheduled.current = false;
          console.log(`[${componentId}] Retrying marker update after delay, map now:`, map);
          if (map && mountedRef.current) {
            updateMarkersInternal(doctors, selectedDoctor);
          }
        }, 1000);
      }
    }
  };
  
  // Initialize map on component mount
  useEffect(() => {
    console.log(`[${componentId}] useMapbox effect running, initializing map`);
    mountedRef.current = true;
    hasBeenCleanedUp.current = false;
    
    // Initialize map with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mountedRef.current && mapRef.current) {
        console.log(`[${componentId}] Calling initMap from useMapbox effect`);
        initMap().catch(error => {
          console.error(`[${componentId}] Map initialization failed:`, error);
        });
      } else {
        console.log(`[${componentId}] Component unmounted or mapRef not available, skipping initMap`);
      }
    }, 800); // Increased delay for DOM readiness
    
    // Cleanup function
    return () => {
      console.log(`[${componentId}] useMapbox cleanup running`);
      clearTimeout(timer);
      mountedRef.current = false;
      
      // Only perform cleanup once and if not already in progress
      if (hasBeenCleanedUp.current) {
        console.log(`[${componentId}] Map already cleaned up, skipping`);
        return;
      }
      
      // Mark cleanup as in progress to prevent duplicate cleanups
      if (!markCleanupInProgress()) {
        console.log(`[${componentId}] Cleanup already in progress in another instance, skipping`);
        return;
      }
      
      try {
        hasBeenCleanedUp.current = true;
        
        // Clean up markers and popups first
        cleanupMarkers();
        
        // Removed aggressive map cleanup code to prevent errors
        // We're letting the browser handle the cleanup more naturally
      } catch (error) {
        console.log(`[${componentId}] General error during cleanup:`, error);
      } finally {
        markCleanupComplete();
      }
    };
  }, [initMap, cleanupMarkers, componentId]);

  // Effect to sync the map instance when it changes
  useEffect(() => {
    console.log(`[${componentId}] Map instance changed:`, map);
  }, [map, componentId]);

  return { 
    mapRef, 
    map, 
    isMapInitialized, 
    mapError, 
    setMapError,
    updateMarkers,
    reinitializeMap,
    flyTo
  };
};
