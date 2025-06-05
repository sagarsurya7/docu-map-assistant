
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import apiClient from '@/apiClient';
import { getDoctors } from '@/api/doctorService';

const BackendStatus = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [doctorCount, setDoctorCount] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const checkBackendStatus = async () => {
    console.log('🔍 BackendStatus: Checking backend connection...');
    console.log('🔗 BackendStatus: API Base URL:', apiClient.defaults.baseURL);
    
    setStatus('checking');
    setError('');
    
    try {
      // Test basic connectivity
      console.log('📡 BackendStatus: Testing /health endpoint...');
      const healthResponse = await apiClient.get('/health');
      console.log('✅ BackendStatus: Health check response:', healthResponse.data);
      
      // Test doctors endpoint
      console.log('📡 BackendStatus: Testing /doctors endpoint...');
      const doctors = await getDoctors();
      console.log(`✅ BackendStatus: Got ${doctors.length} doctors from API`);
      
      setDoctorCount(doctors.length);
      setStatus('connected');
      
      // Log sample doctor data
      if (doctors.length > 0) {
        console.log('👨‍⚕️ BackendStatus: Sample doctor:', doctors[0]);
      }
      
    } catch (err: any) {
      console.error('❌ BackendStatus: Backend check failed:', err);
      setStatus('disconnected');
      setError(err.message || 'Unknown error');
      setDoctorCount(0);
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return `Connected (${doctorCount} doctors)`;
      case 'disconnected': return 'Disconnected';
      default: return 'Checking...';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Backend Status
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            API URL: {apiClient.defaults.baseURL}
          </p>
          {error && (
            <p className="text-sm text-red-600">
              Error: {error}
            </p>
          )}
          <Button onClick={checkBackendStatus} className="w-full">
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendStatus;
