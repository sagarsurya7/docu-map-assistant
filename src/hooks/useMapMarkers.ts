
import { useState, useEffect } from 'react';
import { Doctor } from '@/types';

interface UseMapMarkersProps {
  map: any;
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  isMapInitialized: boolean;
}

export const useMapMarkers = ({ 
  map, 
  doctors, 
  selectedDoctor, 
  isMapInitialized 
}: UseMapMarkersProps) => {
  const [markers, setMarkers] = useState<any[]>([]);
  
  // Function to add markers to the map
  const addMarkersToMap = (mapInstance: any, doctorsList: Doctor[], selectedDoc: Doctor | null) => {
    console.log("Adding markers to map");
    
    // Clear existing markers
    markers.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    
    const newMarkers: any[] = [];
    
    doctorsList.forEach(doctor => {
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
  
  // Callback function for marker click
  const onSelectDoctor = (doctor: Doctor) => {
    // This will be passed as a prop and set in the parent component
  };

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

  return { markers, addMarkersToMap };
};
