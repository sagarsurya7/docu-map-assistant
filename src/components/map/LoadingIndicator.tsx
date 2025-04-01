
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical mb-4"></div>
        <p className="text-medical-dark">Loading map...</p>
      </div>
    </div>
  );
};

export default LoadingIndicator;
