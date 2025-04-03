
import { useState, useEffect } from 'react';
import { doctors as doctorsData } from '@/data/doctors';
import { Doctor } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function useDoctorsData() {
  const [isLoading, setIsLoading] = useState(true);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      try {
        // Ensure doctorsData is an array before setting state
        if (!Array.isArray(doctorsData)) {
          console.error("Doctors data is not an array:", doctorsData);
          setError("Invalid doctors data format");
          setAllDoctors([]);
        } else {
          setAllDoctors(doctorsData);
          setError(null);
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
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    if (doctor && typeof doctor === 'object') {
      setSelectedDoctor(doctor);
    } else {
      console.error("Invalid doctor object:", doctor);
    }
  };

  return {
    isLoading,
    allDoctors,
    selectedDoctor,
    handleSelectDoctor,
    setSelectedDoctor,
    error
  };
}
