
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface DoctorFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedSpecialty: string;
  setSelectedSpecialty: (specialty: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  specialties: string[];
  cities: string[];
  areas: string[];
}

const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  showFilters,
  setShowFilters,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedCity,
  setSelectedCity,
  selectedArea,
  setSelectedArea,
  specialties,
  cities,
  areas
}) => {
  return (
    <div>
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
                variant={selectedSpecialty === '' ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedSpecialty('')}
              >
                All
              </Badge>
              {specialties.map(specialty => (
                <Badge 
                  key={specialty}
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
                variant={selectedCity === '' ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCity('')}
              >
                All
              </Badge>
              {cities.map(city => (
                <Badge 
                  key={city}
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
                variant={selectedArea === '' ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedArea('')}
              >
                All
              </Badge>
              {areas.map(area => (
                <Badge 
                  key={area}
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
  );
};

export default DoctorFilters;
