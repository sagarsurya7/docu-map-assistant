
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Info, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiClient from '@/api/apiClient';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [errorDetails, setErrorDetails] = useState<string>('');
  const [isConnectionIssue, setIsConnectionIssue] = useState<boolean>(false);
  const [isCorsIssue, setIsCorsIssue] = useState<boolean>(false);
  const [checkingConnection, setCheckingConnection] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<any>(null);

  const checkBackendStatus = async () => {
    setCheckingConnection(true);
    try {
      const response = await apiClient.get('/health');
      setStatus('connected');
      setErrorDetails('');
      setIsConnectionIssue(false);
      setIsCorsIssue(false);
      
      // Store health data if available
      if (response.data) {
        console.log('Backend health data:', response.data);
        setHealthData(response.data);
      }
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
        
        // Check for potential CORS issues
        if (error.message.includes('CORS') || (error as any).code === 'ERR_NETWORK') {
          setIsCorsIssue(true);
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
                  <li>Check that the server has a <code>/health</code> endpoint</li>
                  <li>If your backend uses a different URL, update in apiClient.ts</li>
                </ul>
              </div>
            </div>
          )}
          
          {isDevelopment() && isCorsIssue && (
            <div className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
              <strong>Possible CORS Issue:</strong> Your backend might need CORS headers.
              <div className="mt-1">
                <p>Add these headers to your backend responses:</p>
                <pre className="bg-white p-1 mt-1 rounded text-orange-800 overflow-auto">
{`Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization
Access-Control-Allow-Credentials: true`}
                </pre>
              </div>
              <a 
                href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center mt-2 text-blue-600 hover:underline"
              >
                Learn about CORS <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
          
          {!isConnectionIssue && !isCorsIssue && errorDetails && (
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
