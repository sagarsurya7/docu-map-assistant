
// Use Mapbox instead of Radar Maps
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibG92YWJsZS1kZXYiLCJhIjoiY2xzdzU0ZWRnMWRwYjJpcXc1cHI3MDB5MyJ9.tEFciJFY34Ah5QZBJqtlhg"; 

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
            window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
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
          window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
        }
        resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
      }
    } catch (error) {
      console.error("Error in initializeMapbox:", error);
      reject(error);
    }
  });
};
