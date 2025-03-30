
import React from 'react';

interface MapErrorProps {
  message: string;
}

const MapError: React.FC<MapErrorProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
      <div className="text-center p-4">
        <p className="text-red-500 mb-2">{message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-medical text-white rounded-md hover:bg-medical-dark"
        >
          Refresh Page
        </button>
      </div>
    </div>
  );
};

export default MapError;
