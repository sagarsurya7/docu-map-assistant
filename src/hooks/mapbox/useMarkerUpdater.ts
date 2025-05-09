
import { useCallback, useRef } from 'react';
import { Doctor } from '@/types';
import { isMapValid } from './utils';
import { createDoctorMarker } from './useMarkerCreation';

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
    // Ensure doctors is always an array
    const safeDoctors = Array.isArray(doctors) ? doctors : [];
    
    // Store the current doctors and selected doctor for retry logic
    lastDoctorsRef.current = safeDoctors;
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
      // Clear existing markers and popups first
      cleanupMarkers();
      
      // Collect new markers
      const newMarkers: any[] = [];
      
      // Only add markers if doctors exist and map is valid
      if (safeDoctors.length > 0 && isMapValid(map)) {
        console.log(`Adding ${safeDoctors.length} markers to map, selected doctor: ${selectedDoctor?.id || 'none'}`);
        
        // First add non-selected doctors so selected one appears on top
        [...safeDoctors]
          .sort((a, b) => {
            // Sort so selected doctor is processed last (appears on top)
            if (a.id === selectedDoctor?.id) return 1;
            if (b.id === selectedDoctor?.id) return -1;
            return 0;
          })
          .forEach(doctor => {
            // Skip invalid doctor data
            if (!doctor || typeof doctor !== 'object' || !doctor.id) {
              console.warn("Invalid doctor object skipped", doctor);
              return;
            }
            
            const isSelected = selectedDoctor?.id === doctor.id;
            
            // Create marker and add to collection
            const marker = createDoctorMarker(doctor, isSelected, map, addPopup);
            if (marker) {
              newMarkers.push(marker);
              console.log(`Successfully added ${isSelected ? 'blue' : 'red'} marker for doctor ${doctor.id}`);
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
