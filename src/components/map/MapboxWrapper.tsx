
import React, { useEffect, useState, useRef } from 'react';
import { Doctor } from '@/types';
import DoctorInfoCard from './DoctorInfoCard';
import MapError from './MapError';
import MapStyles from './MapStyles';
import { useMapbox } from '@/hooks/mapbox/useMapbox';
import MapTokenInput from './MapTokenInput';
import { setMapboxToken, getMapboxToken } from '@/utils/mapLoader';
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
  const [tokenProvided, setTokenProvided] = useState(!!getMapboxToken());
  const [isLoading, setIsLoading] = useState(true);
  const updateMarkersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize Mapbox with callbacks
  const { 
    mapRef, 
    isMapInitialized, 
    mapError, 
    updateMarkers, 
    reinitializeMap 
  } = useMapbox({
    onMapInitialized: () => {
      if (isMounted.current) {
        setIsLoading(false);
        console.log("Map initialized successfully!");
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
        
        // Show error toast to make the error visible to the user
        toast({
          title: "Map Error",
          description: error.message || "Failed to initialize map",
          variant: "destructive"
        });
      }
    }
  });
  
  // Handle token submission
  const handleTokenSubmit = (token: string) => {
    if (!token || token.trim().length < 20) {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid Mapbox token",
        variant: "destructive"
      });
      return;
    }
    
    setMapboxToken(token);
    setTokenProvided(true);
    setIsLoading(true);
    
    // Short delay before reinitializing
    setTimeout(() => {
      if (isMounted.current) {
        console.log("Reinitializing map with new token:", token.substring(0, 10) + "...");
        reinitializeMap();
      }
    }, 300);
  };
  
  // Update markers when doctors or selected doctor changes
  useEffect(() => {
    // Clear any existing timeout
    if (updateMarkersTimeoutRef.current) {
      clearTimeout(updateMarkersTimeoutRef.current);
    }
    
    if (isMapInitialized && doctors.length > 0 && isMounted.current) {
      console.log("Scheduling marker update", { 
        initialized: isMapInitialized, 
        doctorsCount: doctors.length 
      });
      
      // Add delay to ensure map is ready
      updateMarkersTimeoutRef.current = setTimeout(() => {
        if (isMounted.current && mapRef.current) {
          console.log("Executing scheduled marker update");
          try {
            updateMarkers(doctors, selectedDoctor);
          } catch (error) {
            console.error("Error updating markers:", error);
          }
        } else {
          console.log("Component unmounted or mapRef not available, skipping marker update");
        }
      }, 500);
    } else {
      console.log("Not updating markers due to conditions not met", { 
        initialized: isMapInitialized, 
        doctorsCount: doctors.length,
        isMounted: isMounted.current
      });
    }
    
    return () => {
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
      }
    };
  }, [isMapInitialized, doctors, selectedDoctor, updateMarkers, mapRef]);

  // Cleanup on mount/unmount
  useEffect(() => {
    console.log("MapboxWrapper mounted");
    isMounted.current = true;
    
    return () => {
      console.log("MapboxWrapper unmounting");
      isMounted.current = false;
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
      }
    };
  }, []);

  // If no token is provided, show the token input
  if (!tokenProvided) {
    return <MapTokenInput onSubmit={handleTokenSubmit} />;
  }

  return (
    <div className="h-full relative">
      <MapStyles />
      {mapError ? (
        <MapError 
          message={mapError} 
          onRetry={() => {
            if (isMounted.current) {
              setIsLoading(true);
              reinitializeMap();
            }
          }}
          onChangeToken={() => {
            if (isMounted.current) {
              setTokenProvided(false);
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
