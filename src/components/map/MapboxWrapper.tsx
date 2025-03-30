
import React, { useEffect, useState, useRef } from 'react';
import { Doctor } from '@/types';
import DoctorInfoCard from './DoctorInfoCard';
import MapError from './MapError';
import MapStyles from './MapStyles';
import { useMapbox } from '@/hooks/useMapbox';
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
  const mountRef = useRef(true);
  const [tokenProvided, setTokenProvided] = useState(!!getMapboxToken());
  const updateMarkersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize Mapbox with delayed callbacks
  const { 
    mapRef, 
    isMapInitialized, 
    mapError, 
    updateMarkers, 
    reinitializeMap 
  } = useMapbox({
    onMapInitialized: () => {
      if (mountRef.current) {
        toast({
          title: "Map Initialized",
          description: "The map has been successfully loaded.",
        });
      }
    }
  });
  
  // Handle token submission
  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
    setTokenProvided(true);
    
    // Delay reinitializing map to ensure DOM is ready
    const timer = setTimeout(() => {
      if (mountRef.current) {
        reinitializeMap();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  };
  
  // Update markers when doctors or selected doctor changes
  useEffect(() => {
    // Clear any existing timeout to prevent race conditions
    if (updateMarkersTimeoutRef.current) {
      clearTimeout(updateMarkersTimeoutRef.current);
      updateMarkersTimeoutRef.current = null;
    }
    
    if (isMapInitialized && doctors.length > 0 && mountRef.current) {
      // Add delay to ensure the map is fully ready
      updateMarkersTimeoutRef.current = setTimeout(() => {
        if (mountRef.current) {
          updateMarkers(doctors, selectedDoctor);
          updateMarkersTimeoutRef.current = null;
        }
      }, 500);
    }
    
    return () => {
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
        updateMarkersTimeoutRef.current = null;
      }
    };
  }, [isMapInitialized, doctors, selectedDoctor, updateMarkers]);

  // Cleanup on unmount
  useEffect(() => {
    mountRef.current = true;
    
    return () => {
      mountRef.current = false;
      if (updateMarkersTimeoutRef.current) {
        clearTimeout(updateMarkersTimeoutRef.current);
        updateMarkersTimeoutRef.current = null;
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
            if (mountRef.current) {
              reinitializeMap();
            }
          }}
          onChangeToken={() => {
            if (mountRef.current) {
              setTokenProvided(false);
            }
          }}
        />
      ) : (
        <div ref={mapRef} className="h-full w-full mapbox-container"></div>
      )}
      {selectedDoctor && !mapError && isMapInitialized && (
        <DoctorInfoCard 
          doctor={selectedDoctor} 
          className="absolute bottom-4 left-4 w-64 shadow-lg" 
        />
      )}
    </div>
  );
};

export default MapboxWrapper;
