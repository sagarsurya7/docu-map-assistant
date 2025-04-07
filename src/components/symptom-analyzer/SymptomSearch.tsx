
import React from 'react';
import { Search, Loader2, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Symptom } from '@/api/symptomService';

interface SymptomSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredSymptoms: Symptom[];
  isLoading: boolean;
  onSymptomSelect: (symptomName: string) => void;
}

const SymptomSearch: React.FC<SymptomSearchProps> = ({
  searchTerm,
  setSearchTerm,
  filteredSymptoms,
  isLoading,
  onSymptomSelect
}) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search symptoms..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {searchTerm && (
        <ScrollArea className="h-[150px] mt-2 border rounded-md p-2">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : filteredSymptoms.length > 0 ? (
            filteredSymptoms.map(symptom => (
              <div 
                key={symptom.name}
                className="p-2 hover:bg-slate-100 rounded cursor-pointer flex items-center"
                onClick={() => onSymptomSelect(symptom.name)}
              >
                <div>{symptom.name}</div>
                <PlusCircle className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground p-2">
              No matching symptoms found
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default SymptomSearch;
