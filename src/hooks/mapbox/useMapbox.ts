
import { useRef, useState, useEffect } from 'react';
import { Doctor } from '@/types';
import { UseMapboxProps } from './types';
import { useMapInitialization } from './useMapInitialization';
import { useMapMarkers } from './useMapMarkers';
import { safelyRemoveMap } from './utils';

export const useMapbox = ({ onMapInitialized, onMapError }: UseMapboxProps = {}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const mountedRef = useRef(true);
  const mapUpdateScheduled = useRef(false);
  
  // Use the map initialization hook
  const {
    isMapInitialized,
    mapError,
    setMapError,
    initMap,
    reinitializeMap
  } = useMapInitialization(mapRef, map, setMap, (mapInstance) => {
    console.log("Map initialized callback triggered with map instance:", mapInstance);
    if (onMapInitialized) {
      onMapInitialized(mapInstance);
    }
  }, onMapError);
  
  // Use the map markers hook
  const {
    updateMarkers: updateMarkersInternal,
    cleanupMarkers
  } = useMapMarkers(map, isMapInitialized, mountedRef);
  
  // Wrapper for updateMarkers to ensure map is passed
  const updateMarkers = (doctors: Doctor[], selectedDoctor: Doctor | null) => {
    console.log("useMapbox.updateMarkers called, map:", map, "isMapInitialized:", isMapInitialized);
    
    if (map && isMapInitialized) {
      updateMarkersInternal(doctors, selectedDoctor);
    } else if (isMapInitialized && !map) {
      // If map should be initialized but map object is missing, schedule retry
      if (!mapUpdateScheduled.current) {
        console.log("Map should be initialized but map object is missing, scheduling retry");
        mapUpdateScheduled.current = true;
        
        setTimeout(() => {
          mapUpdateScheduled.current = false;
          console.log("Retrying marker update after delay, map now:", map);
          if (map && mountedRef.current) {
            updateMarkersInternal(doctors, selectedDoctor);
          }
        }, 1000);
      }
    }
  };
  
  // Initialize map on component mount
  useEffect(() => {
    console.log("useMapbox effect running, initializing map");
    mountedRef.current = true;
    
    // Initialize map with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mountedRef.current && mapRef.current) {
        console.log("Calling initMap from useMapbox effect");
        initMap().catch(error => {
          console.error("Map initialization failed:", error);
        });
      } else {
        console.log("Component unmounted or mapRef not available, skipping initMap");
      }
    }, 500); // Increased delay for DOM readiness
    
    // Cleanup function
    return () => {
      console.log("useMapbox cleanup running");
      clearTimeout(timer);
      mountedRef.current = false;
      
      try {
        // Clean up markers and popups first
        cleanupMarkers();
        
        // Then remove the map
        if (map) {
          console.log("Removing map during cleanup");
          safelyRemoveMap(map);
        }
      } catch (error) {
        console.log("General error during cleanup:", error);
      }
    };
  }, [initMap, map, cleanupMarkers]);

  // Effect to sync the map instance when it changes
  useEffect(() => {
    console.log("Map instance changed:", map);
  }, [map]);

  return { 
    mapRef, 
    map, 
    isMapInitialized, 
    mapError, 
    setMapError,
    updateMarkers,
    reinitializeMap
  };
};
