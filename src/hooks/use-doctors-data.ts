
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
      console.log("🔄 useDoctorsData: Starting to fetch doctors...");
      
      try {
        console.log("📡 useDoctorsData: Calling getDoctors API...");
        const apiDoctors = await getDoctors();
        
        console.log("📊 useDoctorsData: API response received:", {
          isArray: Array.isArray(apiDoctors),
          length: apiDoctors?.length || 0,
          firstDoctor: apiDoctors?.[0]?.name || 'none'
        });
        
        if (Array.isArray(apiDoctors) && apiDoctors.length > 0) {
          const cities = [...new Set(apiDoctors.map(doc => doc.city))];
          const puneCount = apiDoctors.filter(doc => doc.city === 'Pune').length;
          
          console.log("✅ useDoctorsData: Successfully fetched doctors", {
            total: apiDoctors.length,
            cities: cities.join(', '),
            puneCount
          });
          
          if (puneCount > 0) {
            const puneDoctors = apiDoctors.filter(doc => doc.city === 'Pune');
            console.log("🏙️ useDoctorsData: Pune doctors found:", puneDoctors.map(d => `${d.name} (${d.specialty})`).join(', '));
          }
          
          setAllDoctors(apiDoctors);
          setError(null);
          setUsingFallbackData(false);
          
          toast({
            title: "✅ Database Connected",
            description: `Loaded ${apiDoctors.length} doctors (${puneCount} in Pune).`,
          });
        } else {
          console.warn("⚠️ useDoctorsData: No doctors returned from API");
          setAllDoctors([]);
          setError("No doctors found in the database");
          setUsingFallbackData(false);
          
          toast({
            title: "⚠️ No Doctors Found",
            description: "The database contains no doctor records.",
            variant: "destructive"
          });
        }
      } catch (err) {
        console.error("❌ useDoctorsData: Error fetching doctors:", err);
        setAllDoctors([]);
        setError("Failed to fetch doctors from the database");
        setUsingFallbackData(false);
        
        toast({
          title: "❌ Database Error",
          description: "Could not fetch doctors from the database.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        console.log("🏁 useDoctorsData: Fetch complete");
      }
    };
    
    fetchDoctors();
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    if (doctor && typeof doctor === 'object') {
      console.log("👆 useDoctorsData: Doctor selected:", doctor.name, doctor.city);
      setSelectedDoctor(doctor);
    } else {
      console.error("❌ useDoctorsData: Invalid doctor object:", doctor);
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
      console.warn("⚠️ useDoctorsData: allDoctors is not an array, returning empty array");
      return [];
    }
    
    const validDoctors = allDoctors.filter(isValidDoctor);
    console.log("✅ useDoctorsData: Returning", validDoctors.length, "valid doctors");
    return validDoctors;
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
