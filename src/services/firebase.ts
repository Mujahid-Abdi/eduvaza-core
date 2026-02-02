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
import type { User, School, Course, Quiz } from '@/types';

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
    const schoolsQuery = query(
      collection(db, 'schools'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(schoolsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as School[];
  },

  async updateSchool(schoolId: string, updates: Partial<School>): Promise<void> {
    await updateDoc(doc(db, 'schools', schoolId), updates);
  },

  // Courses
  async createCourse(courseData: Omit<Course, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: Timestamp.fromDate(courseData.createdAt),
      updatedAt: Timestamp.fromDate(courseData.updatedAt)
    });
    return docRef.id;
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
    const coursesQuery = query(
      collection(db, 'courses'),
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(coursesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    })) as Course[];
  },

  async getCoursesBySchool(schoolId: string): Promise<Course[]> {
    const coursesQuery = query(
      collection(db, 'courses'),
      where('schoolId', '==', schoolId),
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
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(quizzesQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate()
    }));
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
      where('studentId', '==', studentId),
      orderBy('enrolledAt', 'desc')
    );
    const snapshot = await getDocs(enrollmentsQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      enrolledAt: doc.data().enrolledAt.toDate(),
      lastAccessedAt: doc.data().lastAccessedAt.toDate()
    }));
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