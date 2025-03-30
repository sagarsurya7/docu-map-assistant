
// Use Radar Maps API instead of Google Maps
const RADAR_API_KEY = "prj_live_pk_c2520a5ff9a2e8caa3843a2bdbf40c2a7ba06ede"; // Using the key from your error message

export const initializeRadarMap = () => {
  // Load Radar Maps SDK only once
  if (!document.getElementById('radar-maps-script')) {
    const script = document.createElement('script');
    script.id = 'radar-maps-script';
    script.src = 'https://js.radar.com/maps/v1';
    script.async = true;
    script.defer = true;
    
    document.head.appendChild(script);
    
    // Load Radar SDK as well
    const radarScript = document.createElement('script');
    radarScript.src = 'https://js.radar.com/v3/radar.min.js';
    radarScript.async = true;
    radarScript.defer = true;
    document.head.appendChild(radarScript);
    
    // Initialize Radar once the script is loaded
    radarScript.onload = () => {
      if (window.Radar) {
        window.Radar.initialize(RADAR_API_KEY);
      }
    };
  }
  
  return {
    apiKey: RADAR_API_KEY
  };
};

