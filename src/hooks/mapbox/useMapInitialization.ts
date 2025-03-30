
import { useRef, useState, useCallback } from 'react';
import { initializeMapbox } from '@/utils/mapLoader';
import { isElementInDOM, safelyRemoveMap } from './utils';

export const useMapInitialization = (
  mapRef: React.RefObject<HTMLDivElement>,
  map: any,
  onMapInitialized?: (mapInstance: any) => void,
  onMapError?: (error: Error) => void
) => {
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapInitialized = useRef(false);
  const mountedRef = useRef(true);
  const initPromiseRef = useRef<Promise<any> | null>(null);
  
  // Function to initialize the map
  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInitialized.current || !mountedRef.current) return;
    
    try {
      console.log("Starting map initialization");
      
      // Don't initialize again if there's already a pending initialization
      if (initPromiseRef.current) {
        return initPromiseRef.current;
      }
      
      // Create a new initialization promise
      initPromiseRef.current = new Promise(async (resolve, reject) => {
        try {
          await initializeMapbox();
          
          // Wait for Mapbox to load with a timeout
          let attempts = 0;
          const maxAttempts = 20;
          
          const checkMapboxLoaded = () => {
            attempts++;
            
            if (!mountedRef.current) {
              console.log("Component unmounted during initialization");
              initPromiseRef.current = null;
              return reject("Component unmounted");
            }
            
            if (window.mapboxgl) {
              console.log("Mapbox object available, creating map");
              
              // Center on Pune, India
              const puneCoordinates = { lng: 73.8567, lat: 18.5204 };
              
              try {
                // Clean up previous map instance if it exists
                if (map) {
                  safelyRemoveMap(map);
                }
                
                // Check if mapRef is still valid before creating map
                if (!mapRef.current || !isElementInDOM(mapRef.current)) {
                  console.log("Map container is no longer in DOM");
                  initPromiseRef.current = null;
                  return reject("Map container is not in the DOM");
                }
                
                // Create map instance
                const mapInstance = new window.mapboxgl.Map({
                  container: mapRef.current,
                  style: 'mapbox://styles/mapbox/light-v11',
                  center: puneCoordinates,
                  zoom: 12,
                  failIfMajorPerformanceCaveat: true
                });
                
                // Set up load handler
                mapInstance.once('load', () => {
                  if (!mountedRef.current) {
                    safelyRemoveMap(mapInstance);
                    initPromiseRef.current = null;
                    return reject("Component unmounted during map load");
                  }
                  
                  console.log("Map loaded");
                  
                  // Add navigation controls only after map is loaded
                  try {
                    mapInstance.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
                  } catch (error) {
                    console.log("Error adding navigation control:", error);
                  }
                  
                  setIsMapInitialized(true);
                  setMapError(null);
                  mapInitialized.current = true;
                  
                  if (onMapInitialized) {
                    onMapInitialized(mapInstance);
                  }
                  
                  initPromiseRef.current = null;
                  resolve(mapInstance);
                });
                
                // Handle map errors
                mapInstance.on('error', (e: any) => {
                  if (!mountedRef.current) return;
                  console.error("Mapbox error:", e);
                  setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
                  
                  if (onMapError) {
                    onMapError(new Error(e.error?.message || 'Unknown map error'));
                  }
                  
                  if (initPromiseRef.current) {
                    initPromiseRef.current = null;
                    reject(e);
                  }
                });
                
              } catch (mapError) {
                console.error("Error creating map instance:", mapError);
                if (mountedRef.current) {
                  setMapError("Error creating map. Please check your Mapbox token.");
                  
                  if (onMapError) {
                    onMapError(new Error("Error creating map. Please check your Mapbox token."));
                  }
                }
                initPromiseRef.current = null;
                reject(mapError);
              }
            } else if (attempts >= maxAttempts) {
              console.error("Mapbox failed to load after timeout");
              if (mountedRef.current) {
                setMapError("Failed to load map. Please check your connection and try again.");
                
                if (onMapError) {
                  onMapError(new Error("Failed to load map. Please check your connection and try again."));
                }
              }
              initPromiseRef.current = null;
              reject("Mapbox failed to load after timeout");
            } else {
              // Not loaded yet, check again after a delay
              setTimeout(checkMapboxLoaded, 500);
            }
          };
          
          // Start checking if Mapbox is loaded
          checkMapboxLoaded();
        } catch (error) {
          console.error("Error in map initialization promise:", error);
          setMapError("Failed to initialize the map. Please ensure your Mapbox token is valid.");
          
          if (onMapError) {
            onMapError(new Error("Failed to initialize the map. Please ensure your Mapbox token is valid."));
          }
          
          initPromiseRef.current = null;
          reject(error);
        }
      });
      
      return initPromiseRef.current;
      
    } catch (error) {
      console.error("Error in map initialization:", error);
      if (mountedRef.current) {
        setMapError("Failed to initialize the map. Please ensure your Mapbox token is valid.");
        
        if (onMapError) {
          onMapError(new Error("Failed to initialize the map. Please ensure your Mapbox token is valid."));
        }
      }
      initPromiseRef.current = null;
      throw error;
    }
  }, [map, onMapInitialized, onMapError, mapRef]);

  // Function to reinitialize the map (useful when token changes)
  const reinitializeMap = useCallback(() => {
    if (!mountedRef.current) return;
    
    setIsMapInitialized(false);
    setMapError(null);
    mapInitialized.current = false;
    
    // Reset initialization promise
    initPromiseRef.current = null;
    
    // Initialize new map after a short delay
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        initMap();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initMap]);
  
  return {
    isMapInitialized,
    mapError,
    setMapError,
    initMap,
    reinitializeMap,
    mountedRef
  };
};
