
import React from 'react';

const MapStyles: React.FC = () => {
  return (
    <style jsx global>{`
      .mapbox-container {
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
      }
      
      .marker {
        background-size: 100% 100%;
        background-repeat: no-repeat;
        cursor: pointer;
        width: 32px;
        height: 32px;
        z-index: 1;
      }
      
      .selected-marker {
        z-index: 10 !important;
        transform: scale(1.2);
        filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.3));
      }
      
      /* Override mapbox's z-index to ensure markers are always visible */
      .mapboxgl-marker {
        z-index: 5 !important;
      }
      
      .mapboxgl-marker.selected-marker {
        z-index: 10 !important;
      }
      
      /* Make popups appear above markers */
      .mapboxgl-popup {
        z-index: 20 !important;
      }
    `}</style>
  );
};

export default MapStyles;
