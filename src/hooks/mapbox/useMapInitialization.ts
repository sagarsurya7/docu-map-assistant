
import { useRef, useState, useCallback } from 'react';
import { useMapboxLoading } from './useMapboxLoading';
import { useMapInstance } from './useMapInstance';
import { useMapError } from './useMapError';

export const useMapInitialization = (
  mapRef: React.RefObject<HTMLDivElement>,
  map: any,
  setMap: React.Dispatch<React.SetStateAction<any>>,
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
    if (!mapRef.current || mapInitialized.current || !mountedRef.current) {
      console.log("Skipping map initialization", {
        mapRefExists: !!mapRef.current,
        alreadyInitialized: mapInitialized.current,
        mounted: mountedRef.current
      });
      return null;
    }
    
    try {
      console.log("Starting map initialization process");
      
      // Load Mapbox library first
      await loadMapboxWithTimeout(mountedRef);
      
      if (!mountedRef.current) {
        console.log("Component unmounted during Mapbox loading");
        return null;
      }
      
      console.log("Mapbox library loaded, creating map instance");
      
      // Create map instance
      const mapInstance = await createMapInstance(window.mapboxgl, mapRef, mountedRef);
      
      if (!mountedRef.current) {
        console.log("Component unmounted before map instance could be used");
        return null;
      }
      
      console.log("Map instance created successfully, updating state", mapInstance);
      
      // Update state
      setMap(mapInstance);
      setIsMapInitialized(true);
      setMapError(null);
      mapInitialized.current = true;
      
      // Notify parent component
      if (onMapInitialized) {
        onMapInitialized(mapInstance);
      }
      
      return mapInstance;
    } catch (error) {
      if (!mountedRef.current) {
        console.log("Component unmounted during error handling");
        return null;
      }
      
      console.error("Map initialization failed:", error);
      
      const errorMessage = typeof error === 'string' 
        ? error 
        : "Failed to initialize the map. Please ensure your Mapbox token is valid.";
      
      handleMapError(errorMessage);
      return null;
    }
  }, [
    mapRef, 
    setMap,
    onMapInitialized, 
    loadMapboxWithTimeout, 
    createMapInstance, 
    setMapError, 
    handleMapError
  ]);

  // Function to reinitialize the map (useful when token changes)
  const reinitializeMap = useCallback(() => {
    if (!mountedRef.current) {
      console.log("Not reinitializing map, component unmounted");
      return;
    }
    
    console.log("Reinitializing map");
    setIsMapInitialized(false);
    setMapError(null);
    mapInitialized.current = false;
    
    // Initialize new map after a short delay
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        console.log("Calling initMap from reinitializeMap");
        initMap().catch(error => {
          console.error("Map reinitialization failed:", error);
        });
      }
    }, 200);
    
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
