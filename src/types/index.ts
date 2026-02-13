export interface Admin {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface Student {
  _id: string;
  studentId: string;
  name: string;
  email: string;
  class: string;
  section?: string;
  rollNo: string;
  contactNumber: string;
  parentName?: string;
  parentContact?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  address?: string;
  profilePhoto?: string;
  admissionDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarksEntry {
  _id: string;
  studentId: string | Student;
  studentName: string;
  class: string;
  examType: 'Unit Test' | 'Mid Term' | 'Final' | 'Monthly Test' | 'Weekly Test';
  examName: string;
  examDate: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  priority: 'High' | 'Medium' | 'Low';
  targetClass?: string;
  targetSection?: string;
  isActive: boolean;
  expiryDate?: string;
  createdBy?: { fullName?: string; username?: string };
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name?: string;
  username?: string;
  email: string;
  role: 'admin' | 'student';
  studentId?: string;
  class?: string;
  section?: string;
  fullName?: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  totalExams: number;
  averagePerformance: number;
  classWiseCount: Array<{ _id: string; count: number }>;
  recentActivities: Array<{
    studentName: string;
    examName: string;
    subject: string;
    createdAt: string;
  }>;
}

export interface ResultsSummary {
  subjectWiseAverage: Array<{
    _id: string;
    avgPercentage: number;
    totalExams: number;
    highestScore: number;
    lowestScore: number;
  }>;
  examWisePerformance: Array<{
    _id: string;
    avgPercentage: number;
    examDate: string;
    examType: string;
    subjects: number;
  }>;
  overallGrade: string;
  overallPercentage: number;
  rank: string;
  strengths: string[];
  improvements: string[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  students: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}
