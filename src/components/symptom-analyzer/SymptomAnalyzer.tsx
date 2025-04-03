
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { getAllSymptoms, analyzeSymptoms, Symptom } from '@/api/symptomService';
import { useToast } from '@/components/ui/use-toast';

import SymptomSearch from './SymptomSearch';
import SelectedSymptoms from './SelectedSymptoms';
import AnalysisResults from './AnalysisResults';
import StatusAlerts from './StatusAlerts';

// Fallback data in case the API fails
const fallbackSymptoms: Symptom[] = [
  {
    name: "Headache",
    severity: 2,
    conditions: ["Migraine", "Stress", "Dehydration"],
    doctorSpecialties: ["Neurologist", "General Practitioner"],
    associatedConditions: ["Stress", "Eye strain", "Sinusitis"]
  },
  {
    name: "Fever",
    severity: 3,
    conditions: ["Infection", "Flu", "COVID-19"],
    doctorSpecialties: ["General Practitioner", "Infectious Disease Specialist"],
    associatedConditions: ["Infection", "Inflammation"]
  },
  {
    name: "Sore Throat",
    severity: 2,
    conditions: ["Strep Throat", "Common Cold", "Allergies"],
    doctorSpecialties: ["ENT Specialist", "General Practitioner"],
    associatedConditions: ["Cough", "Runny nose"]
  },
  {
    name: "Cough",
    severity: 2,
    conditions: ["Common Cold", "Bronchitis", "Pneumonia"],
    doctorSpecialties: ["Pulmonologist", "General Practitioner"],
    associatedConditions: ["Fever", "Sore throat"]
  },
  {
    name: "Back Pain",
    severity: 3,
    conditions: ["Muscle Strain", "Herniated Disc", "Sciatica"],
    doctorSpecialties: ["Orthopedist", "Neurologist", "Physical Therapist"],
    associatedConditions: ["Stiffness", "Limited mobility"]
  },
  {
    name: "Fatigue",
    severity: 2,
    conditions: ["Anemia", "Sleep Disorders", "Depression"],
    doctorSpecialties: ["General Practitioner", "Hematologist", "Psychiatrist"],
    associatedConditions: ["Weakness", "Irritability"]
  }
];

const SymptomAnalyzer: React.FC = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSymptoms = async () => {
      setIsLoading(true);
      try {
        const data = await getAllSymptoms();
        
        if (Array.isArray(data) && data.length > 0) {
          console.log("Fetched symptoms data:", data);
          setSymptoms(data);
          setError(null);
          setUsingFallbackData(false);
        } else {
          console.warn("API returned empty or invalid symptoms data, using fallback");
          setSymptoms(fallbackSymptoms);
          setError("No symptoms data received from API");
          setUsingFallbackData(true);
          
          toast({
            title: "Using Fallback Data",
            description: "Showing local symptoms data as the API didn't return valid results",
          });
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        setSymptoms(fallbackSymptoms);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setUsingFallbackData(true);
        
        toast({
          title: "Error Loading Symptoms",
          description: "Using fallback symptom data instead",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSymptoms();
  }, [toast]);

  const handleSymptomSelect = (symptomName: string) => {
    if (!selectedSymptoms.includes(symptomName)) {
      setSelectedSymptoms([...selectedSymptoms, symptomName]);
    }
    setSearchTerm('');
  };

  const handleRemoveSymptom = (symptomName: string) => {
    setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomName));
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) {
      toast({
        title: 'No symptoms selected',
        description: 'Please select at least one symptom to analyze',
        variant: 'default',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeSymptoms(selectedSymptoms);
      console.log("Analysis result:", result);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      
      // Fallback analysis for demo purposes
      if (usingFallbackData || error) {
        const mockAnalysis = {
          symptoms: selectedSymptoms,
          possibleConditions: selectedSymptoms.flatMap(symptom => {
            const found = fallbackSymptoms.find(s => s.name === symptom);
            return found ? found.conditions : [];
          }).filter((v, i, a) => a.indexOf(v) === i),
          recommendedSpecialties: selectedSymptoms.flatMap(symptom => {
            const found = fallbackSymptoms.find(s => s.name === symptom);
            return found ? (Array.isArray(found.doctorSpecialties) ? found.doctorSpecialties : []) : [];
          }).filter((v, i, a) => a.indexOf(v) === i),
          aiRecommendation: {
            content: "Based on your symptoms, I recommend consulting with a medical professional. These are preliminary suggestions and not a substitute for professional medical advice."
          }
        };
        
        setAnalysisResult(mockAnalysis);
        toast({
          title: "Using Simulated Analysis",
          description: "Backend analysis unavailable - showing demo results",
          variant: "default",
        });
      } else {
        toast({
          title: 'Analysis Error',
          description: 'Failed to analyze symptoms',
          variant: 'destructive',
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredSymptoms = symptoms.filter(symptom => 
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSymptoms.includes(symptom.name)
  );

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="py-3 px-4 border-b">
        <CardTitle className="text-base">Symptom Analyzer</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-4">
        <StatusAlerts error={error} usingFallbackData={usingFallbackData} />
        
        <SymptomSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredSymptoms={filteredSymptoms}
          isLoading={isLoading}
          onSymptomSelect={handleSymptomSelect}
        />

        <SelectedSymptoms 
          selectedSymptoms={selectedSymptoms}
          onRemoveSymptom={handleRemoveSymptom}
        />

        <AnalysisResults analysisResult={analysisResult} />
      </CardContent>

      <CardFooter className="border-t p-4">
        <Button 
          className="w-full" 
          onClick={handleAnalyze} 
          disabled={selectedSymptoms.length === 0 || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Symptoms'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SymptomAnalyzer;
