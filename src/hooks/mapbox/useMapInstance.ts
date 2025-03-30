
import { useCallback } from 'react';
import { safelyRemoveMap, isElementInDOM, setGlobalMapInstance } from './utils';

export const useMapInstance = (map: any) => {
  const createMapInstance = useCallback((
    mapboxgl: any, 
    mapRef: React.RefObject<HTMLDivElement>, 
    mountedRef: React.RefObject<boolean>
  ) => {
    return new Promise<any>((resolve, reject) => {
      console.log("Creating map instance, checking DOM readiness");
      
      // Check if component is still mounted
      if (!mountedRef.current) {
        console.log("Component unmounted before map creation");
        return reject("Component unmounted before map creation");
      }
      
      // Check if mapRef is still valid before creating map
      if (!mapRef.current || !isElementInDOM(mapRef.current)) {
        console.log("Map container is no longer in DOM");
        return reject("Map container is not in the DOM");
      }
      
      // Clean up previous map instance if it exists
      if (map) {
        console.log("Cleaning up previous map instance before creating new one");
        safelyRemoveMap(map);
      }
      
      try {
        // Make sure the token is set - we're using a constant token now
        if (!mapboxgl.accessToken) {
          console.error("No Mapbox access token set");
          return reject("No Mapbox access token provided");
        }

        console.log("Creating new Mapbox map instance");
        // Center on Pune, India
        const puneCoordinates = { lng: 73.8567, lat: 18.5204 };
        
        // Double check DOM before creating map
        if (!mapRef.current || !isElementInDOM(mapRef.current)) {
          return reject("Map container is not in the DOM during initialization");
        }
        
        // Create map instance
        const mapInstance = new mapboxgl.Map({
          container: mapRef.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: puneCoordinates,
          zoom: 12,
          failIfMajorPerformanceCaveat: true,
          attributionControl: false,
          preserveDrawingBuffer: true, // Helps with some rendering issues
        });
        
        // Store global reference to prevent GC
        setGlobalMapInstance(mapInstance);
        
        // Add debugging
        console.log("Map instance created successfully");
        
        // Set up load handler with retry mechanism
        let loadAttempts = 0;
        const maxLoadAttempts = 3;
        
        const setupLoadHandler = () => {
          loadAttempts++;
          console.log(`Setting up map load handler, attempt ${loadAttempts}`);
          
          mapInstance.once('load', () => {
            if (!mountedRef.current) {
              console.log("Component unmounted during map load, cleaning up");
              safelyRemoveMap(mapInstance);
              return reject("Component unmounted during map load");
            }
            
            console.log("Map loaded successfully!");
            
            // Add navigation controls only after map is loaded
            try {
              mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
            } catch (error) {
              console.log("Error adding navigation control:", error);
            }
            
            // Wait a brief moment for the map to stabilize
            setTimeout(() => {
              if (mountedRef.current) {
                console.log("Map is fully stabilized, resolving promise");
                resolve(mapInstance);
              } else {
                safelyRemoveMap(mapInstance);
                reject("Component unmounted during map stabilization");
              }
            }, 250); // Increased stability delay
          });
        };
        
        setupLoadHandler();
        
        // Handle map errors
        mapInstance.on('error', (e: any) => {
          if (!mountedRef.current) return;
          console.error("Mapbox error event triggered:", e);
          
          if (loadAttempts < maxLoadAttempts) {
            console.log(`Retrying map load after error, attempt ${loadAttempts + 1}`);
            setupLoadHandler();
          } else {
            reject(e.error?.message || 'Unknown map error');
          }
        });
      } catch (error) {
        console.error("Error creating map instance:", error);
        return reject(error);
      }
    });
  }, [map]);

  return { createMapInstance };
};
