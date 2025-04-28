
import { useState, useRef, useCallback } from 'react';

export const useMarkerCleanup = (mountedRef: React.RefObject<boolean>) => {
  const [markers, setMarkers] = useState<any[]>([]);
  const [popups, setPopups] = useState<any[]>([]);
  const markersRef = useRef<any[]>([]);
  const popupsRef = useRef<any[]>([]);
  
  // Add a new popup to the collection
  const addPopup = useCallback((popup: any) => {
    if (!popup) return;
    
    popupsRef.current.push(popup);
    
    if (mountedRef.current) {
      setPopups(prev => [...prev, popup]);
    }
  }, []);
  
  // Add a new marker to the collection
  const addMarker = useCallback((marker: any) => {
    if (!marker) return;
    
    markersRef.current.push(marker);
    
    if (mountedRef.current) {
      setMarkers(prev => [...prev, marker]);
    }
  }, []);
  
  // Set all markers at once
  const setAllMarkers = useCallback((newMarkers: any[]) => {
    markersRef.current = [...newMarkers];
    
    if (mountedRef.current) {
      setMarkers(newMarkers);
    }
  }, []);
  
  // Clean up all markers and popups
  const cleanupMarkers = useCallback(() => {
    console.log("Cleaning up markers and popups");
    
    // Clean up markers
    markersRef.current.forEach(marker => {
      if (marker) {
        try {
          marker.remove();
        } catch (e) {
          console.log("Error removing marker:", e);
        }
      }
    });
    markersRef.current = [];
    
    // Clean up popups
    popupsRef.current.forEach(popup => {
      if (popup) {
        try {
          popup.remove();
        } catch (e) {
          console.log("Error removing popup:", e);
        }
      }
    });
    popupsRef.current = [];
    
    // Update state if component is still mounted
    if (mountedRef.current) {
      setMarkers([]);
      setPopups([]);
    }
  }, []);
  
  return {
    markers,
    popups,
    addMarker,
    addPopup,
    setAllMarkers,
    cleanupMarkers
  };
};
