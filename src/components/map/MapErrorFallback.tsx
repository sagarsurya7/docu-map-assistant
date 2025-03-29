
import React from 'react';
import { Doctor } from '@/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import DoctorListFallback from './DoctorListFallback';
import DoctorInfoCard from './DoctorInfoCard';

interface MapErrorFallbackProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
  onRetry: () => void;
}

const MapErrorFallback: React.FC<MapErrorFallbackProps> = ({
  doctors,
  selectedDoctor,
  onSelectDoctor,
  onRetry
}) => {
  return (
    <div className="h-full relative bg-slate-50 flex p-6">
      {/* Left side - Doctor list */}
      <div className="w-full md:w-1/3 lg:w-1/4">
        <DoctorListFallback 
          doctors={doctors} 
          selectedDoctor={selectedDoctor} 
          onSelectDoctor={onSelectDoctor} 
        />
      </div>
      
      {/* Right side - Error message */}
      <div className="hidden md:flex md:flex-1 flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Radar Map Unavailable</AlertTitle>
            <AlertDescription>
              The location map couldn't be loaded due to connectivity issues or missing Radar API key.
            </AlertDescription>
          </Alert>
          
          <p className="text-sm text-muted-foreground mb-4">
            For a real application, you would need to provide a valid Radar API key.
          </p>
          
          <Button 
            variant="outline" 
            className="text-sm"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </div>
      </div>
      
      {/* Mobile error message - only shown on small screens */}
      <div className="md:hidden w-full text-center mt-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Radar Map Unavailable</AlertTitle>
          <AlertDescription>
            The location map couldn't be loaded.
          </AlertDescription>
        </Alert>
        
        <Button 
          variant="outline" 
          className="text-sm"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </div>
      
      {selectedDoctor && (
        <DoctorInfoCard 
          doctor={selectedDoctor} 
          className="absolute bottom-4 left-4 right-4 md:right-auto md:w-64 shadow-lg" 
        />
      )}
    </div>
  );
};

export default MapErrorFallback;
