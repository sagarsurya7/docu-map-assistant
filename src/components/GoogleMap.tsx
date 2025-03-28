import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Doctor } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, AlertCircle, Star } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
  
  useEffect(() => {
    const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
    
    console.log("In a real application, you would replace 'YOUR_GOOGLE_MAPS_API_KEY' with an actual Google Maps API key.");
    
    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      version: "weekly",
      libraries: ["places"]
    });

    let timeoutId: number;

    loader
      .load()
      .then(() => {
        if (mapRef.current) {
          try {
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
        console.error("Error loading Google Maps API:", e);
        setMapError(true);
      });
      
    timeoutId = window.setTimeout(() => {
      if (!map && !mapError) {
        console.warn("Map failed to load within timeout period, likely due to invalid API key");
        setMapError(true);
      }
    }, 5000);
      
    return () => {
      window.clearTimeout(timeoutId);
      
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

  useEffect(() => {
    if (!map || !google || doctors.length === 0 || mapError) return;
    
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
          newInfoWindows.forEach(iw => iw.close());
          infoWindow.open({
            anchor: marker,
            map,
          });
          onSelectDoctor(doctor);
        });
        
        if (selectedDoctor?.id === doctor.id) {
          infoWindow.open({
            anchor: marker,
            map,
          });
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

  if (mapError) {
    return (
      <div className="h-full relative bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Google Maps Unavailable</AlertTitle>
            <AlertDescription>
              The map couldn't be loaded due to an invalid API key or connectivity issues.
            </AlertDescription>
          </Alert>
          
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h4 className="font-medium text-lg mb-3">Doctor Locations</h4>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
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
                      <div className="flex items-center">
                        <h5 className="font-medium">{doctor.name}</h5>
                        {doctor.available && (
                          <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Available</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <p className="text-xs text-gray-500 mt-1">{doctor.address}</p>
                      <p className="text-xs flex items-center mt-1">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                        <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            For a real application, you would need to provide a valid Google Maps API key.
          </p>
          
          <Button 
            variant="outline" 
            className="text-sm"
            onClick={() => setMapError(false)}
          >
            Try Again
          </Button>
        </div>
        
        {selectedDoctor && (
          <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-auto md:w-64 shadow-lg">
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
  }

  return (
    <div className="h-full relative">
      <div ref={mapRef} className="h-full w-full"></div>
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
