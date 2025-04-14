
import { useState, useEffect } from 'react';
import { doctors as doctorsData } from '@/data/doctors';
import { Doctor } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function useDoctorsData() {
  const [isLoading, setIsLoading] = useState(true);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      try {
        // Ensure doctorsData is an array before setting state
        if (!Array.isArray(doctorsData)) {
          console.error("Doctors data is not an array:", doctorsData);
          setError("Invalid doctors data format");
          setAllDoctors([]);
          setUsingFallbackData(false);
        } else {
          setAllDoctors(doctorsData);
          setError(null);
          setUsingFallbackData(true);
          
          // Show a toast explaining we're using local data
          toast({
            title: "Using Local Data",
            description: "Connected to local doctors database. Backend connection not required.",
          });
        }
        
        setIsLoading(false);
        
        // Show welcome toast
        toast({
          title: "Welcome to AI Doctor Nearby",
          description: "Find specialists near you and get AI-powered health guidance",
        });
      } catch (err) {
        console.error("Error loading doctors data:", err);
        setError("Failed to load doctors data");
        setAllDoctors([]);
        setIsLoading(false);
        setUsingFallbackData(false);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    if (doctor && typeof doctor === 'object') {
      console.log("Selected doctor:", doctor);
      setSelectedDoctor(doctor);
    } else {
      console.error("Invalid doctor object:", doctor);
    }
  };

  // Helper to check if a value is a valid doctor object
  const isValidDoctor = (value: any): value is Doctor => {
    return (
      value !== null &&
      typeof value === 'object' &&
      'id' in value &&
      typeof value.id !== 'undefined' &&
      'name' in value &&
      typeof value.name === 'string'
    );
  };

  // Make sure we always return a valid doctor array even if something goes wrong
  const getSafeDoctors = (): Doctor[] => {
    if (!Array.isArray(allDoctors)) {
      console.warn("allDoctors is not an array, returning empty array");
      return [];
    }
    
    // Filter out any invalid doctor objects
    return allDoctors.filter(isValidDoctor);
  };

  return {
    isLoading,
    allDoctors: getSafeDoctors(),
    selectedDoctor,
    handleSelectDoctor,
    setSelectedDoctor,
    error,
    usingFallbackData
  };
}
