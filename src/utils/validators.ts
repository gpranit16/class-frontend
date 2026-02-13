import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentLoginSchema = z.object({
  identifier: z.string().min(1, 'Student ID or Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentSignupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    contactNumber: z
      .string()
      .regex(/^[0-9]{10}$/, 'Must be a valid 10-digit number'),
    class: z.string().min(1, 'Class is required'),
    section: z.string().optional(),
    rollNo: z.string().min(1, 'Roll number is required'),
    parentName: z.string().optional(),
    parentContact: z
      .string()
      .regex(/^[0-9]{10}$/, 'Must be a valid 10-digit number')
      .optional()
      .or(z.literal('')),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    address: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const addStudentSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters').optional(),
  class: z.string().min(1, 'Class is required'),
  section: z.string().optional(),
  rollNo: z.string().min(1, 'Roll number is required'),
  contactNumber: z
    .string()
    .regex(/^[0-9]{10}$/, 'Must be 10-digit number'),
  parentName: z.string().optional(),
  parentContact: z
    .string()
    .regex(/^[0-9]{10}$/, 'Must be 10-digit number')
    .optional()
    .or(z.literal('')),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
});

export const marksSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  examName: z.string().min(1, 'Exam name is required'),
  examDate: z.string().min(1, 'Exam date is required'),
  examType: z.string().min(1, 'Exam type is required'),
  subject: z.string().min(1, 'Subject is required'),
  marksObtained: z.number().min(0, 'Marks must be >= 0'),
  totalMarks: z.number().min(1, 'Total marks must be >= 1'),
  remarks: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type StudentLoginFormData = z.infer<typeof studentLoginSchema>;
export type StudentSignupFormData = z.infer<typeof studentSignupSchema>;
export type AddStudentFormData = z.infer<typeof addStudentSchema>;
export type MarksFormData = z.infer<typeof marksSchema>;
