// Quiz Service with Firebase Integration
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
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { 
  Quiz, 
  Question, 
  ScheduledQuiz, 
  QuizAttempt, 
  QuizAnswer,
  GamificationProfile,
  LeaderboardEntry,
  QuizAnalytics,
  StudentAnalytics,
  ClassAnalytics,
  AIDraft
} from '@/types/quiz';

export const quizService = {
  // Quiz CRUD
  async getQuizzes(): Promise<Quiz[]> {
    try {
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('isPublished', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(quizzesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Quiz[];
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return [];
    }
  },

  async getAllQuizzes(): Promise<Quiz[]> {
    try {
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(quizzesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Quiz[];
    } catch (error) {
      console.error('Error fetching all quizzes:', error);
      return [];
    }
  },

  async getQuizById(id: string): Promise<Quiz | undefined> {
    try {
      const quizDoc = await getDoc(doc(db, 'quizzes', id));
      if (quizDoc.exists()) {
        return {
          id: quizDoc.id,
          ...quizDoc.data(),
          createdAt: quizDoc.data().createdAt?.toDate() || new Date(),
          updatedAt: quizDoc.data().updatedAt?.toDate() || new Date(),
        } as Quiz;
      }
      return undefined;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return undefined;
    }
  },

  async getQuizzesByTeacher(teacherId: string): Promise<Quiz[]> {
    try {
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('teacherId', '==', teacherId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(quizzesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Quiz[];
    } catch (error) {
      console.error('Error fetching teacher quizzes:', error);
      return [];
    }
  },

  async getQuizzesBySchool(schoolId: string): Promise<Quiz[]> {
    try {
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('schoolId', '==', schoolId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(quizzesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Quiz[];
    } catch (error) {
      console.error('Error fetching school quizzes:', error);
      return [];
    }
  },

  async getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    try {
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('courseId', '==', courseId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(quizzesQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Quiz[];
    } catch (error) {
      console.error('Error fetching course quizzes:', error);
      return [];
    }
  },

  async createQuiz(data: Partial<Quiz>): Promise<string> {
    try {
      // Clean questions data - remove undefined values
      const cleanQuestions = (data.questions || []).map(q => {
        const cleanQuestion: any = {
          id: q.id,
          quizId: q.quizId || '',
          type: q.type,
          question: q.question,
          points: q.points,
          timeLimit: q.timeLimit,
          order: q.order,
        };

        // Only add options if they exist and are not undefined
        if (q.options && q.options.length > 0) {
          cleanQuestion.options = q.options.filter(opt => opt !== undefined);
        }

        // Only add correctAnswer if it exists
        if (q.correctAnswer !== undefined) {
          cleanQuestion.correctAnswer = q.correctAnswer;
        }

        return cleanQuestion;
      });

      const quizData = {
        title: data.title || '',
        description: data.description || '',
        courseId: data.courseId || null,
        classId: data.classId || null,
        schoolId: data.schoolId || null,
        teacherId: data.teacherId || '',
        teacherName: data.teacherName || '',
        language: data.language || 'en',
        questions: cleanQuestions,
        totalPoints: cleanQuestions.reduce((sum, q) => sum + q.points, 0) || 0,
        timeLimit: data.timeLimit || null,
        difficulty: data.difficulty || 'medium',
        isPublished: data.isPublished ?? false,
        isMultiplayer: data.isMultiplayer ?? false,
        shuffleQuestions: data.shuffleQuestions ?? false,
        shuffleOptions: data.shuffleOptions ?? true,
        showResults: data.showResults ?? true,
        passingScore: data.passingScore || 60,
        quizType: data.quizType || 'practice',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      console.log('📦 Cleaned quiz data before saving:', quizData);

      const docRef = await addDoc(collection(db, 'quizzes'), quizData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  async updateQuiz(id: string, data: Partial<Quiz>): Promise<void> {
    try {
      const updateData = {
        ...data,
        updatedAt: Timestamp.now(),
      };
      // Remove undefined fields
      Object.keys(updateData).forEach(key => 
        updateData[key] === undefined && delete updateData[key]
      );
      
      await updateDoc(doc(db, 'quizzes', id), updateData);
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  async deleteQuiz(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'quizzes', id));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  },

  async addQuestion(quizId: string, question: Partial<Question>): Promise<Question> {
    try {
      const quiz = await this.getQuizById(quizId);
      if (!quiz) throw new Error('Quiz not found');

      const newQuestion: Question = {
        id: `q-${Date.now()}`,
        quizId,
        type: question.type || 'mcq',
        question: question.question || '',
        options: question.options,
        correctAnswer: question.correctAnswer,
        points: question.points || 10,
        timeLimit: question.timeLimit || 30,
        order: quiz.questions.length + 1,
      };

      const updatedQuestions = [...quiz.questions, newQuestion];
      const totalPoints = updatedQuestions.reduce((sum, q) => sum + q.points, 0);

      await this.updateQuiz(quizId, {
        questions: updatedQuestions,
        totalPoints,
      });

      return newQuestion;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  },

  // Attempts & Results
  async startAttempt(quizId: string, studentId: string, studentName: string): Promise<QuizAttempt> {
    try {
      const quiz = await this.getQuizById(quizId);
      const attempt: Omit<QuizAttempt, 'id'> = {
        quizId,
        studentId,
        studentName,
        answers: [],
        score: 0,
        totalPoints: quiz?.totalPoints || 0,
        percentage: 0,
        timeTaken: 0,
        startedAt: new Date(),
        isCompleted: false,
        status: 'in_progress',
      };

      const docRef = await addDoc(collection(db, 'quizAttempts'), {
        ...attempt,
        startedAt: Timestamp.fromDate(attempt.startedAt),
      });

      return {
        id: docRef.id,
        ...attempt,
      };
    } catch (error) {
      console.error('Error starting attempt:', error);
      throw error;
    }
  },

  async submitAnswer(attemptId: string, answer: QuizAnswer): Promise<QuizAttempt> {
    try {
      const attemptDoc = await getDoc(doc(db, 'quizAttempts', attemptId));
      if (!attemptDoc.exists()) throw new Error('Attempt not found');

      const attempt = attemptDoc.data() as QuizAttempt;
      
      // Clean answer data - remove undefined fields
      const cleanAnswer: any = {
        questionId: answer.questionId,
        isCorrect: answer.isCorrect,
        pointsEarned: answer.pointsEarned,
        timeTaken: answer.timeTaken,
      };
      
      // Only add optional fields if they exist
      if (answer.selectedOptionId !== undefined) {
        cleanAnswer.selectedOptionId = answer.selectedOptionId;
      }
      if (answer.textAnswer !== undefined) {
        cleanAnswer.textAnswer = answer.textAnswer;
      }
      
      const updatedAnswers = [...attempt.answers, cleanAnswer];
      const score = updatedAnswers.reduce((sum, a) => sum + (a.isCorrect ? a.pointsEarned : 0), 0);

      await updateDoc(doc(db, 'quizAttempts', attemptId), {
        answers: updatedAnswers,
        score,
      });

      return {
        ...attempt,
        id: attemptId,
        answers: updatedAnswers,
        score,
      };
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  },

  async completeAttempt(attemptId: string, timeTaken: number): Promise<QuizAttempt> {
    try {
      const attemptDoc = await getDoc(doc(db, 'quizAttempts', attemptId));
      if (!attemptDoc.exists()) throw new Error('Attempt not found');

      const attempt = attemptDoc.data() as QuizAttempt;
      const percentage = attempt.totalPoints > 0 
        ? Math.round((attempt.score / attempt.totalPoints) * 100) 
        : 0;

      await updateDoc(doc(db, 'quizAttempts', attemptId), {
        isCompleted: true,
        completedAt: Timestamp.now(),
        timeTaken,
        percentage,
        status: 'completed',
      });

      return {
        ...attempt,
        id: attemptId,
        isCompleted: true,
        completedAt: new Date(),
        timeTaken,
        percentage,
        status: 'completed',
      };
    } catch (error) {
      console.error('Error completing attempt:', error);
      throw error;
    }
  },

  async getAttemptsByStudent(studentId: string): Promise<QuizAttempt[]> {
    try {
      const attemptsQuery = query(
        collection(db, 'quizAttempts'),
        where('studentId', '==', studentId),
        orderBy('startedAt', 'desc')
      );
      const snapshot = await getDocs(attemptsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startedAt: doc.data().startedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as QuizAttempt[];
    } catch (error) {
      console.error('Error fetching student attempts:', error);
      return [];
    }
  },

  async getAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
    try {
      const attemptsQuery = query(
        collection(db, 'quizAttempts'),
        where('quizId', '==', quizId),
        orderBy('startedAt', 'desc')
      );
      const snapshot = await getDocs(attemptsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startedAt: doc.data().startedAt?.toDate() || new Date(),
        completedAt: doc.data().completedAt?.toDate(),
      })) as QuizAttempt[];
    } catch (error) {
      console.error('Error fetching quiz attempts:', error);
      return [];
    }
  },

  // Saved Quizzes
  async saveQuizForLater(userId: string, quizId: string): Promise<void> {
    try {
      const savedQuizRef = doc(db, 'savedQuizzes', `${userId}_${quizId}`);
      await setDoc(savedQuizRef, {
        userId,
        quizId,
        savedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error saving quiz:', error);
      throw error;
    }
  },

  async unsaveQuiz(userId: string, quizId: string): Promise<void> {
    try {
      const savedQuizRef = doc(db, 'savedQuizzes', `${userId}_${quizId}`);
      await deleteDoc(savedQuizRef);
    } catch (error) {
      console.error('Error unsaving quiz:', error);
      throw error;
    }
  },

  async getSavedQuizzes(userId: string): Promise<string[]> {
    try {
      const savedQuery = query(
        collection(db, 'savedQuizzes'),
        where('userId', '==', userId),
        orderBy('savedAt', 'desc')
      );
      const snapshot = await getDocs(savedQuery);
      return snapshot.docs.map(doc => doc.data().quizId);
    } catch (error) {
      console.error('Error fetching saved quizzes:', error);
      return [];
    }
  },

  async isQuizSaved(userId: string, quizId: string): Promise<boolean> {
    try {
      const savedQuizRef = doc(db, 'savedQuizzes', `${userId}_${quizId}`);
      const savedDoc = await getDoc(savedQuizRef);
      return savedDoc.exists();
    } catch (error) {
      console.error('Error checking if quiz is saved:', error);
      return false;
    }
  },

  // Delete quiz attempt
  async deleteAttempt(attemptId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'quizAttempts', attemptId));
    } catch (error) {
      console.error('Error deleting attempt:', error);
      throw error;
    }
  },

  // Multiplayer Quiz Registration
  async registerForQuiz(quizId: string, studentId: string): Promise<void> {
    try {
      const quiz = await this.getQuizById(quizId);
      if (!quiz) throw new Error('Quiz not found');

      // Check if registration is still open (before deadline)
      if (quiz.registrationDeadline && new Date() > new Date(quiz.registrationDeadline)) {
        throw new Error('Registration deadline has passed');
      }

      // Check if quiz has already started (block registration after start time)
      if (quiz.scheduledStartTime && new Date() >= new Date(quiz.scheduledStartTime)) {
        throw new Error('Registration is closed because the quiz has already started');
      }

      // Check if already registered
      const registeredStudents = quiz.registeredStudents || [];
      if (registeredStudents.includes(studentId)) {
        throw new Error('Already registered for this quiz');
      }

      // Check if max participants reached
      if (quiz.maxParticipants && registeredStudents.length >= quiz.maxParticipants) {
        throw new Error('Maximum participants reached');
      }

      // Add student to registered list
      await updateDoc(doc(db, 'quizzes', quizId), {
        registeredStudents: [...registeredStudents, studentId],
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error registering for quiz:', error);
      throw error;
    }
  },

  async unregisterFromQuiz(quizId: string, studentId: string): Promise<void> {
    try {
      const quiz = await this.getQuizById(quizId);
      if (!quiz) throw new Error('Quiz not found');

      const registeredStudents = quiz.registeredStudents || [];
      const updatedStudents = registeredStudents.filter(id => id !== studentId);

      await updateDoc(doc(db, 'quizzes', quizId), {
        registeredStudents: updatedStudents,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error unregistering from quiz:', error);
      throw error;
    }
  },

  async isRegisteredForQuiz(quizId: string, studentId: string): Promise<boolean> {
    try {
      const quiz = await this.getQuizById(quizId);
      if (!quiz) return false;
      
      const registeredStudents = quiz.registeredStudents || [];
      return registeredStudents.includes(studentId);
    } catch (error) {
      console.error('Error checking registration:', error);
      return false;
    }
  },

  async getRegisteredStudentsCount(quizId: string): Promise<number> {
    try {
      const quiz = await this.getQuizById(quizId);
      if (!quiz) return 0;
      
      return (quiz.registeredStudents || []).length;
    } catch (error) {
      console.error('Error getting registered students count:', error);
      return 0;
    }
  },

  // Auto-convert expired multiplayer quizzes to self-practice
  async convertExpiredMultiplayerQuizzes(): Promise<void> {
    try {
      const now = new Date();
      const quizzesQuery = query(
        collection(db, 'quizzes'),
        where('isMultiplayer', '==', true),
        where('isPublished', '==', true)
      );
      
      const snapshot = await getDocs(quizzesQuery);
      const updates: Promise<void>[] = [];

      snapshot.docs.forEach(docSnapshot => {
        const quiz = docSnapshot.data() as Quiz;
        const endTime = quiz.scheduledEndTime ? new Date(quiz.scheduledEndTime) : null;
        
        // If end time has passed, convert to self-practice
        if (endTime && now > endTime) {
          updates.push(
            updateDoc(doc(db, 'quizzes', docSnapshot.id), {
              isMultiplayer: false,
              quizType: 'practice',
              updatedAt: Timestamp.now(),
            })
          );
        }
      });

      await Promise.all(updates);
      console.log(`✅ Converted ${updates.length} expired multiplayer quizzes to self-practice`);
    } catch (error) {
      console.error('Error converting expired quizzes:', error);
    }
  },

  // Placeholder methods for features to be implemented
  async getScheduledQuizzes(classId?: string): Promise<ScheduledQuiz[]> {
    // TODO: Implement with Firebase
    return [];
  },

  async scheduleQuiz(data: Partial<ScheduledQuiz>): Promise<ScheduledQuiz> {
    // TODO: Implement with Firebase
    throw new Error('Not implemented');
  },

  async getQuizAnalytics(quizId: string): Promise<QuizAnalytics> {
    // TODO: Implement with Firebase
    throw new Error('Not implemented');
  },

  async getStudentAnalytics(studentId: string): Promise<StudentAnalytics> {
    // TODO: Implement with Firebase
    throw new Error('Not implemented');
  },

  async getClassAnalytics(classId: string): Promise<ClassAnalytics> {
    // TODO: Implement with Firebase
    throw new Error('Not implemented');
  },

  async getGamificationProfile(userId: string): Promise<GamificationProfile> {
    // TODO: Implement with Firebase
    throw new Error('Not implemented');
  },

  async getLeaderboard(type: 'global' | 'school' | 'course', id?: string): Promise<LeaderboardEntry[]> {
    // TODO: Implement with Firebase
    return [];
  },

  async awardPoints(userId: string, points: number, reason: string): Promise<GamificationProfile> {
    // TODO: Implement with Firebase
    throw new Error('Not implemented');
  },

  async generateQuizDraft(sourceContent: string, userId: string): Promise<AIDraft> {
    // TODO: Implement with AI service
    throw new Error('Not implemented');
  },

  async generateLessonSummary(lessonContent: string, userId: string): Promise<AIDraft> {
    // TODO: Implement with AI service
    throw new Error('Not implemented');
  },

  async approveDraft(draftId: string, userId: string, notes?: string): Promise<AIDraft> {
    // TODO: Implement with Firebase
    throw new Error('Not implemented');
  },

  async rejectDraft(draftId: string, userId: string, notes?: string): Promise<AIDraft> {
    // TODO: Implement with Firebase
    throw new Error('Not implemented');
  },
};

function generateJoinCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
