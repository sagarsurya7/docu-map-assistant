
// Collection of profile images for different genders
const femaleImages = [
  "https://randomuser.me/api/portraits/women/5.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg",
  "https://randomuser.me/api/portraits/women/22.jpg",
  "https://randomuser.me/api/portraits/women/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
];

const maleImages = [
  "https://randomuser.me/api/portraits/men/1.jpg", 
  "https://randomuser.me/api/portraits/men/11.jpg",
  "https://randomuser.me/api/portraits/men/22.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/men/66.jpg",
];

// Get a consistent image based on doctor ID and gender
export const getDoctorImage = (doctorId: string, gender?: 'male' | 'female'): string => {
  // Determine doctor gender if not provided (based on name prefix or ID hash)
  const assumedGender = gender || (doctorId.charAt(0).toLowerCase() > 'm' ? 'female' : 'male');
  
  // Use the doctor ID to consistently pick the same image from the array
  const charSum = doctorId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const imageArray = assumedGender === 'female' ? femaleImages : maleImages;
  const index = charSum % imageArray.length;
  
  return imageArray[index];
};

// Fallback image if the main one fails to load
export const getFallbackImage = (gender?: 'male' | 'female'): string => {
  return gender === 'female' 
    ? "https://randomuser.me/api/portraits/women/0.jpg" 
    : "https://randomuser.me/api/portraits/men/0.jpg";
};
