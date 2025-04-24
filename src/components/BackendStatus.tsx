
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '../apiClient';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [isConnectionIssue, setIsConnectionIssue] = useState<boolean>(false);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<any>(null);

  const checkBackendStatus = async () => {
    setCheckingConnection(true);
    try {
      const response = await apiClient.get('/health');
      setStatus('connected');
      setErrorDetails('');
      setIsConnectionIssue(false);
      
      if (response.data) {
        console.log('Backend health data:', response.data);
        setHealthData(response.data);
      }
    } catch (error) {
      console.error('Backend connection error:', error);
      setStatus('disconnected');
      
      if (error instanceof Error) {
        setErrorDetails(error.message);
        
        if (
          error.message.includes('NetworkError') || 
          error.message.includes('Network Error') || 
          (error as any).code === 'ERR_NETWORK' ||
          (error as any).code === 'ECONNABORTED'
        ) {
          setIsConnectionIssue(true);
        }
      } else {
        setErrorDetails('Unknown error occurred');
      }
    } finally {
      setCheckingConnection(false);
    }
  };

  useEffect(() => {
    checkBackendStatus();
    
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleManualCheck = () => {
    checkBackendStatus();
  };

  const isDevelopment = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  };

  const isLovablePreview = () => {
    return window.location.hostname.includes('lovable.app') || 
           window.location.hostname.includes('lovableproject.com');
  };

  if (status === 'loading') {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertTitle>Checking connection</AlertTitle>
        <AlertDescription>
          Connecting to backend services...
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="mb-4 border-green-200 bg-green-50">
      <CheckCircle className="h-4 w-4 text-green-500" />
      <AlertTitle>Backend connected</AlertTitle>
      <AlertDescription>
        Successfully connected to the backend services.
        
        {healthData && (
          <div className="mt-2 p-2 bg-white rounded border border-green-100 text-xs">
            <div className="flex items-center">
              <Info className="h-3 w-3 text-blue-500 mr-1" />
              <span className="font-medium">API Version:</span>
              <span className="ml-1">{healthData.version || 'Unknown'}</span>
            </div>
            
            {healthData.environment && (
              <div className="mt-1">
                <span className="font-medium">Environment:</span>
                <span className="ml-1">{healthData.environment}</span>
              </div>
            )}
            
            {healthData.uptime && (
              <div className="mt-1">
                <span className="font-medium">Uptime:</span>
                <span className="ml-1">{typeof healthData.uptime === 'number' ? `${Math.floor(healthData.uptime / 60)} minutes` : healthData.uptime}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleManualCheck}
            disabled={checkingConnection}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${checkingConnection ? 'animate-spin' : ''}`} />
            {checkingConnection ? 'Checking...' : 'Refresh Status'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default BackendStatus;
