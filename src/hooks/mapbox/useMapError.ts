
import { useState, useCallback } from 'react';

export const useMapError = (onMapError?: (error: Error) => void) => {
  const [mapError, setMapError] = useState<string | null>(null);

  const handleMapError = useCallback((error: Error | string) => {
    const errorMessage = typeof error === 'string' 
      ? error 
      : error.message || "Unknown map error";
    
    console.error("Map error:", errorMessage);
    setMapError(errorMessage);
    
    if (onMapError) {
      onMapError(typeof error === 'string' ? new Error(error) : error);
    }
  }, [onMapError]);

  return { 
    mapError, 
    setMapError,
    handleMapError 
  };
};
