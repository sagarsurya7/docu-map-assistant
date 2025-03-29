
import { doctors } from '../data/doctors';
import { ChatMessage } from '@/types';

// Symptoms-to-conditions mapping for demo
export const symptomsMapping: Record<string, string[]> = {
  headache: [
    'This could be due to stress, dehydration, or migraine.',
    'I recommend consulting with a Neurologist if it persists.',
    'Would you like to see available neurologists in Pune?'
  ],
  fever: [
    'Fever could indicate an infection or inflammation.',
    'If it is accompanied by other symptoms, consider seeing a General Physician.',
    'Make sure to stay hydrated and rest.'
  ],
  cough: [
    'A cough could be due to a cold, allergies, or respiratory infection.',
    'If it persists for more than a week, you should consult a Pulmonologist.',
    'Is it a dry cough or do you have phlegm?'
  ],
  'chest pain': [
    'Chest pain can be serious and may indicate heart problems.',
    'Please consult a Cardiologist immediately.',
    'If severe, please call emergency services or visit the nearest hospital.'
  ],
  fatigue: [
    'Fatigue can be caused by various factors including stress, poor sleep, or medical conditions.',
    'If persistent, consider consulting an Endocrinologist to check for hormonal imbalances.',
    'Are you experiencing any other symptoms alongside fatigue?'
  ]
};

// Medical specialties mapping
export const specialtiesMapping: Record<string, string[]> = {
  cardiologist: ['heart', 'chest pain', 'blood pressure', 'cardiovascular'],
  neurologist: ['headache', 'migraine', 'brain', 'nerve', 'stroke'],
  pediatrician: ['child', 'baby', 'infant', 'children'],
  orthopedic: ['bone', 'joint', 'fracture', 'back pain', 'knee'],
  dermatologist: ['skin', 'rash', 'acne', 'hair loss'],
  gynecologist: ['pregnancy', 'menstrual', 'women health', 'period'],
  psychiatrist: ['depression', 'anxiety', 'mental health', 'stress'],
  endocrinologist: ['diabetes', 'thyroid', 'hormone', 'fatigue']
};

export const findDoctorsBySpecialty = (specialty: string): string => {
  const matchingDoctors = doctors.filter(
    doctor => doctor.specialty.toLowerCase() === specialty.toLowerCase()
  );
  
  if (matchingDoctors.length === 0) {
    return `I couldn't find any ${specialty} in our database. Would you like to search for another specialty?`;
  }
  
  let response = `I found ${matchingDoctors.length} ${specialty}(s) in Pune:\n\n`;
  matchingDoctors.forEach(doctor => {
    response += `- ${doctor.name}: ${doctor.address}\n  Rating: ${doctor.rating}/5 (${doctor.reviews} reviews)\n  ${doctor.available ? '✅ Available today' : '❌ Not available today'}\n\n`;
  });
  
  response += 'You can view these doctors on the map. Would you like more information about any of them?';
  return response;
};

export const generateResponse = (userInput: string): string => {
  // Check for specialty requests first
  for (const [specialty, keywords] of Object.entries(specialtiesMapping)) {
    for (const keyword of keywords) {
      if (userInput.includes(keyword)) {
        return findDoctorsBySpecialty(specialty.charAt(0).toUpperCase() + specialty.slice(1));
      }
    }
    
    // Direct specialty mentions
    if (userInput.includes(specialty)) {
      return findDoctorsBySpecialty(specialty.charAt(0).toUpperCase() + specialty.slice(1));
    }
  }
  
  // Check for direct doctor requests
  if (userInput.includes('doctor') || userInput.includes('specialist') || userInput.includes('physicians')) {
    // List all specialties available
    const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));
    let response = 'Here are the medical specialties available in our database:\n\n';
    specialties.forEach(specialty => {
      response += `- ${specialty}\n`;
    });
    response += '\nYou can ask about any of these specialties, or ask for doctors near a specific location in Pune.';
    return response;
  }
  
  // Check for symptoms
  for (const [symptom, responses] of Object.entries(symptomsMapping)) {
    if (userInput.includes(symptom)) {
      return responses.join(' ');
    }
  }
  
  // Basic conversation handling
  if (userInput.includes('hello') || userInput.includes('hi')) {
    return 'Hello! How are you feeling today? Can you describe any symptoms you\'re experiencing or what type of doctor you\'re looking for?';
  } else if (userInput.includes('thank')) {
    return 'You\'re welcome! Is there anything else I can help you with?';
  } else if (userInput.includes('appointment')) {
    return 'To book an appointment, please select a doctor from the list or map and click the "Book" button on their profile.';
  } else if (userInput.includes('emergency')) {
    return 'If this is a medical emergency, please call emergency services immediately or visit your nearest emergency room.';
  } else if (userInput.includes('pune') || userInput.includes('location')) {
    return 'Our service currently covers doctors in Pune, India. You can view their locations on the map and filter them by specialty.';
  } else {
    // Default fallback response
    return 'I can help you find doctors by specialty or help with health questions. Try asking about a specific specialist (like "cardiologist"), a symptom (like "headache"), or say "show me all doctors".';
  }
};

export const initialMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content: 'Hello! I\'m your AI medical assistant. How can I help you today? You can describe your symptoms, ask health questions, or find nearby specialists.'
  }
];
