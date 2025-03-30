
import React from 'react';
import { Button } from '@/components/ui/button';

interface MapErrorProps {
  message: string;
  onRetry?: () => void;
}

const MapError: React.FC<MapErrorProps> = ({ message, onRetry }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
      <div className="text-center p-4 max-w-md">
        <p className="text-red-500 mb-4">{message}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 justify-center">
          {onRetry && (
            <Button 
              onClick={onRetry} 
              className="px-4 py-2 bg-medical text-white rounded-md hover:bg-medical-dark"
            >
              Retry
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={() => window.location.reload()} 
            className="px-4 py-2 rounded-md"
          >
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapError;
