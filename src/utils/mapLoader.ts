
import { Loader } from '@googlemaps/js-api-loader';

// Use a consistent API key
const RADAR_API_KEY = "prj_live_pk_c2520a5ff9a2e8caa3843a2bdbf40c2a7ba06ede";

// Create a singleton loader instance that can be reused
export const mapLoader = new Loader({
  apiKey: RADAR_API_KEY,
  version: "weekly",
  libraries: ["places"]
});
