export interface Degree {
  name: string
  category: 'Engineering' | 'Technology' | 'Business' | 'Sciences' | 'Arts' | 'Health' | 'Social Sciences' | 'Education' | 'Other'
  marketValue: 'High' | 'Medium' | 'Standard'
}

export const DEGREES: Degree[] = [
  // Technology
  { name: 'Computer Science', category: 'Technology', marketValue: 'High' },
  { name: 'Software Engineering', category: 'Technology', marketValue: 'High' },
  { name: 'Computer Engineering', category: 'Technology', marketValue: 'High' },
  { name: 'Information Technology', category: 'Technology', marketValue: 'High' },
  { name: 'Data Science', category: 'Technology', marketValue: 'High' },
  { name: 'Data Analytics', category: 'Technology', marketValue: 'High' },
  { name: 'Artificial Intelligence', category: 'Technology', marketValue: 'High' },
  { name: 'Machine Learning', category: 'Technology', marketValue: 'High' },
  { name: 'Cybersecurity', category: 'Technology', marketValue: 'High' },
  { name: 'Network Engineering', category: 'Technology', marketValue: 'High' },
  { name: 'Cloud Computing', category: 'Technology', marketValue: 'High' },
  { name: 'Information Systems', category: 'Technology', marketValue: 'Medium' },
  { name: 'Web Development', category: 'Technology', marketValue: 'High' },
  { name: 'Game Design', category: 'Technology', marketValue: 'Medium' },
  { name: 'User Experience Design', category: 'Technology', marketValue: 'High' },
  { name: 'Human-Computer Interaction', category: 'Technology', marketValue: 'High' },
  
  // Engineering
  { name: 'Electrical Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Mechanical Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Civil Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Chemical Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Biomedical Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Aerospace Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Industrial Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Environmental Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Materials Engineering', category: 'Engineering', marketValue: 'Medium' },
  { name: 'Petroleum Engineering', category: 'Engineering', marketValue: 'Medium' },
  { name: 'Nuclear Engineering', category: 'Engineering', marketValue: 'Medium' },
  { name: 'Systems Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Robotics Engineering', category: 'Engineering', marketValue: 'High' },
  
  // Business
  { name: 'Business Administration', category: 'Business', marketValue: 'Medium' },
  { name: 'Business Management', category: 'Business', marketValue: 'Medium' },
  { name: 'Finance', category: 'Business', marketValue: 'High' },
  { name: 'Accounting', category: 'Business', marketValue: 'High' },
  { name: 'Marketing', category: 'Business', marketValue: 'Medium' },
  { name: 'Management', category: 'Business', marketValue: 'Medium' },
  { name: 'Economics', category: 'Business', marketValue: 'High' },
  { name: 'Supply Chain Management', category: 'Business', marketValue: 'Medium' },
  { name: 'Operations Management', category: 'Business', marketValue: 'Medium' },
  { name: 'International Business', category: 'Business', marketValue: 'Medium' },
  { name: 'Entrepreneurship', category: 'Business', marketValue: 'Medium' },
  { name: 'Business Analytics', category: 'Business', marketValue: 'High' },
  { name: 'Real Estate', category: 'Business', marketValue: 'Medium' },
  { name: 'Insurance', category: 'Business', marketValue: 'Medium' },
  { name: 'Human Resources', category: 'Business', marketValue: 'Medium' },
  { name: 'Public Relations', category: 'Business', marketValue: 'Medium' },
  
  // Sciences
  { name: 'Biology', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Chemistry', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Physics', category: 'Sciences', marketValue: 'High' },
  { name: 'Mathematics', category: 'Sciences', marketValue: 'High' },
  { name: 'Statistics', category: 'Sciences', marketValue: 'High' },
  { name: 'Biochemistry', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Biophysics', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Molecular Biology', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Genetics', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Astrophysics', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Environmental Science', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Geology', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Marine Science', category: 'Sciences', marketValue: 'Standard' },
  { name: 'Astronomy', category: 'Sciences', marketValue: 'Standard' },
  { name: 'Neuroscience', category: 'Sciences', marketValue: 'High' },
  { name: 'Bioinformatics', category: 'Sciences', marketValue: 'High' },
  
  // Health
  { name: 'Medicine', category: 'Health', marketValue: 'High' },
  { name: 'Nursing', category: 'Health', marketValue: 'High' },
  { name: 'Pharmacy', category: 'Health', marketValue: 'High' },
  { name: 'Public Health', category: 'Health', marketValue: 'Medium' },
  { name: 'Health Administration', category: 'Health', marketValue: 'Medium' },
  { name: 'Physical Therapy', category: 'Health', marketValue: 'High' },
  { name: 'Occupational Therapy', category: 'Health', marketValue: 'High' },
  { name: 'Physician Assistant', category: 'Health', marketValue: 'High' },
  { name: 'Dentistry', category: 'Health', marketValue: 'High' },
  { name: 'Veterinary Science', category: 'Health', marketValue: 'High' },
  { name: 'Nutrition', category: 'Health', marketValue: 'Medium' },
  { name: 'Kinesiology', category: 'Health', marketValue: 'Medium' },
  { name: 'Medical Laboratory Science', category: 'Health', marketValue: 'Medium' },
  
  // Social Sciences
  { name: 'Psychology', category: 'Social Sciences', marketValue: 'Medium' },
  { name: 'Sociology', category: 'Social Sciences', marketValue: 'Standard' },
  { name: 'Anthropology', category: 'Social Sciences', marketValue: 'Standard' },
  { name: 'Political Science', category: 'Social Sciences', marketValue: 'Medium' },
  { name: 'International Relations', category: 'Social Sciences', marketValue: 'Medium' },
  { name: 'Criminal Justice', category: 'Social Sciences', marketValue: 'Medium' },
  { name: 'Criminology', category: 'Social Sciences', marketValue: 'Standard' },
  { name: 'Social Work', category: 'Social Sciences', marketValue: 'Medium' },
  { name: 'Communication', category: 'Social Sciences', marketValue: 'Medium' },
  { name: 'Journalism', category: 'Social Sciences', marketValue: 'Standard' },
  { name: 'Media Studies', category: 'Social Sciences', marketValue: 'Standard' },
  { name: 'Public Policy', category: 'Social Sciences', marketValue: 'Medium' },
  
  // Arts & Humanities
  { name: 'English', category: 'Arts', marketValue: 'Standard' },
  { name: 'History', category: 'Arts', marketValue: 'Standard' },
  { name: 'Philosophy', category: 'Arts', marketValue: 'Standard' },
  { name: 'Literature', category: 'Arts', marketValue: 'Standard' },
  { name: 'Creative Writing', category: 'Arts', marketValue: 'Standard' },
  { name: 'Fine Arts', category: 'Arts', marketValue: 'Standard' },
  { name: 'Art History', category: 'Arts', marketValue: 'Standard' },
  { name: 'Music', category: 'Arts', marketValue: 'Standard' },
  { name: 'Theater', category: 'Arts', marketValue: 'Standard' },
  { name: 'Film Studies', category: 'Arts', marketValue: 'Standard' },
  { name: 'Graphic Design', category: 'Arts', marketValue: 'Medium' },
  { name: 'Industrial Design', category: 'Arts', marketValue: 'Medium' },
  { name: 'Fashion Design', category: 'Arts', marketValue: 'Standard' },
  { name: 'Architecture', category: 'Arts', marketValue: 'High' },
  { name: 'Languages', category: 'Arts', marketValue: 'Standard' },
  { name: 'Linguistics', category: 'Arts', marketValue: 'Medium' },
  { name: 'Religious Studies', category: 'Arts', marketValue: 'Standard' },
  { name: 'Classical Studies', category: 'Arts', marketValue: 'Standard' },
  
  // Education
  { name: 'Education', category: 'Education', marketValue: 'Medium' },
  { name: 'Elementary Education', category: 'Education', marketValue: 'Medium' },
  { name: 'Secondary Education', category: 'Education', marketValue: 'Medium' },
  { name: 'Special Education', category: 'Education', marketValue: 'Medium' },
  { name: 'Educational Leadership', category: 'Education', marketValue: 'Medium' },
  
  // Other
  { name: 'Agriculture', category: 'Other', marketValue: 'Medium' },
  { name: 'Food Science', category: 'Other', marketValue: 'Medium' },
  { name: 'Hospitality Management', category: 'Other', marketValue: 'Medium' },
  { name: 'Tourism', category: 'Other', marketValue: 'Standard' },
  { name: 'Sports Management', category: 'Other', marketValue: 'Standard' },
  { name: 'Aviation', category: 'Other', marketValue: 'Medium' },
  { name: 'Urban Planning', category: 'Other', marketValue: 'Medium' },
  { name: 'Library Science', category: 'Other', marketValue: 'Standard' },
  
  // Additional Technology Degrees
  { name: 'Blockchain Technology', category: 'Technology', marketValue: 'High' },
  { name: 'Quantum Computing', category: 'Technology', marketValue: 'High' },
  { name: 'Internet of Things', category: 'Technology', marketValue: 'High' },
  { name: 'Mobile App Development', category: 'Technology', marketValue: 'High' },
  { name: 'DevOps Engineering', category: 'Technology', marketValue: 'High' },
  { name: 'Full Stack Development', category: 'Technology', marketValue: 'High' },
  { name: 'Database Administration', category: 'Technology', marketValue: 'Medium' },
  { name: 'IT Project Management', category: 'Technology', marketValue: 'Medium' },
  
  // Additional Engineering Degrees
  { name: 'Automotive Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Marine Engineering', category: 'Engineering', marketValue: 'Medium' },
  { name: 'Mining Engineering', category: 'Engineering', marketValue: 'Medium' },
  { name: 'Agricultural Engineering', category: 'Engineering', marketValue: 'Medium' },
  { name: 'Telecommunications Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Software Systems Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Biochemical Engineering', category: 'Engineering', marketValue: 'High' },
  { name: 'Optical Engineering', category: 'Engineering', marketValue: 'Medium' },
  
  // Additional Business Degrees
  { name: 'Investment Banking', category: 'Business', marketValue: 'High' },
  { name: 'Financial Planning', category: 'Business', marketValue: 'Medium' },
  { name: 'Digital Marketing', category: 'Business', marketValue: 'High' },
  { name: 'E-Commerce', category: 'Business', marketValue: 'High' },
  { name: 'Project Management', category: 'Business', marketValue: 'Medium' },
  { name: 'Organizational Leadership', category: 'Business', marketValue: 'Medium' },
  { name: 'Risk Management', category: 'Business', marketValue: 'High' },
  { name: 'Commodities Trading', category: 'Business', marketValue: 'High' },
  
  // Additional Science Degrees
  { name: 'Computational Biology', category: 'Sciences', marketValue: 'High' },
  { name: 'Quantum Physics', category: 'Sciences', marketValue: 'High' },
  { name: 'Materials Science', category: 'Sciences', marketValue: 'High' },
  { name: 'Nanotechnology', category: 'Sciences', marketValue: 'High' },
  { name: 'Climate Science', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Forensic Science', category: 'Sciences', marketValue: 'Medium' },
  { name: 'Pharmacology', category: 'Sciences', marketValue: 'High' },
  { name: 'Toxicology', category: 'Sciences', marketValue: 'Medium' },
  
  // Additional Health Degrees
  { name: 'Radiology', category: 'Health', marketValue: 'High' },
  { name: 'Anesthesiology', category: 'Health', marketValue: 'High' },
  { name: 'Surgery', category: 'Health', marketValue: 'High' },
  { name: 'Psychiatry', category: 'Health', marketValue: 'High' },
  { name: 'Pediatrics', category: 'Health', marketValue: 'High' },
  { name: 'Epidemiology', category: 'Health', marketValue: 'High' },
  { name: 'Health Informatics', category: 'Health', marketValue: 'High' },
  { name: 'Medical Imaging', category: 'Health', marketValue: 'High' },
  
  // Additional Social Science Degrees
  { name: 'Behavioral Economics', category: 'Social Sciences', marketValue: 'High' },
  { name: 'Cognitive Science', category: 'Social Sciences', marketValue: 'High' },
  { name: 'Data Journalism', category: 'Social Sciences', marketValue: 'Medium' },
  { name: 'Public Administration', category: 'Social Sciences', marketValue: 'Medium' },
  { name: 'Urban Studies', category: 'Social Sciences', marketValue: 'Medium' },
  { name: 'Gender Studies', category: 'Social Sciences', marketValue: 'Standard' },
  { name: 'Ethnic Studies', category: 'Social Sciences', marketValue: 'Standard' },
  { name: 'Peace and Conflict Studies', category: 'Social Sciences', marketValue: 'Standard' },
  
  // Additional Arts Degrees
  { name: 'Digital Arts', category: 'Arts', marketValue: 'Medium' },
  { name: 'Animation', category: 'Arts', marketValue: 'Medium' },
  { name: 'Game Art', category: 'Arts', marketValue: 'Medium' },
  { name: 'Interior Design', category: 'Arts', marketValue: 'Medium' },
  { name: 'Landscape Architecture', category: 'Arts', marketValue: 'High' },
  { name: 'Photography', category: 'Arts', marketValue: 'Standard' },
  { name: 'Illustration', category: 'Arts', marketValue: 'Standard' },
  { name: 'Music Production', category: 'Arts', marketValue: 'Medium' },
]

// Helper function to find degree (case-insensitive, fuzzy matching)
export function findDegree(input: string): Degree | null {
  const normalizedInput = input.toLowerCase().trim()
  
  // Exact match first
  const exactMatch = DEGREES.find(
    degree => degree.name.toLowerCase() === normalizedInput
  )
  if (exactMatch) return exactMatch
  
  // Partial match (contains)
  const partialMatch = DEGREES.find(
    degree => degree.name.toLowerCase().includes(normalizedInput) ||
              normalizedInput.includes(degree.name.toLowerCase())
  )
  if (partialMatch) return partialMatch
  
  // Fuzzy match for common variations
  const fuzzyMatches: { [key: string]: string } = {
    'cs': 'Computer Science',
    'comp sci': 'Computer Science',
    'software': 'Software Engineering',
    'data': 'Data Science',
    'ai': 'Artificial Intelligence',
    'ml': 'Machine Learning',
    'cyber security': 'Cybersecurity',
    'network': 'Network Engineering',
    'cloud': 'Cloud Computing',
    'it': 'Information Technology',
    'is': 'Information Systems',
    'ux': 'User Experience Design',
    'hci': 'Human-Computer Interaction',
    'ee': 'Electrical Engineering',
    'me': 'Mechanical Engineering',
    'ce': 'Civil Engineering',
    'chem e': 'Chemical Engineering',
    'biomedical': 'Biomedical Engineering',
    'aerospace': 'Aerospace Engineering',
    'industrial': 'Industrial Engineering',
    'environmental': 'Environmental Engineering',
    'systems': 'Systems Engineering',
    'robotics': 'Robotics Engineering',
    'business': 'Business Administration',
    'business management': 'Business Management',
    'business mgmt': 'Business Management',
    'mba': 'Business Administration',
    'accounting': 'Accounting',
    'finance': 'Finance',
    'marketing': 'Marketing',
    'management': 'Management',
    'econ': 'Economics',
    'economics': 'Economics',
    'bio': 'Biology',
    'biology': 'Biology',
    'chem': 'Chemistry',
    'chemistry': 'Chemistry',
    'physics': 'Physics',
    'math': 'Mathematics',
    'mathematics': 'Mathematics',
    'stats': 'Statistics',
    'statistics': 'Statistics',
    'bioinformatics': 'Bioinformatics',
    'neuro': 'Neuroscience',
    'neuroscience': 'Neuroscience',
    'nursing': 'Nursing',
    'public health': 'Public Health',
    'psych': 'Psychology',
    'psychology': 'Psychology',
    'english': 'English',
    'history': 'History',
    'philosophy': 'Philosophy',
    'arch': 'Architecture',
    'architecture': 'Architecture',
    'education': 'Education',
  }
  
  const fuzzyKey = Object.keys(fuzzyMatches).find(
    key => normalizedInput.includes(key) || key.includes(normalizedInput)
  )
  
  if (fuzzyKey) {
    const fullName = fuzzyMatches[fuzzyKey]
    return DEGREES.find(degree => degree.name === fullName) || null
  }
  
  return null
}

