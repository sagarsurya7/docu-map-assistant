
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
    <div className="h-full relative bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Map Service Unavailable</AlertTitle>
          <AlertDescription>
            The map couldn't be loaded due to connectivity issues or missing Radar API key.
          </AlertDescription>
        </Alert>
        
        <DoctorListFallback 
          doctors={doctors} 
          selectedDoctor={selectedDoctor} 
          onSelectDoctor={onSelectDoctor} 
        />
        
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
      
      {selectedDoctor && (
        <DoctorInfoCard 
          doctor={selectedDoctor} 
          className="absolute bottom-4 left-4 right-4 md:left-auto md:right-auto md:w-64 shadow-lg" 
        />
      )}
    </div>
  );
};

export default MapErrorFallback;
