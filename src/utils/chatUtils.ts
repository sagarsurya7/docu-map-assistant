
import { ChatMessage, Doctor } from '@/types';

export const initialMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content: 'Hello! I\'m your AI health assistant. To provide better recommendations, could you please tell me which city you are in? We have doctors in Mumbai, Delhi, Bangalore, and Pune.'
  }
];

// Helper function to format doctor information for chat responses
export const formatDoctorInfo = (doctor: Doctor): string => {
  return `
Dr. ${doctor.name}
Specialty: ${doctor.specialty}
Experience: ${doctor.experience} years
Rating: ${doctor.rating}/5
Location: ${doctor.area}, ${doctor.city}
Consultation Fee: ₹${doctor.consultationFee}
  `.trim();
};

// Function to generate response for doctor search
export const generateDoctorSearchResponse = (doctors: Doctor[]): string => {
  if (doctors.length === 0) {
    return "I couldn't find any doctors matching your search criteria. Please try different keywords or filters.";
  }

  const count = doctors.length;
  const doctorList = doctors.slice(0, 3).map(doctor => formatDoctorInfo(doctor)).join('\n\n');
  
  return `
I found ${count} doctors matching your search. ${count > 3 ? 'Here are the top 3:' : 'Here are the details:'}

${doctorList}

${count > 3 ? `And ${count - 3} more doctors are available.` : ''}

Would you like to book an appointment with any of these doctors?
  `.trim();
};

// Function to generate doctor recommendation based on symptoms
export const generateDoctorRecommendation = (
  symptoms: string[], 
  specialties: string[], 
  doctors: Doctor[]
): string => {
  const recommendedDoctors = doctors.filter(doctor => 
    specialties.includes(doctor.specialty)
  ).slice(0, 3);
  
  if (recommendedDoctors.length === 0) {
    return `
Based on your symptoms (${symptoms.join(', ')}), I recommend consulting a ${specialties.join(' or ')}. 
Unfortunately, I couldn't find any doctors with these specialties in our database.
    `.trim();
  }
  
  const doctorsList = recommendedDoctors.map(doctor => {
    // Using optional chaining to safely handle potentially missing 'reviews' property
    const reviewCount = doctor.reviews?.length || 0;
    return formatDoctorInfo(doctor);
  }).join('\n\n');
  
  return `
Based on your symptoms (${symptoms.join(', ')}), I recommend consulting a ${specialties.join(' or ')}.
Here are some doctors who can help:

${doctorsList}

Would you like to book an appointment with any of these doctors?
  `.trim();
};
