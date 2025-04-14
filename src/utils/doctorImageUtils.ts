// Collection of professional doctor profile images for different genders
const femaleImages = [
  "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
  "https://img.freepik.com/free-photo/front-view-covid-recovery-center-female-doctor-with-stethoscope_23-2148847896.jpg",
  "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg",
  "https://img.freepik.com/free-photo/portrait-smiling-young-woman-doctor-healthcare-medical-worker-pointing-fingers-left-showing-clinic-advertisement_1258-88108.jpg",
  "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
  "https://img.freepik.com/free-photo/woman-doctor-posing-against-blue-background_144627-60374.jpg",
];

const maleImages = [
  "https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg", 
  "https://img.freepik.com/free-photo/pleased-young-male-doctor-wearing-medical-robe-stethoscope_409827-387.jpg",
  "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5657.jpg",
  "https://img.freepik.com/free-photo/portrait-successful-mid-adult-doctor-with-crossed-arms_1262-12865.jpg",
  "https://img.freepik.com/free-photo/young-male-doctor-with-stethoscope-standing-hospital-corridor_651396-1235.jpg",
  "https://img.freepik.com/free-photo/handsome-young-male-doctor-with-stethoscope-standing-against-blue-background_662251-388.jpg",
];

// Fallback images with better reliability
const fallbackFemaleImage = "https://img.freepik.com/free-photo/medium-shot-smiley-doctor-with-coat_23-2149615762.jpg";
const fallbackMaleImage = "https://img.freepik.com/free-photo/medium-shot-doctor-with-crossed-arms_23-2149613635.jpg";

// Cache previously successful image URLs to avoid re-requests for failed images
const imageCache: Record<string, string> = {};

// Get a consistent image based on doctor ID and gender with error handling
export const getDoctorImage = (doctorId?: string, gender: 'male' | 'female' = 'male'): string => {
  // Check cache first to avoid repeated failures
  const cacheKey = `${doctorId}-${gender}`;
  if (imageCache[cacheKey]) {
    console.log(`Using cached image for ${cacheKey}:`, imageCache[cacheKey]);
    return imageCache[cacheKey];
  }
  
  // If no doctorId, return a fallback immediately
  if (!doctorId) {
    const fallback = gender === 'female' ? fallbackFemaleImage : fallbackMaleImage;
    imageCache[cacheKey] = fallback; // Cache the fallback too
    return fallback;
  }
  
  try {
    // Use the doctor ID to consistently pick the same image from the array
    const charSum = doctorId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const imageArray = gender === 'female' ? femaleImages : maleImages;
    const index = charSum % imageArray.length;
    
    // Store in cache and return
    const selectedImage = imageArray[index];
    imageCache[cacheKey] = selectedImage;
    return selectedImage;
  } catch (error) {
    // Return fallback on any error
    const fallbackImage = gender === 'female' ? fallbackFemaleImage : fallbackMaleImage;
    imageCache[cacheKey] = fallbackImage; // Cache the fallback too
    return fallbackImage;
  }
};

// Fallback image if the main one fails to load
export const getFallbackImage = (gender: 'male' | 'female' = 'male'): string => {
  return gender === 'female' ? fallbackFemaleImage : fallbackMaleImage;
};

// Mark a specific doctor image as failed in the cache
export const markImageAsFailed = (doctorId?: string, gender: 'male' | 'female' = 'male'): void => {
  if (!doctorId) return;
  
  const cacheKey = `${doctorId}-${gender}`;
  const fallbackImage = gender === 'female' ? fallbackFemaleImage : fallbackMaleImage;
  console.log(`Marking image as failed for ${cacheKey}, using fallback:`, fallbackImage);
  imageCache[cacheKey] = fallbackImage;
};
