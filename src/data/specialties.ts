
// List of medical specialties
export const specialties = [
  "Cardiologist",
  "Neurologist",
  "Orthopedist",
  "Pediatrician",
  "Dermatologist",
  "ENT Specialist",
  "Ophthalmologist",
  "Psychiatrist",
  "Dentist",
  "General Physician",
  "Gynecologist",
  "Urologist",
  "Endocrinologist",
  "Pulmonologist",
  "Gastroenterologist",
  "Oncologist",
  "Radiologist",
  "Surgeon",
  "Physiotherapist",
  "Nutritionist"
];

// Get unique specialties from a list of doctors
export function getUniqueSpecialties(doctorsList: any[]): string[] {
  return [...new Set(doctorsList.map(doctor => doctor.specialty))];
}
