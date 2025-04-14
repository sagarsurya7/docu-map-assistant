import React from 'react';
import Header from '@/components/Header';
import SymptomAnalyzer from '@/components/symptom-analyzer/SymptomAnalyzer';
import BackendStatus from '@/components/BackendStatus';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SymptomAnalyzerPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen-safe">
      <Header isMobile={false} toggleMobileMenu={() => {}} />
      
      <main className="flex-1 container mx-auto px-4 py-6 max-w-5xl overflow-auto">
        <div className="mb-4">
          <Button variant="ghost" asChild className="p-0 hover:bg-transparent">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        
        <div className="h-[calc(100%-80px)]">
          <SymptomAnalyzer />
        </div>
      </main>
    </div>
  );
};

export default SymptomAnalyzerPage;
