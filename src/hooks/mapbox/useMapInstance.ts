
import { useCallback } from 'react';
import { safelyRemoveMap, isElementInDOM } from './utils';

export const useMapInstance = (map: any) => {
  const createMapInstance = useCallback((
    mapboxgl: any, 
    mapRef: React.RefObject<HTMLDivElement>, 
    mountedRef: React.RefObject<boolean>
  ) => {
    // Check if mapRef is still valid before creating map
    if (!mapRef.current || !isElementInDOM(mapRef.current)) {
      console.log("Map container is no longer in DOM");
      return Promise.reject("Map container is not in the DOM");
    }
    
    // Clean up previous map instance if it exists
    if (map) {
      safelyRemoveMap(map);
    }
    
    try {
      // Make sure the token is set
      if (!mapboxgl.accessToken) {
        console.error("No Mapbox access token set");
        return Promise.reject("No Mapbox access token provided");
      }

      // Center on Pune, India
      const puneCoordinates = { lng: 73.8567, lat: 18.5204 };
      
      // Create map instance
      const mapInstance = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: puneCoordinates,
        zoom: 12,
        failIfMajorPerformanceCaveat: true,
        attributionControl: false
      });
      
      // Add debugging
      console.log("Map instance created:", mapInstance);
      
      return new Promise<any>((resolve, reject) => {
        // Set up load handler
        mapInstance.once('load', () => {
          if (!mountedRef.current) {
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
          
          resolve(mapInstance);
        });
        
        // Handle map errors
        mapInstance.on('error', (e: any) => {
          if (!mountedRef.current) return;
          console.error("Mapbox error event triggered:", e);
          
          reject(e.error?.message || 'Unknown map error');
        });
      });
    } catch (error) {
      console.error("Error creating map instance:", error);
      return Promise.reject(error);
    }
  }, [map]);

  return { createMapInstance };
};
