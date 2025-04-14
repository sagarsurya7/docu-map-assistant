import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, X } from 'lucide-react';
import DoctorsList from '@/components/DoctorsList';
import GoogleMap from '@/components/GoogleMap';
import ChatBot from '@/components/ChatBot';
import { Doctor } from '@/types';

interface MobileViewProps {
  mobileView: 'list' | 'map' | 'chat';
  setMobileView: (view: 'list' | 'map' | 'chat') => void;
  isLoading: boolean;
  allDoctors: Doctor[];
  selectedDoctor: Doctor | null;
  handleSelectDoctor: (doctor: Doctor) => void;
}

const MobileView: React.FC<MobileViewProps> = ({
  mobileView,
  setMobileView,
  isLoading,
  allDoctors,
  selectedDoctor,
  handleSelectDoctor
}) => {
  return (
    <div className="h-full">
      {mobileView === 'list' && (
        <div className="h-full overflow-auto">
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
        <div className="h-full flex flex-col relative">
          <div className="absolute top-4 left-4 z-10">
            <Button 
              className="h-10 w-10 rounded-full bg-white shadow-lg text-medical p-0"
              variant="outline"
              onClick={() => setMobileView('list')}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden pt-16 flex flex-col h-full">
            <ChatBot />
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileView;
