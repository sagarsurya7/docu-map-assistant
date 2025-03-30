
import React, { useState } from 'react';
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

  // Handle map errors at this level
  const handleMapError = (error: Error) => {
    console.error("Map error:", error);
    setMapError(error.message || "Unable to load map");
    setIsMapLoading(false);
  };

  if (mapError) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-100">
        <div className="text-center max-w-md p-4">
          <div className="text-red-500 mb-4">{mapError}</div>
          <button 
            onClick={() => {
              setMapError(null);
              setIsMapLoading(true);
            }} 
            className="px-4 py-2 bg-medical text-white rounded-md hover:bg-medical-dark"
          >
            Retry Loading Map
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <MapboxWrapper
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        onSelectDoctor={onSelectDoctor}
      />
    </div>
  );
};

export default GoogleMap;
