import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DoctorsList from '@/components/DoctorsList';
import GoogleMap from '@/components/GoogleMap';
import ChatBot from '@/components/ChatBot';
import { Doctor } from '@/types';

interface DesktopViewProps {
  isLoading: boolean;
  allDoctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
  showChatBot: boolean;
  showDoctorsList: boolean;
  toggleChatBot: () => void;
  toggleDoctorsList: () => void;
}

const DesktopView: React.FC<DesktopViewProps> = ({
  isLoading,
  allDoctors,
  selectedDoctor,
  onSelectDoctor,
  showChatBot,
  showDoctorsList,
  toggleChatBot,
  toggleDoctorsList
}) => {
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(allDoctors);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchDoctors = (term: string) => {
    setSearchTerm(term);
    const filtered = allDoctors.filter(doctor => 
      doctor.name.toLowerCase().includes(term) ||
      doctor.specialty.toLowerCase().includes(term) ||
      doctor.address.toLowerCase().includes(term)
    );
    setFilteredDoctors(filtered);
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Left Panel: Doctors List */}
      <div className={`bg-white ${showDoctorsList ? 'w-1/4' : 'w-0'} transition-width duration-300 overflow-hidden relative border-r h-full`}>
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
              <div className="h-full">
                <DoctorsList 
                  doctors={filteredDoctors} 
                  selectedDoctor={selectedDoctor} 
                  onSelectDoctor={onSelectDoctor}
                  searchTerm={searchTerm}
                />
              </div>
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
            doctors={filteredDoctors} 
            selectedDoctor={selectedDoctor}
            onSelectDoctor={onSelectDoctor} 
          />
        )}
      </div>
      
      {/* Right Panel: Chat Bot */}
      <div className={`bg-white ${showChatBot ? 'w-1/4' : 'w-0'} transition-width duration-300 overflow-hidden relative border-l`}>
        {showChatBot && (
          <>
            <ChatBot 
              doctors={allDoctors}
              onSearchDoctors={handleSearchDoctors}
            />
            
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
    </div>
  );
};

export default DesktopView;
