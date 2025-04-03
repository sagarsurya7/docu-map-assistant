
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, PlusCircle, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllSymptoms, analyzeSymptoms, Symptom } from '@/api/symptomService';
import { useToast } from '@/components/ui/use-toast';

const SymptomAnalyzer: React.FC = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const data = await getAllSymptoms();
        setSymptoms(data);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        toast({
          title: 'Error',
          description: 'Failed to load symptoms',
          variant: 'destructive',
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
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast({
        title: 'Analysis Error',
        description: 'Failed to analyze symptoms',
        variant: 'destructive',
      });
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
                    onClick={() => handleSymptomSelect(symptom.name)}
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
                    onClick={() => handleRemoveSymptom(symptom)}
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

        {analysisResult && (
          <div className="mt-6 border rounded-md p-3 bg-slate-50">
            <h3 className="font-medium mb-2">Analysis Results</h3>
            
            <div className="mb-2">
              <h4 className="text-sm font-medium">Possible Conditions:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysisResult.possibleConditions.map((condition: string, index: number) => (
                  <Badge key={index} variant="outline">{condition}</Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-2">
              <h4 className="text-sm font-medium">Recommended Specialists:</h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysisResult.recommendedSpecialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="outline" className="bg-blue-50">{specialty}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">AI Recommendation:</h4>
              <p className="text-sm mt-1">
                {analysisResult.aiRecommendation.content.toString()}
              </p>
            </div>
          </div>
        )}
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
