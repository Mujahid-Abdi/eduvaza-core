// Mock Courses Service
import type { Course, Lesson, Enrollment, CourseCategory } from '@/types';
import { mockCourses, mockCategories, mockEnrollments } from './mockData';

let courses = [...mockCourses];
let enrollments = [...mockEnrollments];

export const coursesService = {
  async getCourses(): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return courses.filter(c => c.isPublished);
  },

  async getAllCourses(): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return courses;
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return courses.find(c => c.id === id);
  },

  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return courses.filter(c => c.teacherId === teacherId);
  },

  async getCoursesBySchool(schoolId: string): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return courses.filter(c => c.schoolId === schoolId);
  },

  async getCoursesByCategory(category: string): Promise<Course[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return courses.filter(c => c.category === category && c.isPublished);
  },

  async getCategories(): Promise<CourseCategory[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockCategories;
  },

  async createCourse(data: Partial<Course>): Promise<Course> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: data.title || '',
      description: data.description || '',
      thumbnail: data.thumbnail,
      teacherId: data.teacherId || '',
      teacherName: data.teacherName || '',
      schoolId: data.schoolId,
      language: data.language || 'en',
      category: data.category || '',
      curriculum: data.curriculum,
      level: data.level || 'beginner',
      lessons: [],
      enrolledCount: 0,
      isPublished: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    courses.push(newCourse);
    return newCourse;
  },

  async addLesson(courseId: string, lesson: Partial<Lesson>): Promise<Lesson> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const course = courses.find(c => c.id === courseId);
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      courseId,
      title: lesson.title || '',
      content: lesson.content || '',
      contentType: lesson.contentType || 'text',
      pdfUrl: lesson.pdfUrl,
      order: course?.lessons.length ? course.lessons.length + 1 : 1,
      duration: lesson.duration,
    };
    if (course) {
      course.lessons.push(newLesson);
      course.updatedAt = new Date();
    }
    return newLesson;
  },

  async enrollStudent(studentId: string, courseId: string): Promise<Enrollment> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const enrollment: Enrollment = {
      id: `enr-${Date.now()}`,
      studentId,
      courseId,
      progress: 0,
      completedLessons: [],
      lastAccessedAt: new Date(),
      enrolledAt: new Date(),
    };
    enrollments.push(enrollment);
    
    const course = courses.find(c => c.id === courseId);
    if (course) {
      course.enrolledCount += 1;
    }
    
    return enrollment;
  },

  async getEnrollments(studentId: string): Promise<Enrollment[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return enrollments.filter(e => e.studentId === studentId);
  },

  async updateProgress(enrollmentId: string, lessonId: string): Promise<Enrollment> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (enrollment) {
      if (!enrollment.completedLessons.includes(lessonId)) {
        enrollment.completedLessons.push(lessonId);
      }
      enrollment.lastAccessedAt = new Date();
      
      const course = courses.find(c => c.id === enrollment.courseId);
      if (course) {
        enrollment.progress = Math.round((enrollment.completedLessons.length / course.lessons.length) * 100);
      }
    }
    return enrollment!;
  },
};
