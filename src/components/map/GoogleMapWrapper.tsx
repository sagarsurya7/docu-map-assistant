
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Doctor } from '@/types';
import DoctorInfoCard from './DoctorInfoCard';
import { updateMapMarkers } from '@/utils/mapHelpers';

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
  
  // Initialize the map
  useEffect(() => {
    const RADAR_API_KEY = "prj_live_pk_c2520a5ff9a2e8caa3843a2bdbf40c2a7ba06ede";
    
    console.log("Using Radar API key for map integration");
    
    const loader = new Loader({
      apiKey: RADAR_API_KEY,
      version: "weekly",
      libraries: ["places"]
    });

    loader
      .load()
      .then(() => {
        if (mapRef.current) {
          try {
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
          } catch (error) {
            console.error("Error initializing map:", error);
          }
        }
      })
      .catch(e => {
        console.error("Error loading Google Maps API:", e);
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
    if (!map || !google || doctors.length === 0) return;
    
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
  }, [map, doctors, selectedDoctor]);

  return (
    <div className="h-full relative">
      <div ref={mapRef} className="h-full w-full"></div>
      {selectedDoctor && (
        <DoctorInfoCard 
          doctor={selectedDoctor} 
          className="absolute bottom-4 left-4 w-64 shadow-lg" 
        />
      )}
    </div>
  );
};

export default GoogleMapWrapper;
