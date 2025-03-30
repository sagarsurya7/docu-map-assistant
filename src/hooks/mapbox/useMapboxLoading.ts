
import { useCallback, useRef } from 'react';
import { initializeMapbox } from '@/utils/mapLoader';

export const useMapboxLoading = () => {
  const initPromiseRef = useRef<Promise<any> | null>(null);
  
  const loadMapboxWithTimeout = useCallback(async (mountedRef: React.RefObject<boolean>) => {
    try {
      console.log("Starting Mapbox initialization");
      
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
              console.log("Component unmounted during Mapbox loading");
              initPromiseRef.current = null;
              return reject("Component unmounted");
            }
            
            if (window.mapboxgl) {
              console.log("Mapbox object available");
              initPromiseRef.current = null;
              resolve(window.mapboxgl);
            } else if (attempts >= maxAttempts) {
              console.error("Mapbox failed to load after timeout");
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
          console.error("Error in Mapbox loading promise:", error);
          initPromiseRef.current = null;
          reject(error);
        }
      });
      
      return initPromiseRef.current;
      
    } catch (error) {
      console.error("Error in Mapbox loading:", error);
      initPromiseRef.current = null;
      throw error;
    }
  }, []);

  return { loadMapboxWithTimeout };
};
