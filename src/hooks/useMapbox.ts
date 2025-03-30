
import { useRef, useState, useEffect } from 'react';
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
  
  useEffect(() => {
    if (!mapRef.current) return;
    
    const initMap = async () => {
      try {
        console.log("Starting map initialization");
        await initializeMapbox();
        
        // Wait for Mapbox to load with a timeout
        let attempts = 0;
        const maxAttempts = 20;
        
        const initInterval = setInterval(() => {
          attempts++;
          
          if (window.mapboxgl) {
            clearInterval(initInterval);
            
            console.log("Mapbox object available, creating map");
            
            // Center on Pune, India
            const puneCoordinates = { lng: 73.8567, lat: 18.5204 };
            
            try {
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
                console.log("Map loaded");
                setMap(mapInstance);
                setIsMapInitialized(true);
                setMapError(null);
                
                if (onMapInitialized) {
                  onMapInitialized(mapInstance);
                }
              });
              
            } catch (mapError) {
              console.error("Error creating map instance:", mapError);
              setMapError("Error creating map. Please refresh the page.");
            }
          } else if (attempts >= maxAttempts) {
            clearInterval(initInterval);
            console.error("Mapbox failed to load after timeout");
            setMapError("Failed to load map. Please refresh and try again.");
          }
        }, 500);
        
      } catch (error) {
        console.error("Error in map initialization:", error);
        setMapError("Failed to initialize the map. Please try refreshing the page.");
      }
    };
    
    initMap();
    
    // Cleanup function
    return () => {
      if (map) {
        map.remove();
      }
      
      // Clean up markers and popups
      markers.forEach(marker => {
        if (marker) marker.remove();
      });
      
      popups.forEach(popup => {
        if (popup) popup.remove();
      });
    };
  }, [onMapInitialized]);

  // Function to update markers
  const updateMarkers = (doctors: Doctor[], selectedDoctor: Doctor | null) => {
    if (!map || !isMapInitialized || !window.mapboxgl) return;
    
    // Clear existing markers and popups
    markers.forEach(marker => marker.remove());
    popups.forEach(popup => popup.remove());
    
    const newMarkers: any[] = [];
    const newPopups: any[] = [];
    
    doctors.forEach(doctor => {
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
      
      // Create the marker
      const marker = new window.mapboxgl.Marker(el)
        .setLngLat([doctor.location.lng, doctor.location.lat])
        .setPopup(popup)
        .addTo(map);
      
      newMarkers.push(marker);
      
      // Show popup for selected doctor
      if (isSelected) {
        popup.addTo(map);
        
        // Center map on selected doctor
        map.flyTo({
          center: [doctor.location.lng, doctor.location.lat],
          zoom: 15,
          essential: true
        });
      }
    });
    
    setMarkers(newMarkers);
    setPopups(newPopups);
  };

  return { 
    mapRef, 
    map, 
    isMapInitialized, 
    mapError, 
    setMapError,
    updateMarkers
  };
};

// Add Mapbox types to window
declare global {
  interface Window {
    mapboxgl: any;
  }
}
