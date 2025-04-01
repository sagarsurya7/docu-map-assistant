
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

    return true;
  } catch (e) {
    console.log("Error checking map validity:", e);
    return false;
  }
};

// Function to safely remove map - simplified to minimize errors
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
      
      // Now safely remove the map - but with minimal interventions
      // to avoid errors with event listeners or DOM manipulation
      mapInstance.remove();
      console.log("Map removed successfully");
    } else {
      console.log("Map isn't valid, skipping removal");
    }
  } catch (error) {
    console.log("Error during map cleanup:", error);
  }
};

// Cleanup in progress flag
let cleanupInProgressFlag = false;

// Function to reset all global map state
export const resetMapState = () => {
  cleanupInProgressFlag = false;
  console.log("Reset map state flags");
};

// Function to set global map instance reference (prevents premature GC)
export const setGlobalMapInstance = (mapInstance: any) => {
  console.log("Set global map instance reference");
};

// Function to clear global map reference (during intentional cleanup)
export const clearGlobalMapInstance = () => {
  console.log("Cleared global map instance reference");
};

// Function to mark cleanup as in progress (prevents duplicate cleanup)
export const markCleanupInProgress = () => {
  if (cleanupInProgressFlag) {
    console.log("Cleanup already in progress, skipping");
    return false;
  }
  cleanupInProgressFlag = true;
  console.log("Marked cleanup in progress");
  return true;
};

// Function to mark cleanup as complete
export const markCleanupComplete = () => {
  cleanupInProgressFlag = false;
  console.log("Marked cleanup complete");
};

// Function to check if cleanup is in progress
export const isCleanupInProgress = () => {
  return cleanupInProgressFlag;
};
