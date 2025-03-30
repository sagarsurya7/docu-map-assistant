
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
    if (!mapInstance.loaded()) {
      console.log("Map is not fully loaded yet");
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
  if (!mapInstance) return;
  
  try {
    // First check if map is valid before trying to remove it
    if (isMapValid(mapInstance)) {
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
    } else {
      // If map isn't valid, it may still have a _container property we can clean up
      if (mapInstance._container && isElementInDOM(mapInstance._container)) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.log("Error removing invalid map:", e);
        }
      }
    }
  } catch (error) {
    console.log("Error during map cleanup:", error);
  }
};
