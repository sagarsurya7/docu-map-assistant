
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
    console.log("Added marker to collection, total markers:", markersRef.current.length);
    
    if (mountedRef.current) {
      setMarkers(prev => [...prev, marker]);
    }
  }, []);
  
  // Set all markers at once
  const setAllMarkers = useCallback((newMarkers: any[]) => {
    console.log("Setting all markers, count:", newMarkers.length);
    
    // Log marker locations for debugging
    if (newMarkers && newMarkers.length > 0) {
      console.log("First marker location:", newMarkers[0]._lngLat);
      const puneMarkers = newMarkers.filter(m => {
        const lat = m._lngLat?.lat || 0;
        const lng = m._lngLat?.lng || 0;
        return lat > 18.4 && lat < 18.7 && lng > 73.7 && lng < 74.0;  // Pune area approx
      });
      console.log("Markers in Pune area:", puneMarkers.length);
    }
    
    markersRef.current = [...newMarkers];
    
    if (mountedRef.current) {
      setMarkers(newMarkers);
    }
  }, []);
  
  // Clean up all markers and popups
  const cleanupMarkers = useCallback(() => {
    console.log("Cleaning up markers and popups");
    console.log("Markers to clean:", markersRef.current.length);
    console.log("Popups to clean:", popupsRef.current.length);
    
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
