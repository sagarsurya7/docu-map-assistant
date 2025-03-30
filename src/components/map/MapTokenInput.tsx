
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface MapTokenInputProps {
  onSubmit: (token: string) => void;
}

const MapTokenInput: React.FC<MapTokenInputProps> = ({ onSubmit }) => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mountedRef = useRef(true);
  
  // Check if token exists in localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('mapbox-token');
      if (savedToken) {
        setToken(savedToken);
      }
    } catch (error) {
      console.error("Error reading token from localStorage:", error);
    }
    
    // Cleanup on unmount
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (token.trim()) {
      setIsSubmitting(true);
      
      try {
        // Store token in localStorage for future use
        localStorage.setItem('mapbox-token', token.trim());
        
        // Call the onSubmit prop with the token
        onSubmit(token.trim());
        
        // Show success toast
        toast({
          title: "Mapbox token applied",
          description: "Your map token has been saved for this session."
        });
        
        // Reset submitting state after a delay
        const timer = setTimeout(() => {
          if (mountedRef.current) {
            setIsSubmitting(false);
          }
        }, 1000);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error submitting token:", error);
        
        // Show error toast
        toast({
          title: "Error saving token",
          description: "There was a problem saving your Mapbox token.",
          variant: "destructive"
        });
        
        if (mountedRef.current) {
          setIsSubmitting(false);
        }
      }
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
