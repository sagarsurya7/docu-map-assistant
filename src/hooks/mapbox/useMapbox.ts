
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
  
  // Use the map initialization hook
  const {
    isMapInitialized,
    mapError,
    setMapError,
    initMap,
    reinitializeMap
  } = useMapInitialization(mapRef, map, setMap, onMapInitialized, onMapError);
  
  // Use the map markers hook
  const {
    updateMarkers: updateMarkersInternal,
    cleanupMarkers
  } = useMapMarkers(map, isMapInitialized, mountedRef);
  
  // Wrapper for updateMarkers to ensure map is passed
  const updateMarkers = (doctors: Doctor[], selectedDoctor: Doctor | null) => {
    console.log("useMapbox.updateMarkers called, map:", map);
    updateMarkersInternal(doctors, selectedDoctor);
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
    }, 200);
    
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
          safelyRemoveMap(map);
        }
      } catch (error) {
        console.log("General error during cleanup:", error);
      }
    };
  }, [initMap, map, cleanupMarkers]);

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
