
import { useState, useEffect } from 'react';
import { doctors as doctorsData } from '@/data/doctors';
import { Doctor } from '@/types';
import { toast } from '@/components/ui/use-toast';

export function useDoctorsData() {
  const [isLoading, setIsLoading] = useState(true);
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setAllDoctors(doctorsData);
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
  };

  return {
    isLoading,
    allDoctors,
    selectedDoctor,
    handleSelectDoctor,
    setSelectedDoctor
  };
}
