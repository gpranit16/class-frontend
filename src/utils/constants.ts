export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const CLASSES = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
export const SECTIONS = ['A', 'B', 'C', 'D'];
export const GENDERS = ['Male', 'Female', 'Other'];
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
export const EXAM_TYPES = ['Unit Test', 'Mid Term', 'Final', 'Monthly Test', 'Weekly Test'];
export const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'Hindi',
  'Social Science',
  'Computer Science',
];

export const GRADE_COLORS: Record<string, string> = {
  'A+': 'bg-green-100 text-green-800',
  'A': 'bg-green-50 text-green-700',
  'B+': 'bg-blue-100 text-blue-800',
  'B': 'bg-blue-50 text-blue-700',
  'C': 'bg-yellow-100 text-yellow-800',
  'D': 'bg-orange-100 text-orange-800',
  'F': 'bg-red-100 text-red-800',
};

export const PRIORITY_COLORS: Record<string, string> = {
  'High': 'bg-red-100 text-red-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'Low': 'bg-green-100 text-green-800',
};
