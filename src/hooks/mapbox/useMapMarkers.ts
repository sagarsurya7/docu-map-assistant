
import { useRef } from 'react';
import { Doctor } from '@/types';
import { useMarkerCleanup } from './useMarkerCleanup';
import { useMarkerUpdater } from './useMarkerUpdater';

export const useMapMarkers = (
  map: any,
  isMapInitialized: boolean,
  mountedRef: React.RefObject<boolean>
) => {
  // Use the marker cleanup hook
  const {
    markers,
    popups,
    cleanupMarkers,
    addPopup,
    addMarker,
    setAllMarkers
  } = useMarkerCleanup(mountedRef);
  
  // Use the marker updater hook
  const {
    updateMarkers,
    lastDoctors,
    lastSelectedDoctor
  } = useMarkerUpdater(
    map,
    isMapInitialized,
    mountedRef,
    cleanupMarkers,
    addPopup,
    setAllMarkers
  );

  return {
    markers,
    popups,
    updateMarkers,
    cleanupMarkers,
    lastDoctors: lastDoctors.current,
    lastSelectedDoctor: lastSelectedDoctor.current
  };
};
