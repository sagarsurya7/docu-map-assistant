
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

// Track if we're currently loading Mapbox
let isLoadingMapbox = false;
let mapboxLoadPromise: Promise<any> | null = null;

export const initializeMapbox = () => {
  // Return existing promise if already loading
  if (isLoadingMapbox && mapboxLoadPromise) {
    return mapboxLoadPromise;
  }
  
  mapboxLoadPromise = new Promise((resolve, reject) => {
    try {
      isLoadingMapbox = true;
      
      // Load Mapbox GL JS only once
      if (!document.getElementById('mapbox-gl-script')) {
        console.log("Loading Mapbox GL JS");
        
        // Create and load Mapbox GL JS
        const mapboxScript = document.createElement('script');
        mapboxScript.id = 'mapbox-gl-script';
        mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        mapboxScript.async = true;
        mapboxScript.defer = true;
        
        // Add Mapbox CSS
        const mapboxCss = document.createElement('link');
        mapboxCss.rel = 'stylesheet';
        mapboxCss.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        
        // Append elements to head - but check if head exists first
        if (document.head) {
          document.head.appendChild(mapboxScript);
          document.head.appendChild(mapboxCss);
        } else {
          console.error("Document head not available");
          reject("Document head not available");
          isLoadingMapbox = false;
          return;
        }
        
        // Initialize Mapbox once script is loaded
        mapboxScript.onload = () => {
          if (window.mapboxgl) {
            console.log("Mapbox GL JS loaded successfully");
            if (MAPBOX_ACCESS_TOKEN) {
              window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
              isLoadingMapbox = false;
              resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
            } else {
              console.warn("No Mapbox access token provided");
              isLoadingMapbox = false;
              reject("No Mapbox access token provided");
            }
          } else {
            console.error("Mapbox object not available after script load");
            isLoadingMapbox = false;
            reject("Failed to load Mapbox GL JS");
          }
        };
        
        mapboxScript.onerror = (error) => {
          console.error("Error loading Mapbox GL JS:", error);
          isLoadingMapbox = false;
          reject("Failed to load Mapbox GL JS");
        };
      } else {
        // Script already loaded
        if (window.mapboxgl) {
          if (MAPBOX_ACCESS_TOKEN) {
            window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
            isLoadingMapbox = false;
            resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
          } else {
            console.warn("No Mapbox access token provided");
            isLoadingMapbox = false;
            reject("No Mapbox access token provided");
          }
        } else {
          isLoadingMapbox = false;
          reject("Mapbox GL JS not available");
        }
      }
    } catch (error) {
      console.error("Error in initializeMapbox:", error);
      isLoadingMapbox = false;
      reject(error);
    }
  });
  
  return mapboxLoadPromise;
};
