
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SelectedSymptomsProps {
  selectedSymptoms: string[];
  onRemoveSymptom: (symptomName: string) => void;
}

const SelectedSymptoms: React.FC<SelectedSymptomsProps> = ({ 
  selectedSymptoms, 
  onRemoveSymptom 
}) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Selected Symptoms:</h3>
      {selectedSymptoms.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {selectedSymptoms.map(symptom => (
            <Badge key={symptom} variant="secondary" className="pl-2 pr-1 py-1">
              {symptom}
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-1"
                onClick={() => onRemoveSymptom(symptom)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">
          No symptoms selected. Search and select your symptoms above.
        </div>
      )}
    </div>
  );
};

export default SelectedSymptoms;
