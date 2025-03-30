
import { useState, useCallback, useRef } from 'react';
import { Doctor } from '@/types';
import { isMapValid } from './utils';

export const useMapMarkers = (
  map: any,
  isMapInitialized: boolean,
  mountedRef: React.RefObject<boolean>
) => {
  const [markers, setMarkers] = useState<any[]>([]);
  const [popups, setPopups] = useState<any[]>([]);
  const updateInProgress = useRef(false);
  
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
  }, [markers, popups, mountedRef]);
  
  // Function to update markers
  const updateMarkers = useCallback((doctors: Doctor[], selectedDoctor: Doctor | null) => {
    // Prevent concurrent updates which may cause issues
    if (updateInProgress.current) {
      console.log("Marker update already in progress, skipping");
      return;
    }
    
    console.log("updateMarkers called with map:", map);
    
    if (!map || !isMapInitialized || !window.mapboxgl || !mountedRef.current) {
      console.log("Cannot update markers, map not ready", {
        mapExists: !!map,
        isMapInitialized,
        mapboxGlExists: !!window.mapboxgl,
        componentMounted: mountedRef.current
      });
      return;
    }
    
    // Check if map is valid before proceeding
    if (!isMapValid(map)) {
      console.log("Map container no longer in DOM or map is invalid, cannot update markers");
      return;
    }
    
    updateInProgress.current = true;
    
    try {
      // Clear existing markers and popups
      cleanupMarkers();
      
      // Collect new markers and popups
      const newMarkers: any[] = [];
      const newPopups: any[] = [];
      
      // Only add markers if doctors exist and map is valid
      if (doctors.length > 0 && isMapValid(map)) {
        console.log(`Adding ${doctors.length} markers to map`);
        
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
              console.log(`Adding marker for doctor ${doctor.id} at [${doctor.location.lng}, ${doctor.location.lat}]`);
              
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
                  newMarkers.push(marker);
                  console.log(`Successfully added marker for doctor ${doctor.id}`);
                }
              } catch (e) {
                console.log("Error adding marker to map:", e);
              }
              
              // Show popup for selected doctor
              if (isSelected && isMapValid(map)) {
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
        console.log(`Successfully added ${newMarkers.length} markers to map`);
      }
    } catch (error) {
      console.error("Error in updateMarkers:", error);
    } finally {
      updateInProgress.current = false;
    }
  }, [map, isMapInitialized, cleanupMarkers, mountedRef]);

  return {
    markers,
    popups,
    updateMarkers,
    cleanupMarkers
  };
};
