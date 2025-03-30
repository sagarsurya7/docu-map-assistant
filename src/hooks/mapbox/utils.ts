
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
    return mapInstance && 
           !mapInstance._removed && 
           mapInstance.getContainer && 
           typeof mapInstance.getContainer === 'function' &&
           isElementInDOM(mapInstance.getContainer());
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
    }
  } catch (error) {
    console.log("Error during map cleanup:", error);
  }
};
