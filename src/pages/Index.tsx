
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import { CopilotKit } from '@copilotkit/react-core';
import { useDoctorsData } from '@/hooks/use-doctors-data';
import MobileView from '@/components/layout/MobileView';
import DesktopView from '@/components/layout/DesktopView';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Activity } from 'lucide-react';
import BackendStatus from '@/components/BackendStatus';
import { toast } from '@/components/ui/use-toast';

// For demo purposes we're using a demo API key
// In production, you should use an environment variable
const COPILOT_API_KEY = "demo-public-key";

const Index = () => {
  const {
    isLoading,
    allDoctors,
    selectedDoctor,
    handleSelectDoctor,
    error
  } = useDoctorsData();

  const [showChatBot, setShowChatBot] = useState(true);
  const [showDoctorsList, setShowDoctorsList] = useState(true);
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'list' | 'map' | 'chat'>('list');
  
  const toggleChatBot = () => setShowChatBot(!showChatBot);
  const toggleDoctorsList = () => setShowDoctorsList(!showDoctorsList);
  
  // Handle data errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Data Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error]);

  // Ensure allDoctors is always an array
  const safeDoctors = Array.isArray(allDoctors) ? allDoctors : [];
  
  // Reset mobile view to list when switching between mobile and desktop
  useEffect(() => {
    if (isMobile) {
      setMobileView('list');
    }
  }, [isMobile]);
  
  return (
    <CopilotKit publicApiKey={COPILOT_API_KEY}>
      <div className="flex flex-col h-screen">
        <Header 
          isMobile={isMobile} 
          toggleMobileMenu={() => setMobileView('list')} 
        />
        
        <div className="container mx-auto px-4 py-2">
          
          <div className="mb-3">
            <Button asChild>
              <Link to="/symptom-analyzer" className="flex items-center">
                <Activity className="mr-2 h-4 w-4" />
                Symptom Analyzer
              </Link>
            </Button>
          </div>
        </div>
        
        <main className="flex-1 overflow-hidden">
          {isMobile ? (
            <MobileView
              mobileView={mobileView}
              setMobileView={setMobileView}
              isLoading={isLoading}
              allDoctors={safeDoctors}
              selectedDoctor={selectedDoctor}
              handleSelectDoctor={(doctor) => {
                handleSelectDoctor(doctor);
                if (isMobile) {
                  setMobileView('map');
                }
              }}
            />
          ) : (
            <DesktopView
              isLoading={isLoading}
              allDoctors={safeDoctors}
              selectedDoctor={selectedDoctor}
              onSelectDoctor={handleSelectDoctor}
              showChatBot={showChatBot}
              showDoctorsList={showDoctorsList}
              toggleChatBot={toggleChatBot}
              toggleDoctorsList={toggleDoctorsList}
            />
          )}
        </main>
      </div>
    </CopilotKit>
  );
};

export default Index;
