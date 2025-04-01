
import { useCallback, useRef } from 'react';
import { Doctor } from '@/types';
import { isMapValid } from './utils';
import { createDoctorMarker, flyToSelectedDoctor } from './useMarkerCreation';

/**
 * Hook for managing marker updates with retry logic
 */
export const useMarkerUpdater = (
  map: any,
  isMapInitialized: boolean,
  mountedRef: React.RefObject<boolean>,
  cleanupMarkers: () => void,
  addPopup: (popup: any) => void,
  setAllMarkers: (markers: any[]) => void
) => {
  const updateInProgress = useRef(false);
  const lastDoctorsRef = useRef<Doctor[]>([]);
  const lastSelectedDoctorRef = useRef<Doctor | null>(null);
  
  // Function to update markers
  const updateMarkers = useCallback((doctors: Doctor[], selectedDoctor: Doctor | null) => {
    // Store the current doctors and selected doctor for retry logic
    lastDoctorsRef.current = doctors;
    lastSelectedDoctorRef.current = selectedDoctor;
    
    // Prevent concurrent updates which may cause issues
    if (updateInProgress.current) {
      console.log("Marker update already in progress, skipping");
      return;
    }
    
    console.log("updateMarkers called with map:", !!map, "isMapInitialized:", isMapInitialized);
    
    if (!map || !isMapInitialized || !window.mapboxgl) {
      console.log("Cannot update markers, map not ready", {
        mapExists: !!map,
        isMapInitialized,
        mapboxGlExists: !!window.mapboxgl,
        componentMounted: mountedRef.current
      });
      return;
    }
    
    if (!mountedRef.current) {
      console.log("Component not mounted, skipping marker update");
      return;
    }
    
    // Check if map is valid before proceeding
    if (!isMapValid(map)) {
      console.log("Map is invalid, cannot update markers");
      return;
    }
    
    updateInProgress.current = true;
    
    try {
      // Clear existing markers and popups
      cleanupMarkers();
      
      // Collect new markers
      const newMarkers: any[] = [];
      
      // Only add markers if doctors exist and map is valid
      if (doctors.length > 0 && isMapValid(map)) {
        console.log(`Adding ${doctors.length} markers to map`);
        
        doctors.forEach(doctor => {
          const isSelected = selectedDoctor?.id === doctor.id;
          
          // Create marker and add to collection
          const marker = createDoctorMarker(doctor, isSelected, map, addPopup);
          if (marker) {
            newMarkers.push(marker);
            console.log(`Successfully added marker for doctor ${doctor.id}`);
          }
          
          // Show popup for selected doctor
          if (isSelected && isMapValid(map)) {
            flyToSelectedDoctor(doctor, map);
          }
        });
      }
      
      if (mountedRef.current) {
        setAllMarkers(newMarkers);
        console.log(`Successfully added ${newMarkers.length} markers to map`);
      }
    } catch (error) {
      console.error("Error in updateMarkers:", error);
    } finally {
      updateInProgress.current = false;
    }
  }, [map, isMapInitialized, cleanupMarkers, mountedRef, addPopup, setAllMarkers]);

  return {
    updateMarkers,
    lastDoctors: lastDoctorsRef,
    lastSelectedDoctor: lastSelectedDoctorRef
  };
};
