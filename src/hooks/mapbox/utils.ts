
/**
 * Helper functions for Mapbox operations
 */

// Function to safely check if element is in DOM
export const isElementInDOM = (element: HTMLElement | null) => {
  return element && document.body.contains(element);
};

// Helper function to safely check if map is valid and can be operated on
export const isMapValid = (mapInstance: any) => {
  try {
    // Check if the map instance exists
    if (!mapInstance) {
      console.log("Map instance is null or undefined");
      return false;
    }

    // Check if the map has been removed
    if (mapInstance._removed === true) {
      console.log("Map has been removed (_removed flag is true)");
      return false;
    }

    // Check if getContainer method exists
    if (!mapInstance.getContainer || typeof mapInstance.getContainer !== 'function') {
      console.log("Map getContainer method is missing or not a function");
      return false;
    }

    // Check if container is in DOM - the key validation
    try {
      const container = mapInstance.getContainer();
      if (!isElementInDOM(container)) {
        console.log("Map container is not in DOM");
        return false;
      }
    } catch (e) {
      console.log("Error getting map container:", e);
      return false;
    }

    // Additional check to verify map is fully initialized
    try {
      if (typeof mapInstance.loaded === 'function' && !mapInstance.loaded()) {
        console.log("Map is not fully loaded yet");
        return false;
      }
    } catch (e) {
      console.log("Error checking if map is loaded:", e);
      return false;
    }

    return true;
  } catch (e) {
    console.log("Error checking map validity:", e);
    return false;
  }
};

// Function to safely remove map
export const safelyRemoveMap = (mapInstance: any) => {
  if (!mapInstance) {
    console.log("No map instance to remove");
    return;
  }
  
  try {
    console.log("Attempting to remove map");
    
    // First check if map is valid before trying to remove it
    if (isMapValid(mapInstance)) {
      console.log("Map is valid, removing it properly");
      
      // Try to remove event listeners first to avoid removeEventListener errors
      try {
        const events = [...(mapInstance._events || [])];
        events.forEach(event => {
          try {
            mapInstance.off(event.type, event.listener);
          } catch (e) {
            console.log(`Error removing event ${event.type}:`, e);
          }
        });
      } catch (e) {
        console.log("Error removing map event listeners:", e);
      }
      
      // Now safely remove the map
      mapInstance.remove();
      console.log("Map removed successfully");
    } else {
      console.log("Map isn't valid, skipping removal");
    }
  } catch (error) {
    console.log("Error during map cleanup:", error);
  }
};

// Add persistent map reference to prevent GC
let mapInstanceRef: any = null;
let isCleanupInProgress = false;

// Function to set global map instance reference (prevents premature GC)
export const setGlobalMapInstance = (mapInstance: any) => {
  mapInstanceRef = mapInstance;
  console.log("Set global map instance reference");
};

// Function to clear global map reference (during intentional cleanup)
export const clearGlobalMapInstance = () => {
  mapInstanceRef = null;
  console.log("Cleared global map instance reference");
};

// Function to mark cleanup as in progress (prevents duplicate cleanup)
export const markCleanupInProgress = () => {
  if (isCleanupInProgress) {
    console.log("Cleanup already in progress, skipping");
    return false;
  }
  isCleanupInProgress = true;
  console.log("Marked cleanup in progress");
  return true;
};

// Function to mark cleanup as complete
export const markCleanupComplete = () => {
  isCleanupInProgress = false;
  console.log("Marked cleanup complete");
};

// Function to check if cleanup is in progress
export const isCleanupInProgress = () => {
  return isCleanupInProgress;
};
