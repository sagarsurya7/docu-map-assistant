
// Medical specialties with descriptions

export const specialties = [
  {
    name: 'Cardiology',
    description: 'Diagnosis and treatment of heart disorders'
  },
  {
    name: 'Dermatology',
    description: 'Diagnosis and treatment of skin disorders'
  },
  {
    name: 'Endocrinology',
    description: 'Diagnosis and treatment of hormone disorders'
  },
  {
    name: 'Gastroenterology',
    description: 'Diagnosis and treatment of digestive disorders'
  },
  {
    name: 'Neurology',
    description: 'Diagnosis and treatment of nervous system disorders'
  },
  {
    name: 'Obstetrics & Gynecology',
    description: 'Pregnancy, childbirth, and women\'s reproductive health'
  },
  {
    name: 'Ophthalmology',
    description: 'Diagnosis and treatment of eye disorders'
  },
  {
    name: 'Orthopedics',
    description: 'Diagnosis and treatment of skeletal and muscular disorders'
  },
  {
    name: 'Pediatrics',
    description: 'Medical care of infants, children, and adolescents'
  },
  {
    name: 'Psychiatry',
    description: 'Diagnosis and treatment of mental disorders'
  },
  {
    name: 'Pulmonology',
    description: 'Diagnosis and treatment of respiratory disorders'
  },
  {
    name: 'Rheumatology',
    description: 'Diagnosis and treatment of rheumatic diseases'
  },
  {
    name: 'Urology',
    description: 'Diagnosis and treatment of urinary tract disorders'
  },
  {
    name: 'ENT (Ear, Nose, Throat)',
    description: 'Diagnosis and treatment of ear, nose, and throat disorders'
  },
  {
    name: 'Oncology',
    description: 'Diagnosis and treatment of cancer'
  },
  {
    name: 'Dentistry',
    description: 'Diagnosis and treatment of oral health issues'
  },
  {
    name: 'General Medicine',
    description: 'General diagnosis and treatment of medical conditions'
  },
  {
    name: 'General Surgery',
    description: 'Surgical procedures for various conditions'
  }
];

// Export specialty names as an array for easy filtering
export const specialtyNames = specialties.map(specialty => specialty.name);

// Export mapping of specialties to common symptoms
export const specialtyToSymptoms = {
  'Cardiology': ['Chest pain', 'Shortness of breath', 'Palpitations', 'Dizziness', 'Fatigue'],
  'Dermatology': ['Rash', 'Itching', 'Acne', 'Hair loss', 'Skin lesions'],
  'Endocrinology': ['Fatigue', 'Unexplained weight changes', 'Increased thirst', 'Frequent urination'],
  'Gastroenterology': ['Abdominal pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Heartburn'],
  'Neurology': ['Headache', 'Dizziness', 'Numbness', 'Weakness', 'Seizures', 'Memory problems'],
  'Obstetrics & Gynecology': ['Irregular periods', 'Pelvic pain', 'Pregnancy concerns', 'Menopause symptoms'],
  'Ophthalmology': ['Blurred vision', 'Eye pain', 'Red eye', 'Floaters', 'Dry eyes'],
  'Orthopedics': ['Joint pain', 'Back pain', 'Fractures', 'Sprains', 'Limited mobility'],
  'Pediatrics': ['Fever', 'Cough', 'Ear pain', 'Growth concerns', 'Behavioral issues'],
  'Psychiatry': ['Depression', 'Anxiety', 'Insomnia', 'Mood changes', 'Behavioral changes'],
  'Pulmonology': ['Cough', 'Shortness of breath', 'Wheezing', 'Chest congestion', 'Sleep apnea'],
  'Rheumatology': ['Joint pain', 'Joint swelling', 'Morning stiffness', 'Muscle pain', 'Fatigue'],
  'Urology': ['Painful urination', 'Blood in urine', 'Frequent urination', 'Incontinence', 'Erectile dysfunction'],
  'ENT (Ear, Nose, Throat)': ['Ear pain', 'Hearing loss', 'Sore throat', 'Nasal congestion', 'Hoarseness'],
  'Oncology': ['Unexplained weight loss', 'Fatigue', 'Persistent pain', 'Unusual bleeding', 'Lumps or masses'],
  'Dentistry': ['Toothache', 'Gum bleeding', 'Tooth sensitivity', 'Bad breath', 'Jaw pain'],
  'General Medicine': ['Fever', 'Fatigue', 'General pain', 'Cough', 'Common illnesses'],
  'General Surgery': ['Hernia', 'Gallbladder issues', 'Appendicitis', 'Injuries requiring surgery']
};

// Mapping symptoms to recommended specialties
export const symptomToSpecialty = {
  'Chest pain': ['Cardiology'],
  'Shortness of breath': ['Cardiology', 'Pulmonology'],
  'Palpitations': ['Cardiology'],
  'Rash': ['Dermatology'],
  'Itching': ['Dermatology'],
  'Fatigue': ['Endocrinology', 'General Medicine', 'Cardiology'],
  'Weight changes': ['Endocrinology'],
  'Abdominal pain': ['Gastroenterology', 'General Surgery'],
  'Nausea': ['Gastroenterology'],
  'Headache': ['Neurology'],
  'Dizziness': ['Neurology', 'ENT (Ear, Nose, Throat)'],
  'Irregular periods': ['Obstetrics & Gynecology'],
  'Blurred vision': ['Ophthalmology'],
  'Joint pain': ['Orthopedics', 'Rheumatology'],
  'Back pain': ['Orthopedics'],
  'Fever in children': ['Pediatrics'],
  'Depression': ['Psychiatry'],
  'Cough': ['Pulmonology', 'General Medicine'],
  'Joint swelling': ['Rheumatology'],
  'Painful urination': ['Urology'],
  'Ear pain': ['ENT (Ear, Nose, Throat)'],
  'Unusual bleeding': ['Oncology', 'General Medicine'],
  'Toothache': ['Dentistry']
};
