// Firebase Database Service
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User, School, Course } from '@/types';
import type { Quiz } from '@/types/quiz';

export const firebaseService = {
  // Users
  async createUser(userId: string, userData: Omit<User, 'id'>): Promise<void> {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      createdAt: Timestamp.fromDate(userData.createdAt)
    });
  },

  async getUser(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as User;
    }
    return null;
  },

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await updateDoc(doc(db, 'users', userId), updates);
  },

  // Schools
  async createSchool(schoolData: Omit<School, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'schools'), {
      ...schoolData,
      createdAt: Timestamp.fromDate(schoolData.createdAt)
    });
    return docRef.id;
  },

  async getSchool(schoolId: string): Promise<School | null> {
    const schoolDoc = await getDoc(doc(db, 'schools', schoolId));
    if (schoolDoc.exists()) {
      const data = schoolDoc.data();
      return {
        id: schoolDoc.id,
        ...data,
        createdAt: data.createdAt.toDate()
      } as School;
    }
    return null;
  },

  async getSchools(): Promise<School[]> {
    const snapshot = await getDocs(collection(db, 'schools'));
    const schools = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as School[];
    
    // Sort by createdAt in memory
    return schools.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async updateSchool(schoolId: string, updates: Partial<School>): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId), updates);
  },

  // Courses
  async createCourse(courseData: Omit<Course, 'id'>): Promise<string> {
    try {
      console.log('Firebase: Creating course with data:', {
        title: courseData.title,
        teacherId: courseData.teacherId,
        schoolId: courseData.schoolId,
        lessonsCount: courseData.lessons?.length || 0,
        isPaid: courseData.isPaid
      });
      
      // Validate and prepare data for Firebase
      const preparedData: any = {
        ...courseData
      };
      
      // Convert Date objects to Timestamps
      if (courseData.createdAt instanceof Date) {
        preparedData.createdAt = Timestamp.fromDate(courseData.createdAt);
      } else {
        preparedData.createdAt = Timestamp.now();
      }
      
      if (courseData.updatedAt instanceof Date) {
        preparedData.updatedAt = Timestamp.fromDate(courseData.updatedAt);
      } else {
        preparedData.updatedAt = Timestamp.now();
      }
      
      // Log the exact data being sent
      console.log('Firebase: Prepared data for Firestore:', JSON.stringify(preparedData, null, 2));
      
      const docRef = await addDoc(collection(db, 'courses'), preparedData);
      
      console.log('Firebase: Course created successfully with ID:', docRef.id);
      return docRef.id;
    } catch (error: any) {
      console.error('Firebase: Error creating course:', {
        code: error.code,
        message: error.message,
        fullError: error
      });
      
      // Log the problematic data
      console.error('Firebase: Data that failed:', courseData);
      
      // Provide more specific error messages
      if (error.code === 'permission-denied') {
        throw new Error('Permission denied. Please make sure you are logged in.');
      } else if (error.code === 'unauthenticated') {
        throw new Error('You must be logged in to create a course.');
      } else if (error.code === 'invalid-argument') {
        // Try to identify which field is problematic
        const errorMsg = error.message || '';
        console.error('Firebase: Invalid argument error details:', errorMsg);
        throw new Error(`Invalid course data: ${errorMsg}. Check console for details.`);
      } else {
        throw new Error(`Failed to save course to database: ${error.message}`);
      }
    }
  },

  async getCourse(courseId: string): Promise<Course | null> {
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    if (courseDoc.exists()) {
      const data = courseDoc.data();
      return {
        id: courseDoc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      } as Course;
    }
    return null;
  },

  async getCoursesByTeacher(teacherId: string): Promise<Course[]> {
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('teacherId', '==', teacherId)
      );
      const snapshot = await getDocs(coursesQuery);
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Course[];
      
      // Sort by createdAt in memory (descending - newest first)
      return courses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      throw error;
    }
  },

  async getCoursesBySchool(schoolId: string): Promise<Course[]> {
    try {
      const coursesQuery = query(
        collection(db, 'courses'),
        where('schoolId', '==', schoolId)
      );
      const snapshot = await getDocs(coursesQuery);
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
        updatedAt: doc.data().updatedAt.toDate()
      })) as Course[];
      
      // Sort by createdAt in memory (descending - newest first)
      return courses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching school courses:', error);
      throw error;
    }
  },

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<void> {
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    await updateDoc(doc(db, 'courses', courseId), updateData);
  },

  async deleteCourse(courseId: string): Promise<void> {
    await deleteDoc(doc(db, 'courses', courseId));
  },

  // Quizzes
  async createQuiz(quizData: any): Promise<string> {
    const docRef = await addDoc(collection(db, 'quizzes'), {
      ...quizData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getQuiz(quizId: string): Promise<any> {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (quizDoc.exists()) {
      const data = quizDoc.data();
      return {
        id: quizDoc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate()
      };
    }
    return null;
  },

  async getQuizzesByTeacher(teacherId: string): Promise<any[]> {
    const quizzesQuery = query(
      collection(db, 'quizzes'),
      where('teacherId', '==', teacherId)
    );
    const snapshot = await getDocs(quizzesQuery);
    const quizzes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    }));
    
    // Sort by createdAt in memory
    return quizzes.sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async updateQuiz(quizId: string, updates: any): Promise<void> {
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    await updateDoc(doc(db, 'quizzes', quizId), updateData);
  },

  async deleteQuiz(quizId: string): Promise<void> {
    await deleteDoc(doc(db, 'quizzes', quizId));
  },

  // Enrollments
  async createEnrollment(enrollmentData: any): Promise<string> {
    const docRef = await addDoc(collection(db, 'enrollments'), {
      ...enrollmentData,
      enrolledAt: Timestamp.now(),
      lastAccessedAt: Timestamp.now()
    });
    return docRef.id;
  },

  async getEnrollmentsByStudent(studentId: string): Promise<any[]> {
    const enrollmentsQuery = query(
      collection(db, 'enrollments'),
      where('studentId', '==', studentId)
    );
    const snapshot = await getDocs(enrollmentsQuery);
    const enrollments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      enrolledAt: doc.data().enrolledAt.toDate(),
      lastAccessedAt: doc.data().lastAccessedAt?.toDate()
    }));
    
    // Sort by enrolledAt in memory
    return enrollments.sort((a: any, b: any) => b.enrolledAt.getTime() - a.enrolledAt.getTime());
  },

  // Generic CRUD operations
  async create(collectionName: string, data: any): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now()
    });
    return docRef.id;
  },

  async get(collectionName: string, docId: string): Promise<any> {
    const docRef = await getDoc(doc(db, collectionName, docId));
    if (docRef.exists()) {
      return {
        id: docRef.id,
        ...docRef.data()
      };
    }
    return null;
  },

  async update(collectionName: string, docId: string, updates: any): Promise<void> {
    await updateDoc(doc(db, collectionName, docId), {
      ...updates,
      updatedAt: Timestamp.now()
    });
  },

  async delete(collectionName: string, docId: string): Promise<void> {
    await deleteDoc(doc(db, collectionName, docId));
  }
};