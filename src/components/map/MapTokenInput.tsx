
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface MapTokenInputProps {
  onSubmit: (token: string) => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ onSubmit }) => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      setIsSubmitting(true);
      // Store token in localStorage for future use
      localStorage.setItem('mapbox-token', token.trim());
      onSubmit(token.trim());
      // Reset submitting state after a delay
      setTimeout(() => setIsSubmitting(false), 1000);
    }
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-sm max-w-md mx-auto mt-10">
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Mapbox access token is required to display the map.
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Enter your Mapbox Access Token</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You can get your public token from your Mapbox account at{' '}
            <a 
              href="https://account.mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              account.mapbox.com
            </a>
          </p>
        </div>
        
        <Input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="pk.eyJ1joiZXhhbXBsZSIsImEiOiJjbGV4YW1..."
          className="w-full"
          required
          disabled={isSubmitting}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || !token.trim()}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Applying..." : "Apply Token"}
        </Button>
      </form>
    </div>
  );
};

export default MapTokenInput;
