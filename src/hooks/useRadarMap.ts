
import { useRef, useState, useEffect } from 'react';
import { initializeRadarMap } from '@/utils/mapLoader';

interface UseRadarMapProps {
  onMapInitialized?: (mapInstance: any) => void;
}

export const useRadarMap = ({ onMapInitialized }: UseRadarMapProps = {}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    const initMap = async () => {
      try {
        console.log("Starting map initialization");
        await initializeRadarMap();
        
        // Wait for Radar Maps to load with a timeout
        let attempts = 0;
        const maxAttempts = 20;
        
        const initInterval = setInterval(() => {
          attempts++;
          
          if (window.radar && window.radar.maps) {
            clearInterval(initInterval);
            
            console.log("Radar Maps object available, creating map");
            
            // Center on Pune, India
            const puneCoordinates = { lat: 18.5204, lng: 73.8567 };
            
            try {
              const mapInstance = new window.radar.maps.Map({
                element: mapRef.current,
                center: puneCoordinates,
                zoom: 12,
                baseMap: 'light'
              });
              
              console.log("Map instance created:", mapInstance);
              setMap(mapInstance);
              setIsMapInitialized(true);
              setMapError(null);
              
              if (onMapInitialized) {
                onMapInitialized(mapInstance);
              }
              
            } catch (mapError) {
              console.error("Error creating map instance:", mapError);
              setMapError("Error creating map. Please refresh the page.");
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(initInterval);
            console.error("Radar Maps failed to load after timeout");
            setMapError("Failed to load map. Please refresh and try again.");
          }
        }, 500);
        
      } catch (error) {
        console.error("Error in map initialization:", error);
        setMapError("Failed to initialize the map. Please try refreshing the page.");
      }
    };
    
    initMap();
  }, [onMapInitialized]);

  return { mapRef, map, isMapInitialized, mapError, setMapError };
};
