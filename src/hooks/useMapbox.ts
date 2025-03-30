
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
  
  // Function to safely check if element is in DOM
  const isElementInDOM = useCallback((element: HTMLElement | null) => {
    return element && document.body.contains(element);
  }, []);
  
  // Function to initialize the map
  const initMap = useCallback(async () => {
    if (!mapRef.current || mapInitialized.current || !mountedRef.current) return;
    
    try {
      console.log("Starting map initialization");
      await initializeMapbox();
      
      // Wait for Mapbox to load with a timeout
      let attempts = 0;
      const maxAttempts = 20;
      
      const initInterval = setInterval(() => {
        attempts++;
        
        if (!mountedRef.current) {
          clearInterval(initInterval);
          return;
        }
        
        if (window.mapboxgl) {
          clearInterval(initInterval);
          
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
            
            // Ensure the container is still in the DOM before creating the map
            if (mapRef.current && isElementInDOM(mapRef.current)) {
              const mapInstance = new window.mapboxgl.Map({
                container: mapRef.current,
                style: 'mapbox://styles/mapbox/light-v11',
                center: puneCoordinates,
                zoom: 12
              });
              
              // Add navigation controls
              mapInstance.addControl(new window.mapboxgl.NavigationControl(), 'top-right');
              
              console.log("Map instance created");
              
              mapInstance.on('load', () => {
                if (!mountedRef.current) return;
                
                console.log("Map loaded");
                setMap(mapInstance);
                setIsMapInitialized(true);
                setMapError(null);
                mapInitialized.current = true;
                
                if (onMapInitialized) {
                  onMapInitialized(mapInstance);
                }
              });
              
              // Handle map errors
              mapInstance.on('error', (e: any) => {
                if (!mountedRef.current) return;
                console.error("Mapbox error:", e);
                setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
              });
            } else {
              console.error("Map container is not in the DOM");
              if (mountedRef.current) {
                setMapError("Map container is not in the DOM");
              }
            }
            
          } catch (mapError) {
            console.error("Error creating map instance:", mapError);
            if (mountedRef.current) {
              setMapError("Error creating map. Please check your Mapbox token.");
            }
          }
        } else if (attempts >= maxAttempts) {
          clearInterval(initInterval);
          console.error("Mapbox failed to load after timeout");
          if (mountedRef.current) {
            setMapError("Failed to load map. Please check your connection and try again.");
          }
        }
      }, 500);
      
      return () => clearInterval(initInterval);
      
    } catch (error) {
      console.error("Error in map initialization:", error);
      if (mountedRef.current) {
        setMapError("Failed to initialize the map. Please ensure your Mapbox token is valid.");
      }
    }
  }, [map, onMapInitialized, isElementInDOM]);
  
  // Function to reinitialize the map (useful when token changes)
  const reinitializeMap = useCallback(() => {
    if (!mountedRef.current) return;
    
    setIsMapInitialized(false);
    setMapError(null);
    mapInitialized.current = false;
    
    // Clean up existing markers and popups
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
    
    // Remove existing map
    if (map) {
      try {
        map.remove();
      } catch (error) {
        console.log("Error removing map:", error);
      }
      setMap(null);
    }
    
    // Initialize new map
    setTimeout(() => {
      if (mountedRef.current) {
        initMap();
      }
    }, 100);
  }, [initMap, map, markers, popups]);
  
  // Initialize map on component mount
  useEffect(() => {
    mountedRef.current = true;
    initMap();
    
    // Cleanup function
    return () => {
      mountedRef.current = false;
      
      try {
        // Clean up markers and popups first
        markers.forEach(marker => {
          if (marker) {
            try {
              marker.remove();
            } catch (e) {
              console.log("Error removing marker during cleanup:", e);
            }
          }
        });
        
        popups.forEach(popup => {
          if (popup) {
            try {
              popup.remove();
            } catch (e) {
              console.log("Error removing popup during cleanup:", e);
            }
          }
        });
        
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
  }, [initMap]);

  // Function to update markers
  const updateMarkers = useCallback((doctors: Doctor[], selectedDoctor: Doctor | null) => {
    if (!map || !isMapInitialized || !window.mapboxgl || !mountedRef.current) {
      console.log("Cannot update markers, map not ready");
      return;
    }
    
    // Check if map container still exists
    if (!map.getContainer() || !isElementInDOM(map.getContainer())) {
      console.log("Map container no longer in DOM, cannot update markers");
      return;
    }
    
    // Clear existing markers and popups
    markers.forEach(marker => {
      try {
        if (marker) marker.remove();
      } catch (e) {
        console.log("Error removing marker:", e);
      }
    });
    
    popups.forEach(popup => {
      try {
        if (popup) popup.remove();
      } catch (e) {
        console.log("Error removing popup:", e);
      }
    });
    
    const newMarkers: any[] = [];
    const newPopups: any[] = [];
    
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
        
        // Check if map is still valid
        if (map && !map._removed && map.getContainer() && isElementInDOM(map.getContainer())) {
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
          if (isSelected) {
            try {
              // Center map on selected doctor
              map.flyTo({
                center: [doctor.location.lng, doctor.location.lat],
                zoom: 15,
                essential: true
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
    
    if (mountedRef.current) {
      setMarkers(newMarkers);
      setPopups(newPopups);
    }
  }, [map, isMapInitialized, markers, popups, isElementInDOM]);

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
