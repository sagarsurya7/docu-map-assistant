
import React, { useEffect, useRef, useState } from 'react';
import { Doctor } from '@/types';
import DoctorInfoCard from './DoctorInfoCard';
import { updateMapMarkers } from '@/utils/mapHelpers';
import { mapLoader } from '@/utils/mapLoader';

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
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Initialize the map
  useEffect(() => {
    console.log("Initializing Google Maps with valid API key");
    
    if (!mapRef.current) return;
    
    mapLoader
      .load()
      .then((google) => {
        if (mapRef.current) {
          try {
            // Center on Pune, India
            const puneCoordinates = { lat: 18.5204, lng: 73.8567 };
            
            const mapInstance = new google.maps.Map(mapRef.current, {
              center: puneCoordinates,
              zoom: 13,
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
              zoomControl: true,
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP,
              },
              styles: [
                {
                  featureType: "poi.business",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "transit",
                  elementType: "labels.icon",
                  stylers: [{ visibility: "off" }],
                },
              ],
            });
            
            setMap(mapInstance);
            setMapError(null);
            
            // After map loads, pan to the selected doctor if one is already selected
            if (selectedDoctor) {
              mapInstance.panTo(selectedDoctor.location);
              mapInstance.setZoom(15);
            }
            
            console.log("Map initialized successfully");
          } catch (error) {
            console.error("Error initializing map:", error);
            setMapError("Failed to initialize the map. Please try refreshing the page.");
          }
        }
      })
      .catch(e => {
        console.error("Error loading Google Maps API:", e);
        setMapError("Failed to load the map. Please check your internet connection and try again.");
      });
      
    return () => {
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
      }
      
      if (infoWindows.length > 0) {
        infoWindows.forEach(infoWindow => infoWindow.close());
        setInfoWindows([]);
      }
    };
  }, []);

  // Update markers when doctors or selected doctor changes
  useEffect(() => {
    if (!map || !window.google || doctors.length === 0) return;
    
    try {
      const { newMarkers, newInfoWindows } = updateMapMarkers(
        map,
        doctors,
        selectedDoctor,
        onSelectDoctor,
        markers,
        infoWindows
      );
      
      setMarkers(newMarkers);
      setInfoWindows(newInfoWindows);

      // Center the map on the selected doctor's location if one is selected
      if (selectedDoctor) {
        map.panTo(selectedDoctor.location);
        map.setZoom(15); // Zoom in a bit to show the area better
      }
    } catch (error) {
      console.error("Error updating map markers:", error);
    }
  }, [map, doctors, selectedDoctor]);

  return (
    <div className="h-full relative">
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
        <div ref={mapRef} className="h-full w-full"></div>
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

export default GoogleMapWrapper;
