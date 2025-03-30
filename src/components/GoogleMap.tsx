
import React, { useState, useEffect, useRef } from 'react';
import { Doctor } from '@/types';
import MapboxWrapper from './map/MapboxWrapper';
import { Skeleton } from '@/components/ui/skeleton';

interface GoogleMapProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor 
}) => {
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(true);
  
  // Use ref instead of state to prevent unnecessary remounts
  const mapKeyRef = useRef(Date.now());
  
  // Track if component is mounted
  const isMounted = useRef(true);
  
  // Detect and handle persistent map errors
  useEffect(() => {
    if (mapError) {
      console.log(`Map error detected: ${mapError}`);
      const timer = setTimeout(() => {
        if (isMounted.current) {
          console.log("Forcing map component remount");
          mapKeyRef.current = Date.now(); // Update ref instead of state
          // Force re-render without changing component hierarchy
          setIsMapLoading(prev => !prev);
        }
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [mapError]);
  
  // Track component mounting state
  useEffect(() => {
    isMounted.current = true;
    console.log("GoogleMap component mounted");
    
    return () => {
      console.log("GoogleMap component ACTUAL unmount");
      isMounted.current = false;
    };
  }, []);

  return (
    <div className="h-full relative">
      <MapboxWrapper
        key={mapKeyRef.current}
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        onSelectDoctor={onSelectDoctor}
      />
    </div>
  );
};

export default GoogleMap;
