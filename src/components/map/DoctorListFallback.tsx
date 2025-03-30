import React from 'react';
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
      
    </div>
  );
};

export default DoctorListFallback;
