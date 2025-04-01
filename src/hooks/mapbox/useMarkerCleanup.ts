
import { useState, useCallback } from 'react';

/**
 * Hook for managing marker and popup cleanup
 */
export const useMarkerCleanup = (mountedRef: React.RefObject<boolean>) => {
  const [markers, setMarkers] = useState<any[]>([]);
  const [popups, setPopups] = useState<any[]>([]);
  
  // Function to safely cleanup markers
  const cleanupMarkers = useCallback(() => {
    if (!mountedRef.current) return;
    
    console.log(`Cleaning up ${markers.length} markers and ${popups.length} popups`);
    
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
  
  // Function to add a popup to the tracked list
  const addPopup = useCallback((popup: any) => {
    setPopups(prev => [...prev, popup]);
  }, []);
  
  // Function to add a marker to the tracked list
  const addMarker = useCallback((marker: any) => {
    setMarkers(prev => [...prev, marker]);
  }, []);
  
  // Function to add multiple markers at once
  const setAllMarkers = useCallback((newMarkers: any[]) => {
    setMarkers(newMarkers);
  }, []);

  return {
    markers,
    popups,
    cleanupMarkers,
    addPopup,
    addMarker,
    setAllMarkers
  };
};
