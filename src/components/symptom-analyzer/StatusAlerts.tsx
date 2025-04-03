
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface StatusAlertsProps {
  error: string | null;
  usingFallbackData: boolean;
}

const StatusAlerts: React.FC<StatusAlertsProps> = ({ error, usingFallbackData }) => {
  return (
    <>
      {error && !usingFallbackData && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error loading symptoms: {error}
          </AlertDescription>
        </Alert>
      )}
      
      {usingFallbackData && (
        <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            Using demo symptom data - some features may be limited
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default StatusAlerts;
