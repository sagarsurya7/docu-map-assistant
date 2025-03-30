
// Use Radar Maps API instead of Google Maps
const RADAR_API_KEY = "prj_live_pk_c2520a5ff9a2e8caa3843a2bdbf40c2a7ba06ede"; 

export const initializeRadarMap = () => {
  return new Promise((resolve, reject) => {
    try {
      // Load Radar Maps SDK only once
      if (!document.getElementById('radar-maps-script')) {
        console.log("Loading Radar Maps SDK");
        
        // Create and load Radar SDK first
        const radarScript = document.createElement('script');
        radarScript.id = 'radar-sdk-script';
        radarScript.src = 'https://js.radar.com/v3/radar.min.js';
        radarScript.async = true;
        radarScript.defer = true;
        document.head.appendChild(radarScript);
        
        // Create and load Radar Maps SDK
        const mapsScript = document.createElement('script');
        mapsScript.id = 'radar-maps-script';
        mapsScript.src = 'https://js.radar.com/maps/v1';
        mapsScript.async = true;
        mapsScript.defer = true;
        document.head.appendChild(mapsScript);
        
        // Initialize Radar once both scripts are loaded
        mapsScript.onload = () => {
          if (window.Radar) {
            console.log("Radar Maps SDK loaded successfully");
            window.Radar.initialize(RADAR_API_KEY);
            resolve({ apiKey: RADAR_API_KEY });
          } else {
            console.error("Radar object not available after script load");
            reject("Failed to load Radar Maps SDK");
          }
        };
        
        mapsScript.onerror = (error) => {
          console.error("Error loading Radar Maps SDK:", error);
          reject("Failed to load Radar Maps SDK");
        };
      } else {
        // Scripts already loaded
        resolve({ apiKey: RADAR_API_KEY });
      }
    } catch (error) {
      console.error("Error in initializeRadarMap:", error);
      reject(error);
    }
  });
};
