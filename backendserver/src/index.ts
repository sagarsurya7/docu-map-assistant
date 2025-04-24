
import { searchDoctors, filterDoctors, getUniqueSpecialties, getUniqueCities, getUniqueAreas } from './data/doctorsSearch';
import { fallbackDoctors } from './data/doctors';

// Main search and filter function
export function searchAndFilterDoctors(
  search?: string, 
  filters?: {
    specialty?: string;
    city?: string;
    area?: string;
    rating?: number;
    available?: boolean;
  }
) {
  let results = fallbackDoctors;

  // Apply search if a search term is provided
  if (search) {
    results = searchDoctors(results, search);
  }

  // Apply filters if any are provided
  if (filters) {
    results = filterDoctors(results, filters);
  }

  return results;
}

// Get filter options for the UI
export function getFilterOptions() {
  return {
    specialties: getUniqueSpecialties(fallbackDoctors),
    cities: getUniqueCities(fallbackDoctors),
    areas: getUniqueAreas(fallbackDoctors)
  };
}

// Export the doctors for direct use if needed
export { fallbackDoctors };
