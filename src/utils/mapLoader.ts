
import { Loader } from '@googlemaps/js-api-loader';

// Use a proper Google Maps API key - this is a placeholder for a valid key
// In production, this should be an environment variable
const GOOGLE_MAPS_API_KEY = "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"; // Google Maps sample development key

// Create a singleton loader instance that can be reused
export const mapLoader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"]
});
