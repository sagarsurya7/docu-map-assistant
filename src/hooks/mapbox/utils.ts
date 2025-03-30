
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
    if (mapInstance._removed) {
      console.log("Map has been removed (_removed flag is true)");
      return false;
    }

    // Check if getContainer method exists
    if (!mapInstance.getContainer || typeof mapInstance.getContainer !== 'function') {
      console.log("Map getContainer method is missing or not a function");
      return false;
    }

    // Check if container is in DOM
    const container = mapInstance.getContainer();
    if (!isElementInDOM(container)) {
      console.log("Map container is not in DOM");
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
    console.log("Attempting to remove map", mapInstance);
    
    // First check if map is valid before trying to remove it
    if (isMapValid(mapInstance)) {
      console.log("Map is valid, removing it properly");
      
      // Try to remove event listeners first to avoid removeEventListener errors
      try {
        const container = mapInstance.getContainer();
        if (container) {
          // Clone events array to avoid modification during iteration
          const events = [...mapInstance._events || []];
          events.forEach(event => {
            try {
              mapInstance.off(event.type, event.listener);
            } catch (e) {
              console.log(`Error removing event ${event.type}:`, e);
            }
          });
        }
      } catch (e) {
        console.log("Error removing map event listeners:", e);
      }
      
      // Now safely remove the map
      mapInstance.remove();
      console.log("Map removed successfully");
    } else {
      console.log("Map isn't valid, attempting alternative cleanup");
      
      // If map isn't valid, it may still have a _container property we can clean up
      if (mapInstance._container && isElementInDOM(mapInstance._container)) {
        try {
          mapInstance.remove();
          console.log("Map removed via fallback method");
        } catch (e) {
          console.log("Error removing invalid map:", e);
        }
      } else {
        console.log("Map container not in DOM, no need to remove");
      }
    }
  } catch (error) {
    console.log("Error during map cleanup:", error);
  }
};
