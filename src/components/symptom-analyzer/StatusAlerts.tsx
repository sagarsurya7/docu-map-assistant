
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/api/apiClient';

interface StatusAlertsProps {
  error: string | null;
  usingFallbackData: boolean;
  refetch?: () => void;
}

const StatusAlerts: React.FC<StatusAlertsProps> = ({ error, usingFallbackData, refetch }) => {
  const retryConnection = () => {
    // Test the connection
    apiClient.get('/health')
      .then(() => {
        console.log('Connection restored, refreshing data');
        if (refetch) refetch();
      })
      .catch((error) => {
        console.error('Still unable to connect:', error);
      });
  };

  return (
    <>
      {error && !usingFallbackData && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex flex-col gap-2">
            <div>Error loading symptoms: {error}</div>
            {error.includes('Network Error') && (
              <Button variant="outline" size="sm" onClick={retryConnection} className="flex items-center gap-1 self-start">
                <RefreshCw className="h-3 w-3" />
                Retry Connection
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {usingFallbackData && (
        <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="flex flex-col gap-2">
            <div>Using demo symptom data - some features may be limited</div>
            <Button variant="outline" size="sm" onClick={retryConnection} className="flex items-center gap-1 text-amber-800 border-amber-400 self-start">
              <RefreshCw className="h-3 w-3" />
              Try Connecting to Backend
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default StatusAlerts;
