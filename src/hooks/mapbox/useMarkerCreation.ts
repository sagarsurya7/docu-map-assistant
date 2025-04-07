
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

    // Skip invalid doctor data or doctors without location
    if (!doctor || !doctor.location || typeof doctor.location !== 'object' || 
        typeof doctor.location.lat !== 'number' || typeof doctor.location.lng !== 'number') {
      console.warn("Doctor missing valid location data:", doctor);
      return null;
    }

    // Create popup
    const popup = new window.mapboxgl.Popup({ 
      offset: 25,
      closeButton: true,
      closeOnClick: true
    }).setHTML(`
      <div class="p-2">
        <div class="font-semibold">${doctor.name || 'Unknown Doctor'}</div>
        <div class="text-sm">${doctor.specialty || 'Specialty not specified'}</div>
        <div class="text-xs mt-1">${doctor.address || 'Address not available'}</div>
      </div>
    `);
    
    // Save popup in parent component
    onCreatePopup(popup);
    
    // Create a DOM element for the marker
    const el = document.createElement('div');
    el.className = 'marker';
    
    // Apply specific styles directly to ensure visibility
    el.style.backgroundImage = `url(https://maps.google.com/mapfiles/ms/icons/${isSelected ? 'blue' : 'red'}-dot.png)`;
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = '100% 100%';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.cursor = 'pointer';
    
    // Add visual feedback class
    if (isSelected) {
      el.className = 'marker selected-marker';
      el.style.zIndex = '10'; // Ensure selected marker appears on top
      el.style.transform = 'scale(1.2)'; // Make selected marker slightly larger
    } else {
      el.style.zIndex = '5';
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
          console.log(`Added ${isSelected ? 'blue' : 'red'} marker for doctor ${doctor.id}`);
          return marker;
        }
      } catch (e) {
        console.log("Error adding marker to map:", e);
      }
    }
  } catch (error) {
    console.log("Error creating marker for doctor:", doctor?.id, error);
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
    // Skip if doctor location is invalid
    if (!doctor || !doctor.location || typeof doctor.location !== 'object' || 
        typeof doctor.location.lat !== 'number' || typeof doctor.location.lng !== 'number') {
      console.warn("Cannot fly to doctor with invalid location:", doctor);
      return;
    }
    
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
