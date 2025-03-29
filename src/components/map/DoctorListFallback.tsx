
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Star } from 'lucide-react';
import { Doctor } from '@/types';

interface DoctorListFallbackProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorListFallback: React.FC<DoctorListFallbackProps> = ({ 
  doctors, 
  selectedDoctor, 
  onSelectDoctor 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h4 className="font-medium text-lg mb-3">Radar Doctor Locations</h4>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {doctors.map((doctor) => (
          <div 
            key={doctor.id}
            className={`p-3 rounded-md cursor-pointer transition-colors ${
              selectedDoctor?.id === doctor.id ? 'bg-medical/10 border border-medical' : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => onSelectDoctor(doctor)}
          >
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-medical mr-2 mt-1 flex-shrink-0" />
              <div>
                <div className="flex items-center">
                  <h5 className="font-medium">{doctor.name}</h5>
                  {doctor.available && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Available</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{doctor.specialty}</p>
                <p className="text-xs text-gray-500 mt-1">{doctor.address}</p>
                <p className="text-xs flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                  <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorListFallback;
