
import React, { useEffect, useState, useRef } from 'react';
import { Doctor } from '@/types';
import DoctorInfoCard from './DoctorInfoCard';
import MapError from './MapError';
import MapStyles from './MapStyles';
import { useMapbox } from '@/hooks/mapbox/useMapbox';
import { toast } from '@/components/ui/use-toast';

interface MapboxWrapperProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const MapboxWrapper: React.FC<MapboxWrapperProps> = ({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor 
}) => {
  const isMounted = useRef(true);
  const [isLoading, setIsLoading] = useState(true);
  const updateMarkersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const markersUpdatedRef = useRef(false);
  const initialMarkersSet = useRef(false);
  
  // Initialize Mapbox with callbacks
  const { 
    mapRef, 
    map,
    isMapInitialized, 
    mapError, 
    updateMarkers, 
    reinitializeMap 
  } = useMapbox({
    onMapInitialized: (mapInstance) => {
      if (isMounted.current) {
        console.log("Map initialized callback in MapboxWrapper with map");
        setIsLoading(false);
        
        // Set a flag to update markers once the map is fully initialized
        markersUpdatedRef.current = false;
        initialMarkersSet.current = false;
        
        // Show success toast
        toast({
          title: "Map Initialized",
          description: "The map has been successfully loaded.",
        });
      }
    },
    onMapError: (error) => {
      if (isMounted.current) {
        setIsLoading(false);
        console.error("Map initialization error:", error);
        
        // Show error toast
        toast({
          title: "Map Error",
          description: error.message || "Failed to initialize map",
          variant: "destructive"
        });
      }
    }
  });
  
  // Update markers when map is initialized with a delay
  useEffect(() => {
    if (isMapInitialized && map && !initialMarkersSet.current && doctors.length > 0) {
      console.log("Initial map markers setup");
      
      // Mark that we've scheduled the initial update
      initialMarkersSet.current = true;
      
      // Add markers after a delay to ensure map is fully ready
      const timer = setTimeout(() => {
        if (isMounted.current && map) {
          console.log("Executing initial marker update");
          markersUpdatedRef.current = true;
          try {
            updateMarkers(doctors, selectedDoctor);
          } catch (error) {
            console.error("Error in initial marker update:", error);
          }
        }
      }, 500); // Increased delay for initial markers
      
      return () => clearTimeout(timer);
    }
  }, [isMapInitialized, map, doctors, selectedDoctor, updateMarkers]);
  
  // Update markers when doctors or selected doctor changes
  useEffect(() => {
    // Skip if initial markers haven't been set yet
    if (!markersUpdatedRef.current) {
      return;
    }
    
    // Clear any existing timeout
    if (updateMarkersTimeoutRef.current) {
      clearTimeout(updateMarkersTimeoutRef.current);
      updateMarkersTimeoutRef.current = null;
    }
    
    if (isMapInitialized && map && doctors.length > 0 && isMounted.current) {
      console.log("Scheduling marker update for doctor/selection change", { 
        initialized: isMapInitialized, 
        doctorsCount: doctors.length,
        selectedDoctor: selectedDoctor?.id,
        mapExists: !!map
      });
      
      // Add delay to ensure map is ready
      updateMarkersTimeoutRef.current = setTimeout(() => {
        if (isMounted.current && map) {
          console.log("Executing scheduled marker update");
          try {
            updateMarkers(doctors, selectedDoctor);
          } catch (error) {
            console.error("Error updating markers:", error);
          }
        } else {
          console.log("Component unmounted or map not available, skipping marker update");
        }
      }, 300);
    } else {
      console.log("Not updating markers due to conditions not met", { 
        initialized: isMapInitialized, 
        doctorsCount: doctors.length,
        isMounted: isMounted.current,
        mapExists: !!map
      });
    }
    
    return () => {
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
        updateMarkersTimeoutRef.current = null;
      }
    };
  }, [isMapInitialized, doctors, selectedDoctor, updateMarkers, map]);

  // Cleanup on mount/unmount
  useEffect(() => {
    console.log("MapboxWrapper mounted");
    isMounted.current = true;
    
    return () => {
      console.log("MapboxWrapper unmounting");
      isMounted.current = false;
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
        updateMarkersTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="h-full relative">
      <MapStyles />
      {mapError ? (
        <MapError 
          message={mapError} 
          onRetry={() => {
            if (isMounted.current) {
              setIsLoading(true);
              markersUpdatedRef.current = false;
              initialMarkersSet.current = false;
              reinitializeMap();
            }
          }}
        />
      ) : (
        <>
          <div ref={mapRef} className="h-full w-full mapbox-container"></div>
          {isLoading && (
            <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical mb-4"></div>
                <p className="text-medical-dark">Loading map...</p>
              </div>
            </div>
          )}
        </>
      )}
      {selectedDoctor && !mapError && isMapInitialized && !isLoading && (
        <DoctorInfoCard 
          doctor={selectedDoctor} 
          className="absolute bottom-4 left-4 w-64 shadow-lg" 
        />
      )}
    </div>
  );
};

export default MapboxWrapper;
