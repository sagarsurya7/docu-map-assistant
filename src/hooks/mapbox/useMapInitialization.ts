
import { useRef, useState, useCallback } from 'react';
import { useMapboxLoading } from './useMapboxLoading';
import { useMapInstance } from './useMapInstance';
import { useMapError } from './useMapError';

export const useMapInitialization = (
  mapRef: React.RefObject<HTMLDivElement>,
  map: any,
  onMapInitialized?: (mapInstance: any) => void,
  onMapError?: (error: Error) => void
) => {
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const mapInitialized = useRef(false);
  const mountedRef = useRef(true);
  
  // Use the map loading hook
  const { loadMapboxWithTimeout } = useMapboxLoading();
  
  // Use the map instance creation hook
  const { createMapInstance } = useMapInstance(map);
  
  // Use the map error handling hook
  const { mapError, setMapError, handleMapError } = useMapError(onMapError);
  
  // Function to initialize the map
  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInitialized.current || !mountedRef.current) return;
    
    try {
      console.log("Starting map initialization");
      
      // Load Mapbox library first
      await loadMapboxWithTimeout(mountedRef);
      
      if (!mountedRef.current) return;
      
      // Create map instance
      const mapInstance = await createMapInstance(window.mapboxgl, mapRef, mountedRef);
      
      if (!mountedRef.current) return;
      
      // Update state
      setIsMapInitialized(true);
      setMapError(null);
      mapInitialized.current = true;
      
      // Notify parent component
      if (onMapInitialized) {
        onMapInitialized(mapInstance);
      }
      
      return mapInstance;
    } catch (error) {
      if (!mountedRef.current) return;
      
      console.error("Map initialization failed:", error);
      
      const errorMessage = typeof error === 'string' 
        ? error 
        : "Failed to initialize the map. Please ensure your Mapbox token is valid.";
      
      handleMapError(errorMessage);
      throw error;
    }
  }, [
    mapRef, 
    onMapInitialized, 
    loadMapboxWithTimeout, 
    createMapInstance, 
    setMapError, 
    handleMapError
  ]);

  // Function to reinitialize the map (useful when token changes)
  const reinitializeMap = useCallback(() => {
    if (!mountedRef.current) return;
    
    setIsMapInitialized(false);
    setMapError(null);
    mapInitialized.current = false;
    
    // Initialize new map after a short delay
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        initMap();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initMap, setMapError]);
  
  return {
    isMapInitialized,
    mapError,
    setMapError,
    initMap,
    reinitializeMap,
    mountedRef
  };
};
