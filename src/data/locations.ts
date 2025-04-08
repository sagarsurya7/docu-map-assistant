
// List of Pune areas for autocomplete
export const puneAreas = [
  "Kalyani Nagar",
  "Koregaon Park",
  "Viman Nagar",
  "Aundh",
  "Baner",
  "Hinjewadi",
  "Wakad",
  "Kharadi",
  "Magarpatta",
  "Hadapsar",
  "Kondhwa",
  "Bibwewadi",
  "Katraj",
  "Swargate",
  "Deccan",
  "Shivaji Nagar",
  "Camp"
];

// Get unique cities from a list of doctors
export function getUniqueCities(doctorsList: any[]): string[] {
  return [...new Set(doctorsList.map(doctor => doctor.city))];
}

// Get unique areas from a list of doctors
export function getUniqueAreas(doctorsList: any[]): string[] {
  return [...new Set(doctorsList.map(doctor => doctor.area))];
}
