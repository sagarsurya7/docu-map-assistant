
import { Doctor } from '@/types';

export const createDoctorMarker = (
  doctor: Doctor,
  map: google.maps.Map,
  isSelected: boolean,
  onSelect: (doctor: Doctor) => void,
  infoWindows: google.maps.InfoWindow[]
): { marker: google.maps.Marker; infoWindow: google.maps.InfoWindow } => {
  // Create marker with appropriate icon based on selection status
  const marker = new google.maps.Marker({
    position: doctor.location,
    map: map,
    title: doctor.name,
    icon: {
      url: isSelected 
        ? 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' 
        : 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: new google.maps.Size(40, 40),
    },
    animation: isSelected 
      ? google.maps.Animation.BOUNCE 
      : undefined,
  });
  
  // Create info window content
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
  
  // Add click listener to marker
  marker.addListener('click', () => {
    infoWindows.forEach(iw => iw.close());
    infoWindow.open({
      anchor: marker,
      map,
    });
    onSelect(doctor);
  });
  
  return { marker, infoWindow };
};

export const updateMapMarkers = (
  map: google.maps.Map | null,
  doctors: Doctor[],
  selectedDoctor: Doctor | null,
  onSelectDoctor: (doctor: Doctor) => void,
  existingMarkers: google.maps.Marker[],
  existingInfoWindows: google.maps.InfoWindow[]
): { newMarkers: google.maps.Marker[], newInfoWindows: google.maps.InfoWindow[] } => {
  if (!map || !google || doctors.length === 0) {
    return { newMarkers: [], newInfoWindows: [] };
  }
  
  // Clear existing markers and info windows
  existingMarkers.forEach(marker => marker.setMap(null));
  existingInfoWindows.forEach(infoWindow => infoWindow.close());
  
  const newMarkers: google.maps.Marker[] = [];
  const newInfoWindows: google.maps.InfoWindow[] = [];
  
  doctors.forEach((doctor) => {
    try {
      const { marker, infoWindow } = createDoctorMarker(
        doctor,
        map,
        selectedDoctor?.id === doctor.id,
        onSelectDoctor,
        newInfoWindows
      );
      
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
  
  return { newMarkers, newInfoWindows };
};
