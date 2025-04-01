
import { Doctor } from '@/types';
import { isMapValid } from './utils';

/**
 * Creates a marker for a doctor
 */
export const createDoctorMarker = (
  doctor: Doctor,
  isSelected: boolean,
  map: any,
  onCreatePopup: (popup: any) => void
): any | null => {
  try {
    if (!window.mapboxgl || !isMapValid(map)) {
      return null;
    }

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
    
    // Save popup in parent component
    onCreatePopup(popup);
    
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
        if (isMapValid(map)) {
          marker.addTo(map);
          return marker;
        }
      } catch (e) {
        console.log("Error adding marker to map:", e);
      }
    }
  } catch (error) {
    console.log("Error creating marker for doctor:", doctor.id, error);
  }
  
  return null;
};

/**
 * Flies to a selected doctor on the map
 */
export const flyToSelectedDoctor = (
  doctor: Doctor,
  map: any
): void => {
  if (!isMapValid(map)) return;
  
  try {
    console.log(`Flying to selected doctor ${doctor.id}`);
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
};
