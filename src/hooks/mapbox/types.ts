
export interface UseMapboxProps {
  onMapInitialized?: (mapInstance: any) => void;
  onMapError?: (error: Error) => void;
  componentId?: string; // Added component ID for better debugging
}
