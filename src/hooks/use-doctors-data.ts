
import { useState, useEffect } from 'react';
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
        console.log("Attempting to fetch doctors from API...");
        // Try to fetch doctors from API
        const apiDoctors = await getDoctors();
        
        if (Array.isArray(apiDoctors) && apiDoctors.length > 0) {
          console.log("Successfully fetched doctors from API:", apiDoctors.length);
          setAllDoctors(apiDoctors);
          setError(null);
          setUsingFallbackData(false);
          
          toast({
            title: "Connected to API",
            description: `Successfully fetched ${apiDoctors.length} doctors from the database.`,
          });
        } else {
          // If API returns empty data, show a message
          console.log("API returned empty data");
          setAllDoctors([]);
          setError("No doctors found in the database");
          setUsingFallbackData(false);
          
          toast({
            title: "No Doctors Found",
            description: "The database contains no doctor records.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("Error fetching doctors from API:", err);
        setAllDoctors([]);
        setError("Failed to fetch doctors from the API");
        setUsingFallbackData(false);
        
        toast({
          title: "API Error",
          description: "Could not connect to the doctors database.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
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
