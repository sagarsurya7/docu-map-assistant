
import React, { useState, useEffect } from 'react';
import { Doctor } from '../types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Star, 
  MessageSquare, 
  Calendar, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getDoctors, getFilterOptions } from '@/api/doctorService';
import { useToast } from '@/components/ui/use-toast';
import { getDoctorImage, getFallbackImage } from '@/utils/doctorImageUtils';

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
        
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search doctors, specialties..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <span>Filters</span>
          </div>
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {showFilters && (
          <div className="mt-3 p-3 bg-slate-50 rounded-md">
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Specialty</p>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  key="specialty-all"
                  variant={selectedSpecialty === '' ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedSpecialty('')}
                >
                  All
                </Badge>
                {specialties.map(specialty => (
                  <Badge 
                    key={`specialty-${specialty}`}
                    variant={selectedSpecialty === specialty ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedSpecialty(specialty)}
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">City</p>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  key="city-all"
                  variant={selectedCity === '' ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCity('')}
                >
                  All
                </Badge>
                {cities.map(city => (
                  <Badge 
                    key={`city-${city}`}
                    variant={selectedCity === city ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCity(city)}
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Area</p>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  key="area-all"
                  variant={selectedArea === '' ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedArea('')}
                >
                  All
                </Badge>
                {areas.map(area => (
                  <Badge 
                    key={`area-${area}`}
                    variant={selectedArea === area ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedArea(area)}
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
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
            {doctors.map((doctor) => {
              const isFemale = doctor.name.includes("Dr. ") && 
                ["Priya", "Meera", "Anjali", "Neha"].some(name => doctor.name.includes(name));
              
              const gender = isFemale ? 'female' : 'male';
              const profileImage = doctor.imageUrl || getDoctorImage(doctor.id, gender);
              
              return (
                <Card 
                  key={doctor.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow duration-200 ${
                    selectedDoctor?.id === doctor.id ? 'border-medical border-2' : ''
                  }`}
                  onClick={() => onSelectDoctor(doctor)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <img 
                            src={profileImage}
                            alt={doctor.name} 
                            className="h-10 w-10 rounded-full object-cover" 
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = getFallbackImage(gender);
                            }}
                          />
                        </div>
                        <div>
                          <CardTitle className="text-base">{doctor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" fill="currentColor" />
                        <span className="text-sm font-medium">{doctor.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <div className="flex items-start text-sm text-muted-foreground mb-2">
                      <MapPin className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
                      <span>{doctor.address}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Badge 
                        variant="outline" 
                        className={`${doctor.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                      >
                        {doctor.available ? 'Available Today' : 'Not Available Today'}
                      </Badge>
                      <Badge 
                        variant="outline"
                        className="ml-2"
                      >
                        ₹{doctor.consultationFee}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Book
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;
