
import { useRef, useState, useEffect, useCallback } from 'react';
import { initializeMapbox } from '@/utils/mapLoader';
import { Doctor } from '@/types';

interface UseMapboxProps {
  onMapInitialized?: (mapInstance: any) => void;
}

export const useMapbox = ({ onMapInitialized }: UseMapboxProps = {}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [popups, setPopups] = useState<any[]>([]);
  const mapInitialized = useRef(false);
  const mountedRef = useRef(true);
  const initPromiseRef = useRef<Promise<any> | null>(null);
  
  // Function to safely check if element is in DOM
  const isElementInDOM = useCallback((element: HTMLElement | null) => {
    return element && document.body.contains(element);
  }, []);
  
  // Helper function to safely check if map is valid and can be operated on
  const isMapValid = useCallback((mapInstance: any) => {
    return mapInstance && 
           !mapInstance._removed && 
           mapInstance.getContainer && 
           isElementInDOM(mapInstance.getContainer());
  }, [isElementInDOM]);
  
  // Function to safely cleanup markers
  const cleanupMarkers = useCallback(() => {
    if (!mountedRef.current) return;
    
    markers.forEach(marker => {
      if (marker) {
        try {
          marker.remove();
        } catch (e) {
          console.log("Error removing marker:", e);
        }
      }
    });
    setMarkers([]);
    
    popups.forEach(popup => {
      if (popup) {
        try {
          popup.remove();
        } catch (e) {
          console.log("Error removing popup:", e);
        }
      }
    });
    setPopups([]);
  }, [markers, popups]);
  
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
                  try {
                    map.remove();
                  } catch (error) {
                    console.log("Error removing old map instance:", error);
                  }
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
                    try {
                      mapInstance.remove();
                    } catch (e) {
                      console.log("Error removing map after unmount:", e);
                    }
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
                  
                  setMap(mapInstance);
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
                  
                  if (initPromiseRef.current) {
                    initPromiseRef.current = null;
                    reject(e);
                  }
                });
                
              } catch (mapError) {
                console.error("Error creating map instance:", mapError);
                if (mountedRef.current) {
                  setMapError("Error creating map. Please check your Mapbox token.");
                }
                initPromiseRef.current = null;
                reject(mapError);
              }
            } else if (attempts >= maxAttempts) {
              console.error("Mapbox failed to load after timeout");
              if (mountedRef.current) {
                setMapError("Failed to load map. Please check your connection and try again.");
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
          initPromiseRef.current = null;
          reject(error);
        }
      });
      
      return initPromiseRef.current;
      
    } catch (error) {
      console.error("Error in map initialization:", error);
      if (mountedRef.current) {
        setMapError("Failed to initialize the map. Please ensure your Mapbox token is valid.");
      }
      initPromiseRef.current = null;
      throw error;
    }
  }, [map, onMapInitialized, isElementInDOM]);
  
  // Function to reinitialize the map (useful when token changes)
  const reinitializeMap = useCallback(() => {
    if (!mountedRef.current) return;
    
    setIsMapInitialized(false);
    setMapError(null);
    mapInitialized.current = false;
    
    // Clean up existing markers and popups
    cleanupMarkers();
    
    // Remove existing map
    if (map) {
      try {
        map.remove();
      } catch (error) {
        console.log("Error removing map:", error);
      }
      setMap(null);
    }
    
    // Reset initialization promise
    initPromiseRef.current = null;
    
    // Initialize new map after a short delay
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        initMap();
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [initMap, map, cleanupMarkers]);
  
  // Initialize map on component mount
  useEffect(() => {
    mountedRef.current = true;
    
    // Initialize map with a slight delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mountedRef.current) {
        initMap().catch(error => {
          console.error("Map initialization failed:", error);
        });
      }
    }, 200);
    
    // Cleanup function
    return () => {
      clearTimeout(timer);
      mountedRef.current = false;
      
      try {
        // Cancel any pending initialization
        initPromiseRef.current = null;
        
        // Clean up markers and popups first
        cleanupMarkers();
        
        // Then remove the map
        if (map) {
          try {
            map.remove();
          } catch (error) {
            console.log("Error during map cleanup:", error);
          }
        }
      } catch (error) {
        console.log("General error during cleanup:", error);
      }
    };
  }, [initMap, map, cleanupMarkers]);

  // Function to update markers
  const updateMarkers = useCallback((doctors: Doctor[], selectedDoctor: Doctor | null) => {
    if (!map || !isMapInitialized || !window.mapboxgl || !mountedRef.current) {
      console.log("Cannot update markers, map not ready");
      return;
    }
    
    // Check if map is valid before proceeding
    if (!isMapValid(map)) {
      console.log("Map container no longer in DOM, cannot update markers");
      return;
    }
    
    // Clear existing markers and popups
    cleanupMarkers();
    
    // Collect new markers and popups
    const newMarkers: any[] = [];
    const newPopups: any[] = [];
    
    // Only add markers if doctors exist and map is valid
    if (doctors.length > 0 && isMapValid(map)) {
      doctors.forEach(doctor => {
        try {
          const isSelected = selectedDoctor?.id === doctor.id;
          
          // Create popup
          const popup = new window.mapboxgl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: true
          }).setHTML(`
            <div class="p-2">
              <div class="font-semibold">${doctor.name}</div>
              <div class="text-sm">${doctor.specialty}</div>
              <div class="text-xs mt-1">${doctor.address}</div>
            </div>
          `);
          
          // Save popup
          newPopups.push(popup);
          
          // Create a DOM element for the marker
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = `url(https://maps.google.com/mapfiles/ms/icons/${isSelected ? 'blue' : 'red'}-dot.png)`;
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.backgroundSize = 'cover';
          
          if (isSelected) {
            el.className = 'marker selected-marker';
          }
          
          // Final check before adding marker to map
          if (isMapValid(map)) {
            // Create the marker
            const marker = new window.mapboxgl.Marker(el)
              .setLngLat([doctor.location.lng, doctor.location.lat]);
              
            // Only add popup to marker if map is still valid
            try {
              marker.setPopup(popup);
            } catch (e) {
              console.log("Error setting popup:", e);
            }
              
            // Only add to map if map is still valid
            try {
              marker.addTo(map);
              newMarkers.push(marker);
            } catch (e) {
              console.log("Error adding marker to map:", e);
            }
            
            // Show popup for selected doctor
            if (isSelected && isMapValid(map)) {
              try {
                // Center map on selected doctor with a smooth animation
                map.flyTo({
                  center: [doctor.location.lng, doctor.location.lat],
                  zoom: 15,
                  essential: true,
                  duration: 1000
                });
              } catch (e) {
                console.log("Error flying to location:", e);
              }
            }
          }
        } catch (error) {
          console.log("Error creating marker for doctor:", doctor.id, error);
        }
      });
    }
    
    if (mountedRef.current) {
      setMarkers(newMarkers);
      setPopups(newPopups);
    }
  }, [map, isMapInitialized, cleanupMarkers, isMapValid]);

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

// Add Mapbox types to window
declare global {
  interface Window {
    mapboxgl: any;
  }
}
