import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  getDoc,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface StudentQuestion {
  id?: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  schoolId?: string;
  type: 'course' | 'quiz';
  itemId: string;
  itemTitle: string;
  question: string;
  status: 'pending' | 'answered';
  answer?: string;
  answeredBy?: string;
  answeredById?: string;
  createdAt: Timestamp;
  answeredAt?: Timestamp;
}

const COLLECTION_NAME = 'studentQuestions';

/**
 * Submit a new question from a student
 */
export const submitQuestion = async (
  questionData: Omit<StudentQuestion, 'id' | 'status' | 'createdAt'>
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...questionData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Error submitting question:', error);
    throw new Error(error.message || 'Failed to submit question');
  }
};

/**
 * Answer a student question
 */
export const answerQuestion = async (
  questionId: string,
  answer: string,
  answeredBy: string,
  answeredById: string
): Promise<void> => {
  try {
    const questionRef = doc(db, COLLECTION_NAME, questionId);
    await updateDoc(questionRef, {
      answer,
      answeredBy,
      answeredById,
      status: 'answered',
      answeredAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Error answering question:', error);
    throw new Error(error.message || 'Failed to answer question');
  }
};

/**
 * Get questions for a specific teacher
 */
export const getTeacherQuestions = async (teacherId: string): Promise<StudentQuestion[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('teacherId', '==', teacherId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudentQuestion));
  } catch (error: any) {
    console.error('Error fetching teacher questions:', error);
    throw new Error(error.message || 'Failed to fetch questions');
  }
};

/**
 * Get questions for a specific school (all teachers in the school)
 */
export const getSchoolQuestions = async (schoolId: string): Promise<StudentQuestion[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('schoolId', '==', schoolId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudentQuestion));
  } catch (error: any) {
    console.error('Error fetching school questions:', error);
    throw new Error(error.message || 'Failed to fetch questions');
  }
};

/**
 * Get questions for a specific student
 */
export const getStudentQuestions = async (studentId: string): Promise<StudentQuestion[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudentQuestion));
  } catch (error: any) {
    console.error('Error fetching student questions:', error);
    throw new Error(error.message || 'Failed to fetch questions');
  }
};

/**
 * Get questions for a specific course or quiz
 */
export const getItemQuestions = async (
  itemId: string,
  type: 'course' | 'quiz'
): Promise<StudentQuestion[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('itemId', '==', itemId),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StudentQuestion));
  } catch (error: any) {
    console.error('Error fetching item questions:', error);
    throw new Error(error.message || 'Failed to fetch questions');
  }
};

/**
 * Get a single question by ID
 */
export const getQuestionById = async (questionId: string): Promise<StudentQuestion | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, questionId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as StudentQuestion;
    }
    return null;
  } catch (error: any) {
    console.error('Error fetching question:', error);
    throw new Error(error.message || 'Failed to fetch question');
  }
};

/**
 * Get question statistics for a teacher
 */
export const getTeacherQuestionStats = async (teacherId: string) => {
  try {
    const questions = await getTeacherQuestions(teacherId);
    
    return {
      total: questions.length,
      pending: questions.filter(q => q.status === 'pending').length,
      answered: questions.filter(q => q.status === 'answered').length,
      courseQuestions: questions.filter(q => q.type === 'course').length,
      quizQuestions: questions.filter(q => q.type === 'quiz').length,
      responseRate: questions.length > 0 
        ? Math.round((questions.filter(q => q.status === 'answered').length / questions.length) * 100)
        : 0,
    };
  } catch (error: any) {
    console.error('Error fetching teacher question stats:', error);
    throw new Error(error.message || 'Failed to fetch question statistics');
  }
};

/**
 * Get question statistics for a school
 */
export const getSchoolQuestionStats = async (schoolId: string) => {
  try {
    const questions = await getSchoolQuestions(schoolId);
    
    return {
      total: questions.length,
      pending: questions.filter(q => q.status === 'pending').length,
      answered: questions.filter(q => q.status === 'answered').length,
      courseQuestions: questions.filter(q => q.type === 'course').length,
      quizQuestions: questions.filter(q => q.type === 'quiz').length,
      responseRate: questions.length > 0 
        ? Math.round((questions.filter(q => q.status === 'answered').length / questions.length) * 100)
        : 0,
    };
  } catch (error: any) {
    console.error('Error fetching school question stats:', error);
    throw new Error(error.message || 'Failed to fetch question statistics');
  }
};
