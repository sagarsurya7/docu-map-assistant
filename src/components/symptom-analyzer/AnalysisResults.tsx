
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SymptomAnalysisResponse } from '@/api/symptomService';

interface AnalysisResultsProps {
  analysisResult: SymptomAnalysisResponse | null;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisResult }) => {
  if (!analysisResult) return null;

  return (
    <div className="mt-6 border rounded-md p-3 bg-slate-50">
      <h3 className="font-medium mb-2">Analysis Results</h3>
      
      <div className="mb-2">
        <h4 className="text-sm font-medium">Possible Conditions:</h4>
        <div className="flex flex-wrap gap-1 mt-1">
          {analysisResult.possibleConditions.map((condition, index) => (
            <Badge key={index} variant="outline">{condition}</Badge>
          ))}
        </div>
      </div>
      
      <div className="mb-2">
        <h4 className="text-sm font-medium">Recommended Specialists:</h4>
        <div className="flex flex-wrap gap-1 mt-1">
          {analysisResult.recommendedSpecialties.map((specialty, index) => (
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
  );
};

export default AnalysisResults;
