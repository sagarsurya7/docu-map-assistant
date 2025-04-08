
import React, { useState, useEffect } from 'react';
import { Doctor } from '@/types';
import { Loader2 } from 'lucide-react';
import { getDoctors, getFilterOptions } from '@/api/doctorService';
import { useToast } from '@/components/ui/use-toast';
import DoctorSearch from './DoctorSearch';
import DoctorFilters from './DoctorFilters';
import DoctorCard from './DoctorCard';

interface DoctorsListProps {
  doctors: Doctor[];
  onSelectDoctor: (doctor: Doctor) => void;
  selectedDoctor: Doctor | null;
}

const DoctorsList: React.FC<DoctorsListProps> = ({ 
  doctors: initialDoctors, 
  onSelectDoctor, 
  selectedDoctor 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>(Array.isArray(initialDoctors) ? initialDoctors : []);
  const [isLoading, setIsLoading] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    if (Array.isArray(initialDoctors)) {
      setDoctors(initialDoctors);
    } else {
      console.warn("initialDoctors is not an array, setting empty array");
      setDoctors([]);
    }
  }, [initialDoctors]);
  
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const options = await getFilterOptions();
        setSpecialties(Array.isArray(options.specialties) ? options.specialties : []);
        setCities(Array.isArray(options.cities) ? options.cities : []);
        setAreas(Array.isArray(options.areas) ? options.areas : []);
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const filters = {
          search: searchTerm || undefined,
          specialty: selectedSpecialty || undefined,
          city: selectedCity || undefined,
          area: selectedArea || undefined
        };
        
        const fetchedDoctors = await getDoctors(filters);
        setDoctors(Array.isArray(fetchedDoctors) ? fetchedDoctors : []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch doctors',
          variant: 'destructive',
        });
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchDoctors();
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm, selectedSpecialty, selectedCity, selectedArea, toast]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 bg-white border-b sticky top-0 z-10">
        <h2 className="text-xl font-bold text-medical-dark mb-3">Find Doctors</h2>
        
        <DoctorSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <DoctorFilters 
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedSpecialty={selectedSpecialty}
          setSelectedSpecialty={setSelectedSpecialty}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedArea={selectedArea}
          setSelectedArea={setSelectedArea}
          specialties={specialties}
          cities={cities}
          areas={areas}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-6 w-6 animate-spin text-medical" />
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            No doctors found matching your criteria
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {doctors.map((doctor) => (
              <DoctorCard 
                key={doctor.id}
                doctor={doctor}
                isSelected={selectedDoctor?.id === doctor.id}
                onSelect={onSelectDoctor}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
