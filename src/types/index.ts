// EduVaza Type Definitions

export type UserRole = 'super_admin' | 'school' | 'teacher' | 'student';

export type Language = 'en' | 'fr' | 'ar' | 'sw';

export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  schoolId?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface School {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  status: 'pending' | 'approved' | 'suspended';
  teacherCount: number;
  studentCount: number;
  createdAt: Date;
}

export interface Teacher {
  id: string;
  userId: string;
  schoolId: string;
  name: string;
  email: string;
  subjects: string[];
  classes: string[];
  createdAt: Date;
}

export interface Student {
  id: string;
  userId: string;
  schoolId: string;
  name: string;
  email: string;
  grade: string;
  classId?: string;
  enrolledCourses: string[];
  createdAt: Date;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  grade: string;
  teacherId?: string;
  studentCount: number;
  assignedCourses: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  teacherId: string;
  teacherName: string;
  schoolId?: string;
  language: Language;
  category: string;
  curriculum?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  lessons: Lesson[];
  enrolledCount: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  contentType: 'text' | 'pdf' | 'video';
  pdfUrl?: string;
  videoUrl?: string;
  order: number;
  duration?: number; // in minutes
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number; // 0-100
  completedLessons: string[];
  lastAccessedAt: Date;
  enrolledAt: Date;
}

export interface CourseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  courseCount: number;
}

export interface DashboardStats {
  totalSchools: number;
  totalTeachers: number;
  totalStudents: number;
  totalCourses: number;
  activeUsers: number;
  pendingApprovals: number;
}

// Auth Context Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, code: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  selectRole: (role: UserRole) => void;
  selectSchool: (schoolId: string) => void;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  schoolId?: string;
}

// i18n Types
export interface Translations {
  [key: string]: string | Translations;
}

export interface I18nContextType {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
}
