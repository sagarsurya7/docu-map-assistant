
// Default to empty token, will be replaced by user input
let MAPBOX_ACCESS_TOKEN = ""; 

// Get token from localStorage if it exists
try {
  const storedToken = localStorage.getItem('mapbox-token');
  if (storedToken) {
    MAPBOX_ACCESS_TOKEN = storedToken;
    console.log("Loaded Mapbox token from localStorage");
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

// Helper function to check if Mapbox script is already in the document
const isMapboxScriptPresent = () => {
  return !!document.getElementById('mapbox-gl-script');
};

// Helper function to check if Mapbox CSS is already in the document
const isMapboxCssPresent = () => {
  return !!document.getElementById('mapbox-gl-css');
};

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
          reject(new Error("No Mapbox access token provided"));
        }
        return;
      }
      
      // Check for existing script to avoid duplicates
      if (!isMapboxScriptPresent()) {
        console.log("Loading Mapbox GL JS");
        
        // Get the document head - guard against missing head
        const head = document.head || document.getElementsByTagName('head')[0];
        if (!head) {
          const err = new Error("Document head not available");
          console.error(err);
          isLoadingMapbox = false;
          reject(err);
          return;
        }
        
        // Add Mapbox CSS if not already present
        if (!isMapboxCssPresent()) {
          const mapboxCss = document.createElement('link');
          mapboxCss.id = 'mapbox-gl-css';
          mapboxCss.rel = 'stylesheet';
          mapboxCss.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
          mapboxCss.crossOrigin = 'anonymous';
          
          // Append CSS to head
          head.appendChild(mapboxCss);
        }
        
        // Create and load Mapbox GL JS script
        const mapboxScript = document.createElement('script');
        mapboxScript.id = 'mapbox-gl-script';
        mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
        mapboxScript.async = true;
        mapboxScript.crossOrigin = 'anonymous';
        
        // Handle script load
        mapboxScript.onload = () => {
          console.log("Mapbox script loaded");
          
          // Give the script a moment to initialize
          setTimeout(() => {
            if (window.mapboxgl) {
              console.log("Mapbox GL JS loaded successfully");
              if (MAPBOX_ACCESS_TOKEN) {
                window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
                isLoadingMapbox = false;
                resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
              } else {
                const err = new Error("No Mapbox access token provided");
                console.warn(err);
                isLoadingMapbox = false;
                reject(err);
              }
            } else {
              const err = new Error("Mapbox object not available after script load");
              console.error(err);
              isLoadingMapbox = false;
              reject(err);
            }
          }, 200);
        };
        
        // Handle script load error
        mapboxScript.onerror = (error) => {
          const err = new Error(`Error loading Mapbox GL JS: ${error}`);
          console.error(err);
          isLoadingMapbox = false;
          reject(err);
        };
        
        // Append script to head
        head.appendChild(mapboxScript);
      } else {
        // Script tag exists but mapboxgl object might not be ready yet
        console.log("Mapbox script tag already exists, checking for object");
        
        let checkAttempts = 0;
        const maxCheckAttempts = 20;
        
        const checkMapboxInterval = setInterval(() => {
          checkAttempts++;
          
          if (window.mapboxgl) {
            clearInterval(checkMapboxInterval);
            if (MAPBOX_ACCESS_TOKEN) {
              window.mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
              isLoadingMapbox = false;
              resolve({ accessToken: MAPBOX_ACCESS_TOKEN });
            } else {
              const err = new Error("No Mapbox access token provided");
              console.warn(err);
              isLoadingMapbox = false;
              reject(err);
            }
          } else if (checkAttempts >= maxCheckAttempts) {
            clearInterval(checkMapboxInterval);
            const err = new Error("Mapbox GL JS not available after timeout");
            console.error(err);
            isLoadingMapbox = false;
            reject(err);
          }
        }, 200);
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

// Add type for window object
declare global {
  interface Window {
    mapboxgl: any;
  }
}
