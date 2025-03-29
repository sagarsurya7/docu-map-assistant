
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import { CopilotKit } from '@copilotkit/react-core';
import { useDoctorsData } from '@/hooks/use-doctors-data';
import MobileView from '@/components/layout/MobileView';
import DesktopView from '@/components/layout/DesktopView';

// For demo purposes we're using a demo API key
// In production, you should use an environment variable
const COPILOT_API_KEY = "demo-public-key";

const Index = () => {
  const {
    isLoading,
    allDoctors,
    selectedDoctor,
    handleSelectDoctor
  } = useDoctorsData();

  const [showChatBot, setShowChatBot] = useState(true);
  const [showDoctorsList, setShowDoctorsList] = useState(true);
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'list' | 'map' | 'chat'>('list');
  
  const toggleChatBot = () => setShowChatBot(!showChatBot);
  const toggleDoctorsList = () => setShowDoctorsList(!showDoctorsList);
  
  return (
    <CopilotKit publicApiKey={COPILOT_API_KEY}>
      <div className="flex flex-col h-screen">
        <Header 
          isMobile={isMobile} 
          toggleMobileMenu={() => setMobileView('list')} 
        />
        
        <main className="flex-1 overflow-hidden">
          {isMobile ? (
            <MobileView
              mobileView={mobileView}
              setMobileView={setMobileView}
              isLoading={isLoading}
              allDoctors={allDoctors}
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
              allDoctors={allDoctors}
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
