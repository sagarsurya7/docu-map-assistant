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
        console.log("Fetching all doctors from database without filters...");
        const apiDoctors = await getDoctors();
        
        if (Array.isArray(apiDoctors) && apiDoctors.length > 0) {
          console.log(`Successfully fetched ${apiDoctors.length} doctors from database`);
          setAllDoctors(apiDoctors);
          setError(null);
          setUsingFallbackData(false);
          
          toast({
            title: "Connected to Database",
            description: `Successfully loaded ${apiDoctors.length} doctors.`,
          });
        } else {
          console.log("Database returned no doctors");
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
        console.error("Error fetching doctors:", err);
        setAllDoctors([]);
        setError("Failed to fetch doctors from the database");
        setUsingFallbackData(false);
        
        toast({
          title: "Database Error",
          description: "Could not fetch doctors from the database.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, []); // Only run once on initial load

  const handleSelectDoctor = (doctor: Doctor) => {
    if (doctor && typeof doctor === 'object') {
      console.log("Selected doctor:", doctor);
      setSelectedDoctor(doctor);
    } else {
      console.error("Invalid doctor object:", doctor);
    }
  };

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

  const getSafeDoctors = (): Doctor[] => {
    if (!Array.isArray(allDoctors)) {
      console.warn("allDoctors is not an array, returning empty array");
      return [];
    }
    
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
