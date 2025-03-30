
// Default to empty token, will be replaced by user input
let MAPBOX_ACCESS_TOKEN = ""; 

// Get token from localStorage if it exists
let storedToken: string | null = null;
try {
  storedToken = localStorage.getItem('mapbox-token');
  if (storedToken) {
    MAPBOX_ACCESS_TOKEN = storedToken;
  }
} catch (e) {
  console.error("Error accessing localStorage:", e);
}

export const setMapboxToken = (token: string) => {
  try {
    MAPBOX_ACCESS_TOKEN = token;
    localStorage.setItem('mapbox-token', token);
    
    // Update token for any existing mapboxgl instance
    if (window.mapboxgl) {
      window.mapboxgl.accessToken = token;
    }
  } catch (e) {
    console.error("Error setting mapbox token:", e);
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
      
      // If Mapbox is already loaded
      if (window.mapboxgl) {
        console.log("Mapbox already loaded, setting token");
        if (MAPBOX_ACCESS_TOKEN) {
          window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
          isLoadingMapbox = false;
          resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
        } else {
          console.warn("No Mapbox access token provided");
          isLoadingMapbox = false;
          reject("No Mapbox access token provided");
        }
        return;
      }
      
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
        mapboxCss.id = 'mapbox-gl-css';
        mapboxCss.rel = 'stylesheet';
        mapboxCss.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
        
        // Safety checks for document structure
        if (!document.head) {
          const err = "Document head not available";
          console.error(err);
          isLoadingMapbox = false;
          reject(err);
          return;
        }
        
        // Append elements to head
        document.head.appendChild(mapboxScript);
        document.head.appendChild(mapboxCss);
        
        // Initialize Mapbox once script is loaded
        mapboxScript.onload = () => {
          console.log("Mapbox script loaded");
          
          // Give a moment for the script to initialize
          setTimeout(() => {
            if (window.mapboxgl) {
              console.log("Mapbox GL JS loaded successfully");
              if (MAPBOX_ACCESS_TOKEN) {
                window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
                isLoadingMapbox = false;
                resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
              } else {
                const err = "No Mapbox access token provided";
                console.warn(err);
                isLoadingMapbox = false;
                reject(err);
              }
            } else {
              const err = "Mapbox object not available after script load";
              console.error(err);
              isLoadingMapbox = false;
              reject(err);
            }
          }, 100);
        };
        
        mapboxScript.onerror = (error) => {
          const err = "Error loading Mapbox GL JS:";
          console.error(err, error);
          isLoadingMapbox = false;
          reject(err);
        };
      } else {
        // Script tag exists but mapboxgl object might not be ready yet
        const checkMapboxInterval = setInterval(() => {
          if (window.mapboxgl) {
            clearInterval(checkMapboxInterval);
            if (MAPBOX_ACCESS_TOKEN) {
              window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
              isLoadingMapbox = false;
              resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
            } else {
              const err = "No Mapbox access token provided";
              console.warn(err);
              isLoadingMapbox = false;
              reject(err);
            }
          }
        }, 100);
        
        // Set a timeout to avoid infinite waiting
        setTimeout(() => {
          clearInterval(checkMapboxInterval);
          if (!window.mapboxgl) {
            const err = "Mapbox GL JS not available after timeout";
            console.error(err);
            isLoadingMapbox = false;
            reject(err);
          }
        }, 5000);
      }
    } catch (error) {
      console.error("Error in initializeMapbox:", error);
      isLoadingMapbox = false;
      reject(error);
    }
  });
  
  return mapboxLoadPromise;
};

// Helper to safely check if mapbox is loaded and ready
export const isMapboxLoaded = () => {
  return !!window.mapboxgl;
};
