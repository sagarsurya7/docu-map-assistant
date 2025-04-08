
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface DoctorSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const DoctorSearch: React.FC<DoctorSearchProps> = ({ 
  searchTerm, 
  setSearchTerm 
}) => {
  return (
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
  );
};

export default DoctorSearch;
