
import React, { useState, useEffect } from 'react';
import { doctors } from '../data/doctors';
import { Doctor } from '../types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import DoctorsList from '@/components/DoctorsList';
import GoogleMap from '@/components/GoogleMap';
import ChatBot from '@/components/ChatBot';
import Header from '@/components/Header';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopilotKit } from '@copilotkit/react-core';
import { toast } from '@/components/ui/use-toast';

// For demo purposes we're using a demo API key
// In production, you should use an environment variable
const COPILOT_API_KEY = "demo-public-key";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showChatBot, setShowChatBot] = useState(true);
  const [showDoctorsList, setShowDoctorsList] = useState(true);
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<'list' | 'map' | 'chat'>('list');
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setAllDoctors(doctors);
      setIsLoading(false);
      // Show welcome toast
      toast({
        title: "Welcome to AI Doctor Nearby",
        description: "Find specialists near you and get AI-powered health guidance",
      });
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    if (isMobile) {
      setMobileView('map');
    }
  };
  
  // Toggle panels for desktop view
  const toggleChatBot = () => setShowChatBot(!showChatBot);
  const toggleDoctorsList = () => setShowDoctorsList(!showDoctorsList);
  
  // Render mobile view
  if (isMobile) {
    return (
      <CopilotKit publicApiKey={COPILOT_API_KEY}>
        <div className="flex flex-col h-screen">
          <Header isMobile={isMobile} toggleMobileMenu={() => setMobileView('list')} />
          
          <main className="flex-1 overflow-hidden">
            {mobileView === 'list' && (
              <div className="h-full">
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[160px]" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-1/2" />
                          <Skeleton className="h-8 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <DoctorsList 
                    doctors={allDoctors} 
                    selectedDoctor={selectedDoctor} 
                    onSelectDoctor={handleSelectDoctor} 
                  />
                )}
                
                <div className="fixed bottom-4 right-4 z-10 flex space-x-2">
                  <Button 
                    className="h-12 w-12 rounded-full bg-medical hover:bg-medical-dark shadow-lg"
                    onClick={() => setMobileView('map')}
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/854/854878.png" 
                      alt="Map" 
                      className="h-6 w-6" 
                    />
                  </Button>
                  <Button 
                    className="h-12 w-12 rounded-full bg-medical hover:bg-medical-dark shadow-lg"
                    onClick={() => setMobileView('chat')}
                  >
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png" 
                      alt="Chat" 
                      className="h-6 w-6" 
                    />
                  </Button>
                </div>
              </div>
            )}
            
            {mobileView === 'map' && (
              <div className="h-full relative">
                <GoogleMap 
                  doctors={allDoctors} 
                  selectedDoctor={selectedDoctor}
                  onSelectDoctor={handleSelectDoctor} 
                />
                <Button 
                  className="absolute top-4 left-4 z-10 h-10 w-10 rounded-full bg-white shadow-lg text-medical p-0"
                  variant="outline"
                  onClick={() => setMobileView('list')}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </div>
            )}
            
            {mobileView === 'chat' && (
              <div className="h-full relative">
                <ChatBot />
                <Button 
                  className="absolute top-4 left-4 z-10 h-10 w-10 rounded-full bg-white shadow-lg text-medical p-0"
                  variant="outline"
                  onClick={() => setMobileView('list')}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </CopilotKit>
    );
  }
  
  // Render desktop view
  return (
    <CopilotKit publicApiKey={COPILOT_API_KEY}>
      <div className="flex flex-col h-screen">
        <Header isMobile={false} toggleMobileMenu={() => {}} />
        
        <main className="flex-1 flex overflow-hidden">
          {/* Left Panel: Doctors List */}
          <div className={`bg-white ${showDoctorsList ? 'w-1/4' : 'w-0'} transition-width duration-300 overflow-hidden relative border-r`}>
            {showDoctorsList && (
              <>
                {isLoading ? (
                  <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[160px]" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full" />
                        <div className="flex space-x-2">
                          <Skeleton className="h-8 w-1/2" />
                          <Skeleton className="h-8 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <DoctorsList 
                    doctors={allDoctors} 
                    selectedDoctor={selectedDoctor} 
                    onSelectDoctor={handleSelectDoctor} 
                  />
                )}
                
                <Button 
                  className="absolute right-[-16px] top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md z-10 p-0"
                  variant="outline"
                  onClick={toggleDoctorsList}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {!showDoctorsList && (
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md z-10 p-0"
                variant="outline"
                onClick={toggleDoctorsList}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Middle Panel: Google Map */}
          <div className={`${showDoctorsList && showChatBot ? 'w-2/4' : (showDoctorsList || showChatBot ? 'w-3/4' : 'w-full')} transition-width duration-300`}>
            {isLoading ? (
              <div className="h-full bg-slate-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                  </div>
                  <Skeleton className="h-6 w-48 mx-auto mb-2" />
                  <Skeleton className="h-4 w-64 mx-auto" />
                </div>
              </div>
            ) : (
              <GoogleMap 
                doctors={allDoctors} 
                selectedDoctor={selectedDoctor}
                onSelectDoctor={handleSelectDoctor} 
              />
            )}
          </div>
          
          {/* Right Panel: Chat Bot */}
          <div className={`bg-white ${showChatBot ? 'w-1/4' : 'w-0'} transition-width duration-300 overflow-hidden relative border-l`}>
            {showChatBot && (
              <>
                <ChatBot />
                
                <Button 
                  className="absolute left-[-16px] top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md z-10 p-0"
                  variant="outline"
                  onClick={toggleChatBot}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {!showChatBot && (
              <Button 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full bg-white shadow-md z-10 p-0"
                variant="outline"
                onClick={toggleChatBot}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </main>
      </div>
    </CopilotKit>
  );
};

export default Index;
