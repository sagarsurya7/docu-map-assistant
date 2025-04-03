
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import apiClient from '@/api/apiClient';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [isConnectionIssue, setIsConnectionIssue] = useState<boolean>(false);

  useEffect(() => {
    const checkBackendStatus = async () => {
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
          if (error.message.includes('NetworkError') || 
              error.message.includes('Network Error') || 
              (error as any).code === 'ERR_NETWORK') {
            setIsConnectionIssue(true);
          }
        } else {
          setErrorDetails('Unknown error occurred');
        }
      }
    };

    checkBackendStatus();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

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
          Cannot connect to the backend. Make sure the server is running at http://localhost:3001
          {isConnectionIssue && (
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
