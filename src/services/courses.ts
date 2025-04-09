// Courses Service with Firebase Integration
import type { Course, Lesson, Enrollment, CourseCategory } from '@/types';
import { mockCategories } from './mockData';
import { firebaseService } from './firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const coursesService = {
  async getCourses(): Promise<Course[]> {
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(coursesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Course[];
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  },

  async getAllCourses(): Promise<Course[]> {
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(coursesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Course[];
    } catch (error) {
      console.error('Error fetching all courses:', error);
      return [];
    }
  },

  async getCourseById(id: string): Promise<Course | undefined> {
    try {
      const course = await firebaseService.getCourse(id);
      return course || undefined;
    } catch (error) {
      console.error('Error fetching course:', error);
      return undefined;
    }
  },

  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    try {
      return await firebaseService.getCoursesByTeacher(teacherId);
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      return [];
    }
  },

  async getCoursesBySchool(schoolId: string): Promise<Course[]> {
    try {
      return await firebaseService.getCoursesBySchool(schoolId);
    } catch (error) {
      console.error('Error fetching school courses:', error);
      return [];
    }
  },

  async getCoursesByCategory(category: string): Promise<Course[]> {
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('category', '==', category),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(coursesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Course[];
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      return [];
    }
  },

  async getCategories(): Promise<CourseCategory[]> {
    // Categories are static for now
    return mockCategories;
  },

  async createCourse(data: Omit<Course, 'id'>): Promise<Course> {
    try {
      console.log('CoursesService: Creating course...', {
        title: data.title,
        category: data.category,
        teacherId: data.teacherId,
        schoolId: data.schoolId
      });
      
      const courseId = await firebaseService.createCourse(data);
      console.log('CoursesService: Course created with ID:', courseId);
      
      const course = await firebaseService.getCourse(courseId);
      if (!course) {
        throw new Error('Course was created but could not be retrieved');
      }
      
      console.log('CoursesService: Course retrieved successfully');
      return course as Course;
    } catch (error: any) {
      console.error('CoursesService: Error creating course:', error);
      // Re-throw with original error message
      throw error;
    }
  },

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<void> {
    try {
      await firebaseService.updateCourse(courseId, updates);
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  },

  async deleteCourse(courseId: string): Promise<void> {
    try {
      await firebaseService.deleteCourse(courseId);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  async addLesson(courseId: string, lesson: Partial<Lesson>): Promise<Lesson> {
    try {
      const course = await firebaseService.getCourse(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const newLesson: Lesson = {
        id: `lesson-${Date.now()}`,
        courseId,
        title: lesson.title || '',
        content: lesson.content || '',
        contentType: lesson.contentType || 'text',
        videoUrl: lesson.videoUrl,
        pdfUrl: lesson.pdfUrl,
        order: course.lessons.length + 1,
        duration: lesson.duration,
      };

      const updatedLessons = [...course.lessons, newLesson];
      await firebaseService.updateCourse(courseId, { lessons: updatedLessons });

      return newLesson;
    } catch (error) {
      console.error('Error adding lesson:', error);
      throw error;
    }
  },

  async enrollStudent(studentId: string, courseId: string): Promise<Enrollment> {
    try {
      const enrollmentData = {
        studentId,
        courseId,
        progress: 0,
        completedLessons: [],
      };
      
      const enrollmentId = await firebaseService.createEnrollment(enrollmentData);
      
      // Update course enrolled count
      const course = await firebaseService.getCourse(courseId);
      if (course) {
        await firebaseService.updateCourse(courseId, {
          enrolledCount: course.enrolledCount + 1
        });
      }

      return {
        id: enrollmentId,
        ...enrollmentData,
        lastAccessedAt: new Date(),
        enrolledAt: new Date(),
      };
    } catch (error) {
      console.error('Error enrolling student:', error);
      throw error;
    }
  },

  async getEnrollments(studentId: string): Promise<Enrollment[]> {
    try {
      return await firebaseService.getEnrollmentsByStudent(studentId);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      return [];
    }
  },

  async updateProgress(enrollmentId: string, lessonId: string): Promise<Enrollment> {
    try {
      const enrollment = await firebaseService.get('enrollments', enrollmentId);
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const completedLessons = enrollment.completedLessons || [];
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      }

      const course = await firebaseService.getCourse(enrollment.courseId);
      const progress = course 
        ? Math.round((completedLessons.length / course.lessons.length) * 100)
        : 0;

      await firebaseService.update('enrollments', enrollmentId, {
        completedLessons,
        progress,
        lastAccessedAt: new Date(),
      });

      return {
        ...enrollment,
        completedLessons,
        progress,
        lastAccessedAt: new Date(),
      };
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  // Downloads tracking
  async trackDownload(userId: string, lessonId: string, courseId: string, lessonTitle: string, contentType: 'video' | 'document', fileUrl: string, fileSize: string): Promise<string> {
    try {
      const downloadData = {
        userId,
        lessonId,
        courseId,
        lessonTitle,
        contentType,
        fileUrl,
        fileSize,
        downloadedAt: new Date(),
      };
      
      const downloadId = await firebaseService.create('downloads', downloadData);
      return downloadId;
    } catch (error) {
      console.error('Error tracking download:', error);
      throw error;
    }
  },

  async getDownloads(userId: string): Promise<any[]> {
    try {
      const downloadsQuery = query(
        collection(db, 'downloads'),
        where('userId', '==', userId),
        orderBy('downloadedAt', 'desc')
      );
      const snapshot = await getDocs(downloadsQuery);
      
      // Fetch course details for each download
      const downloads = await Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const course = await this.getCourseById(data.courseId);
          
          return {
            id: doc.id,
            ...data,
            courseName: course?.title || 'Unknown Course',
            downloadedAt: data.downloadedAt.toDate(),
          };
        })
      );
      
      return downloads;
    } catch (error) {
      console.error('Error fetching downloads:', error);
      return [];
    }
  },

  async deleteDownload(downloadId: string): Promise<void> {
    try {
      await firebaseService.delete('downloads', downloadId);
    } catch (error) {
      console.error('Error deleting download:', error);
      throw error;
    }
  },
};
