
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
        .radar-map-container {
          height: 100%;
          width: 100%;
        }
      `}
    </style>
  );
};

export default MapStyles;
