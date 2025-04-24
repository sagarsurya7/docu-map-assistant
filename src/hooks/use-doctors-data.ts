
import { useState, useEffect } from 'react';
import { doctors as doctorsData } from '@/data/doctors';
import { Doctor } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { getDoctors } from '@/api/doctorService';

export function useDoctorsData() {
  const [isLoading, setIsLoading] = useState(true);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Try to fetch doctors from API
        const apiDoctors = await getDoctors();
        if (Array.isArray(apiDoctors) && apiDoctors.length > 0) {
          console.log("Successfully fetched doctors from API:", apiDoctors.length);
          setAllDoctors(apiDoctors);
          setError(null);
          setUsingFallbackData(false);
          
          // Show a toast explaining we're using API data
          toast({
            title: "Connected to API",
            description: "Successfully fetched doctors from the database.",
          });
        } else {
          // If API returns empty or invalid data, use fallback
          console.log("API returned empty or invalid data, using fallback");
          setAllDoctors(doctorsData);
          setUsingFallbackData(true);
          
          // Show a toast explaining we're using fallback data
          toast({
            title: "Using Local Data",
            description: "Connected to local doctors database. API returned empty data.",
          });
        }
      } catch (err) {
        console.error("Error fetching doctors from API:", err);
        // Use fallback data if API fails
        setAllDoctors(doctorsData);
        setUsingFallbackData(true);
        
        toast({
          title: "Using Local Data",
          description: "Connected to local doctors database. Backend connection failed.",
        });
      } finally {
        setIsLoading(false);
        
        // Show welcome toast
        toast({
          title: "Welcome to AI Doctor Nearby",
          description: "Find specialists near you and get AI-powered health guidance",
        });
      }
    };
    
    // Wait a bit before fetching to simulate loading state
    const timer = setTimeout(() => {
      fetchDoctors();
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
