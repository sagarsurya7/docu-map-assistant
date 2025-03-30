
import React from 'react';

const MapStyles: React.FC = () => {
  return (
    <style>
      {`
        .selected-marker {
          animation: bounce 1s infinite alternate;
        }
        
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-10px); }
        }
        
        /* Ensure map container takes full height */
        .mapbox-container {
          height: 100%;
          width: 100%;
        }
        
        /* Style the mapbox controls */
        .mapboxgl-ctrl-top-right {
          margin-top: 10px;
          margin-right: 10px;
        }
        
        /* Style the popups */
        .mapboxgl-popup-content {
          padding: 10px;
          border-radius: 6px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
      `}
    </style>
  );
};

export default MapStyles;
