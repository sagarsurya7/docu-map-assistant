
// Default to empty token, will be replaced by user input
let MAPBOX_ACCESS_TOKEN = ""; 

// Get token from localStorage if it exists
const storedToken = localStorage.getItem('mapbox-token');
if (storedToken) {
  MAPBOX_ACCESS_TOKEN = storedToken;
}

export const setMapboxToken = (token: string) => {
  MAPBOX_ACCESS_TOKEN = token;
  localStorage.setItem('mapbox-token', token);
  
  // Update token for any existing mapboxgl instance
  if (window.mapboxgl) {
    window.mapboxgl.accessToken = token;
  }
};

export const getMapboxToken = () => MAPBOX_ACCESS_TOKEN;

export const initializeMapbox = () => {
  return new Promise((resolve, reject) => {
    try {
      // Load Mapbox GL JS only once
      if (!document.getElementById('mapbox-gl-script')) {
        console.log("Loading Mapbox GL JS");
        
        // Create and load Mapbox GL JS
        const mapboxScript = document.createElement('script');
        mapboxScript.id = 'mapbox-gl-script';
        mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        mapboxScript.async = true;
        mapboxScript.defer = true;
        document.head.appendChild(mapboxScript);
        
        // Add Mapbox CSS
        const mapboxCss = document.createElement('link');
        mapboxCss.rel = 'stylesheet';
        mapboxCss.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        document.head.appendChild(mapboxCss);
        
        // Initialize Mapbox once script is loaded
        mapboxScript.onload = () => {
          if (window.mapboxgl) {
            console.log("Mapbox GL JS loaded successfully");
            if (MAPBOX_ACCESS_TOKEN) {
              window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
              resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
            } else {
              console.warn("No Mapbox access token provided");
              reject("No Mapbox access token provided");
            }
          } else {
            console.error("Mapbox object not available after script load");
            reject("Failed to load Mapbox GL JS");
          }
        };
        
        mapboxScript.onerror = (error) => {
          console.error("Error loading Mapbox GL JS:", error);
          reject("Failed to load Mapbox GL JS");
        };
      } else {
        // Script already loaded
        if (window.mapboxgl) {
          if (MAPBOX_ACCESS_TOKEN) {
            window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
          } else {
            console.warn("No Mapbox access token provided");
            reject("No Mapbox access token provided");
          }
        } else {
          reject("Mapbox GL JS not available");
        }
      }
    } catch (error) {
      console.error("Error in initializeMapbox:", error);
      reject(error);
    }
  });
};
