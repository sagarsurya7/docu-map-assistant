
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/api/apiClient';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [isConnectionIssue, setIsConnectionIssue] = useState<boolean>(false);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(false);

  const checkBackendStatus = async () => {
    setCheckingConnection(true);
    try {
      await apiClient.get('/health');
      setStatus('connected');
      setErrorDetails('');
      setIsConnectionIssue(false);
    } catch (error) {
      console.error('Backend connection error:', error);
      setStatus('disconnected');
      
      if (error instanceof Error) {
        setErrorDetails(error.message);
        
        // Check for connection issues
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
    
    // Check connection every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleManualCheck = () => {
    checkBackendStatus();
  };

  // Helper to determine if we're in a development environment
  const isDevelopment = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  };

  // Helper to determine if we're in the Lovable preview environment
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

  if (status === 'disconnected') {
    return (
      <Alert className="mb-4 border-red-200 bg-red-50">
        <XCircle className="h-4 w-4 text-red-500" />
        <AlertTitle>Backend unavailable</AlertTitle>
        <AlertDescription>
          Cannot connect to the backend.
          {isLovablePreview() && (
            <div className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
              <strong>You're viewing the app in Lovable's preview environment:</strong>
              <div className="mt-1">
                The preview can't connect to your local backend server. 
                This is expected behavior when using the Lovable preview.
              </div>
            </div>
          )}
          
          {isDevelopment() && isConnectionIssue && (
            <div className="mt-2 text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
              <strong>Connection Issue Detected:</strong> Your backend server needs to be running.
              <div className="mt-1">
                <ul className="list-disc pl-4">
                  <li>Ensure your backend server is running on port 3001</li>
                  <li>Check that the server has a <code>/api/health</code> endpoint</li>
                  <li>The Vite proxy is configured to forward API requests to your backend</li>
                </ul>
              </div>
            </div>
          )}
          
          {!isConnectionIssue && errorDetails && (
            <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              Error: {errorDetails}
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
              {checkingConnection ? 'Checking...' : 'Check Connection'}
            </Button>
          </div>
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
      </AlertDescription>
    </Alert>
  );
};

export default BackendStatus;
