
export interface UseMapboxProps {
  onMapInitialized?: (mapInstance: any) => void;
  onMapError?: (error: Error) => void;
  componentId?: string; // For better debugging and tracking
}
