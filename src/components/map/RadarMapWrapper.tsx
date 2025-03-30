
import React from 'react';
import { Doctor } from '@/types';
import DoctorInfoCard from './DoctorInfoCard';
import MapError from './MapError';
import MapStyles from './MapStyles';
import { useRadarMap } from '@/hooks/useRadarMap';
import { useMapMarkers } from '@/hooks/useMapMarkers';

interface RadarMapWrapperProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const RadarMapWrapper: React.FC<RadarMapWrapperProps> = ({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor 
}) => {
  // Initialize Radar Map
  const { mapRef, map, isMapInitialized, mapError } = useRadarMap();
  
  // Initialize markers
  const { markers } = useMapMarkers({
    map,
    doctors,
    selectedDoctor,
    isMapInitialized
  });
  
  // Update markers and center map when doctors or selected doctor changes
  React.useEffect(() => {
    if (!isMapInitialized || !map || !window.radar || !window.radar.maps || doctors.length === 0) return;
    
    // Clear existing markers
    markers.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    
    doctors.forEach(doctor => {
      try {
        const isSelected = selectedDoctor?.id === doctor.id;
        
        // Create marker with Radar Maps
        const marker = new window.radar.maps.Marker({
          map: map,
          position: doctor.location,
          icon: {
            url: isSelected 
              ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            size: [40, 40],
          },
          className: isSelected ? 'selected-marker' : ''
        });
        
        // Add click event to marker
        marker.on('click', () => {
          onSelectDoctor(doctor);
        });
        
        // Create popup
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
          popup.addTo(map);
        }
        
        // Show popup on click
        marker.on('click', () => {
          popup.addTo(map);
        });
      } catch (error) {
        console.error("Error creating marker for doctor:", doctor.name, error);
      }
    });
    
    // Center the map on the selected doctor's location if one is selected
    if (selectedDoctor) {
      map.setCenter(selectedDoctor.location);
      map.setZoom(15);
    }
  }, [isMapInitialized, map, doctors, selectedDoctor, markers, onSelectDoctor]);

  return (
    <div className="h-full relative">
      <MapStyles />
      {mapError ? (
        <MapError message={mapError} />
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

export default RadarMapWrapper;
