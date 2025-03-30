
import React, { useEffect, useRef, useState } from 'react';
import { Doctor } from '@/types';
import DoctorInfoCard from './DoctorInfoCard';
import { initializeRadarMap } from '@/utils/mapLoader';

interface GoogleMapWrapperProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const GoogleMapWrapper: React.FC<GoogleMapWrapperProps> = ({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  
  // Initialize the Radar map
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
              
              // Add markers after map is created
              if (doctors.length > 0) {
                addMarkersToMap(mapInstance, doctors, selectedDoctor);
              }
              
              if (selectedDoctor) {
                mapInstance.setCenter(selectedDoctor.location);
                mapInstance.setZoom(15);
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
    
    return () => {
      // Clean up markers when component unmounts
      if (markers.length > 0) {
        markers.forEach(marker => {
          if (marker && marker.remove) {
            marker.remove();
          }
        });
      }
    };
  }, []);

  // Update markers when doctors or selected doctor changes
  useEffect(() => {
    if (!isMapInitialized || !map || !window.radar || !window.radar.maps || doctors.length === 0) return;
    
    console.log("Updating markers for", doctors.length, "doctors");
    try {
      addMarkersToMap(map, doctors, selectedDoctor);
      
      // Center the map on the selected doctor's location if one is selected
      if (selectedDoctor) {
        console.log("Centering on selected doctor:", selectedDoctor.name);
        map.setCenter(selectedDoctor.location);
        map.setZoom(15); // Zoom in a bit to show the area better
      }
    } catch (error) {
      console.error("Error updating map markers:", error);
    }
  }, [isMapInitialized, map, doctors, selectedDoctor]);
  
  // Function to add markers to the map
  const addMarkersToMap = (mapInstance: any, doctors: Doctor[], selectedDoc: Doctor | null) => {
    console.log("Adding markers to map");
    
    // Clear existing markers
    markers.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    
    const newMarkers: any[] = [];
    
    doctors.forEach(doctor => {
      try {
        const isSelected = selectedDoc?.id === doctor.id;
        console.log("Creating marker for doctor:", doctor.name, doctor.location);
        
        // Create marker with Radar Maps
        const marker = new window.radar.maps.Marker({
          map: mapInstance,
          position: doctor.location,
          icon: {
            url: isSelected 
              ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            size: [40, 40],
          },
          // Radar Maps doesn't support direct animation, but we can add a class for CSS animation
          className: isSelected ? 'selected-marker' : ''
        });
        
        // Add click event to marker
        marker.on('click', () => {
          console.log("Marker clicked for doctor:", doctor.name);
          onSelectDoctor(doctor);
        });
        
        // Create popup (infoWindow equivalent in Radar Maps)
        const popupContent = `
          <div class="p-2">
            <div class="font-semibold">${doctor.name}</div>
            <div class="text-sm">${doctor.specialty}</div>
            <div class="text-xs mt-1">${doctor.address}</div>
          </div>
        `;
        
        const popup = new window.radar.maps.Popup({
          content: popupContent,
          position: doctor.location,
          closeButton: true,
        });
        
        // Show popup for selected doctor
        if (isSelected) {
          popup.addTo(mapInstance);
        }
        
        // Show popup on click
        marker.on('click', () => {
          popup.addTo(mapInstance);
        });
        
        newMarkers.push(marker);
      } catch (error) {
        console.error("Error creating marker for doctor:", doctor.name, error);
      }
    });
    
    setMarkers(newMarkers);
    console.log("Added", newMarkers.length, "markers to map");
  };

  return (
    <div className="h-full relative">
      <style>
        {`
          .selected-marker {
            animation: bounce 1s infinite alternate;
          }
          
          @keyframes bounce {
            from { transform: translateY(0); }
            to { transform: translateY(-10px); }
          }
          
          /* Ensure map container takes full height */
          .radar-map-container {
            height: 100%;
            width: 100%;
          }
        `}
      </style>
      {mapError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="text-center p-4">
            <p className="text-red-500 mb-2">{mapError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-medical text-white rounded-md hover:bg-medical-dark"
            >
              Refresh Page
            </button>
          </div>
        </div>
      ) : (
        <div ref={mapRef} className="h-full w-full radar-map-container"></div>
      )}
      {selectedDoctor && !mapError && (
        <DoctorInfoCard 
          doctor={selectedDoctor} 
          className="absolute bottom-4 left-4 w-64 shadow-lg" 
        />
      )}
    </div>
  );
};

// Add the Radar types to the window object
declare global {
  interface Window {
    radar: any;
    Radar: any;
  }
}

export default GoogleMapWrapper;
