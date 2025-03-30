
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
  const mountedRef = useRef(true);
  const [tokenProvided, setTokenProvided] = useState(!!getMapboxToken());
  
  // Initialize Mapbox
  const { 
    mapRef, 
    isMapInitialized, 
    mapError, 
    updateMarkers, 
    reinitializeMap 
  } = useMapbox({
    onMapInitialized: () => {
      if (mountedRef.current) {
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
    
    // Short delay to ensure DOM is ready
    setTimeout(() => {
      if (mountedRef.current) {
        reinitializeMap();
      }
    }, 200);
  };
  
  // Update markers when doctors or selected doctor changes
  useEffect(() => {
    if (isMapInitialized && doctors.length > 0 && mountedRef.current) {
      // Add small delay to ensure the map is fully ready
      const timer = setTimeout(() => {
        if (mountedRef.current) {
          updateMarkers(doctors, selectedDoctor);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isMapInitialized, doctors, selectedDoctor, updateMarkers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
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
            if (mountedRef.current) {
              reinitializeMap();
            }
          }}
          onChangeToken={() => {
            if (mountedRef.current) {
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
