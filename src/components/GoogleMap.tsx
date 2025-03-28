
import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Doctor } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle } from 'lucide-react';

interface GoogleMapProps {
  doctors: Doctor[];
  selectedDoctor: Doctor | null;
  onSelectDoctor: (doctor: Doctor) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ doctors, selectedDoctor, onSelectDoctor }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [infoWindows, setInfoWindows] = useState<google.maps.InfoWindow[]>([]);
  const [mapError, setMapError] = useState<boolean>(false);
  
  // Since we're not using a real API key, we'll simulate the Google Maps API for this POC
  useEffect(() => {
    const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
    
    // For demo purposes, show a message in the console about the API key
    console.log("In a real application, you would replace 'YOUR_GOOGLE_MAPS_API_KEY' with an actual Google Maps API key.");
    
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"]
    });

    loader
      .load()
      .then(() => {
        if (mapRef.current) {
          try {
            // Pune, India coordinates
            const puneCoordinates = { lat: 18.5204, lng: 73.8567 };
            
            const mapInstance = new google.maps.Map(mapRef.current, {
              center: puneCoordinates,
              zoom: 13,
              mapTypeControl: false,
              fullscreenControl: false,
              streetViewControl: false,
              zoomControl: true,
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_TOP,
              },
              styles: [
                {
                  featureType: "poi.business",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }],
                },
                {
                  featureType: "transit",
                  elementType: "labels.icon",
                  stylers: [{ visibility: "off" }],
                },
              ],
            });
            
            setMap(mapInstance);
          } catch (error) {
            console.error("Error initializing map:", error);
            setMapError(true);
          }
        }
      })
      .catch(e => {
        // Handle loading error
        console.error("Error loading Google Maps API:", e);
        setMapError(true);
      });
      
    return () => {
      // Clean up markers and info windows
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
      }
      
      if (infoWindows.length > 0) {
        infoWindows.forEach(infoWindow => infoWindow.close());
        setInfoWindows([]);
      }
    };
  }, []);

  // Add markers for doctors
  useEffect(() => {
    if (!map || !google || doctors.length === 0 || mapError) return;
    
    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    infoWindows.forEach(infoWindow => infoWindow.close());
    
    const newMarkers: google.maps.Marker[] = [];
    const newInfoWindows: google.maps.InfoWindow[] = [];
    
    doctors.forEach((doctor) => {
      try {
        const marker = new google.maps.Marker({
          position: doctor.location,
          map: map,
          title: doctor.name,
          icon: {
            url: selectedDoctor?.id === doctor.id 
              ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
              : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(40, 40),
          },
          animation: selectedDoctor?.id === doctor.id 
            ? google.maps.Animation.BOUNCE 
            : undefined,
        });
        
        const contentString = `
          <div class="p-2">
            <div class="font-semibold">${doctor.name}</div>
            <div class="text-sm">${doctor.specialty}</div>
            <div class="text-xs mt-1">${doctor.address}</div>
          </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
          content: contentString,
          maxWidth: 200,
        });
        
        marker.addListener('click', () => {
          // Close all info windows
          newInfoWindows.forEach(iw => iw.close());
          
          // Open the clicked marker's info window
          infoWindow.open({
            anchor: marker,
            map,
          });
          
          // Select this doctor
          onSelectDoctor(doctor);
        });
        
        if (selectedDoctor?.id === doctor.id) {
          infoWindow.open({
            anchor: marker,
            map,
          });
          
          // Center the map on the selected doctor
          map.panTo(doctor.location);
        }
        
        newMarkers.push(marker);
        newInfoWindows.push(infoWindow);
      } catch (error) {
        console.error("Error creating marker for doctor:", doctor.name, error);
      }
    });
    
    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);
    
  }, [map, doctors, selectedDoctor, mapError]);

  // Fallback UI when map fails to load
  if (mapError) {
    return (
      <div className="h-full relative bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Map Unavailable</h3>
          <p className="text-gray-600 mb-6">
            The map couldn't be loaded due to a missing or invalid API key. 
            In a real application, you would need to provide a valid Google Maps API key.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <h4 className="font-medium text-lg mb-3">Doctor Locations</h4>
            <div className="space-y-3">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedDoctor?.id === doctor.id ? 'bg-medical/10 border border-medical' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => onSelectDoctor(doctor)}
                >
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-medical mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-medium">{doctor.name}</h5>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <p className="text-xs text-gray-500 mt-1">{doctor.address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="text-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div ref={mapRef} className="h-full w-full"></div>
      {/* Overlay information card for selected doctor */}
      {selectedDoctor && (
        <Card className="absolute bottom-4 left-4 w-64 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center mb-2">
              <img 
                src={selectedDoctor.image} 
                alt={selectedDoctor.name} 
                className="h-10 w-10 rounded-full mr-3 object-cover" 
              />
              <div>
                <h3 className="font-semibold text-sm">{selectedDoctor.name}</h3>
                <p className="text-xs text-muted-foreground">{selectedDoctor.specialty}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{selectedDoctor.address}</p>
            <p className="text-xs">{selectedDoctor.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoogleMap;
