
export interface UseMapboxProps {
  onMapInitialized?: (mapInstance: any) => void;
  onMapError?: (error: Error) => void;
}

// Add Mapbox types to window
declare global {
  interface Window {
    mapboxgl: any;
  }
}
