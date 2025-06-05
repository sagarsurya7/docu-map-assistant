
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Server, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { getDoctors, getFilterOptions } from '@/api/doctorService';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [doctorCount, setDoctorCount] = useState<number>(0);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>('');

  const checkBackendStatus = async () => {
    console.log("🔍 BackendStatus: Starting backend status check...");
    setStatus('checking');
    setErrorDetails('');
    
    try {
      // Test the doctors endpoint
      console.log("🔍 BackendStatus: Testing doctors endpoint...");
      const doctors = await getDoctors();
      console.log("🔍 BackendStatus: Doctors response:", doctors);
      
      if (Array.isArray(doctors)) {
        setDoctorCount(doctors.length);
        setStatus('connected');
        console.log(`✅ BackendStatus: Successfully connected, found ${doctors.length} doctors`);
      } else {
        setStatus('error');
        setErrorDetails('Invalid response format from doctors endpoint');
        console.error("❌ BackendStatus: Invalid response format:", doctors);
      }
      
      setLastChecked(new Date());
    } catch (error: any) {
      console.error("❌ BackendStatus: Backend connection failed:", error);
      setStatus('error');
      setErrorDetails(error?.message || 'Unknown error');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'checking':
        return <Badge variant="outline">Checking...</Badge>;
      case 'connected':
        return <Badge variant="default" className="bg-green-600">Connected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  return (
    <Card className="mb-4 border-l-4 border-l-medical">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Server className="h-5 w-5 text-medical" />
            <div>
              <div className="flex items-center space-x-2">
                {getStatusIcon()}
                <span className="font-medium">Backend Status</span>
                {getStatusBadge()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {status === 'connected' && (
                  <div className="flex items-center space-x-2">
                    <Database className="h-3 w-3" />
                    <span>{doctorCount} doctors available</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="text-red-600">
                    Error: {errorDetails}
                  </div>
                )}
                {lastChecked && (
                  <div className="text-xs mt-1">
                    Last checked: {lastChecked.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkBackendStatus}
            disabled={status === 'checking'}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${status === 'checking' ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendStatus;
