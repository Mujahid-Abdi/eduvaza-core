// Quiz Service
import type { 
  Quiz, 
  Question, 
  ScheduledQuiz, 
  QuizAttempt, 
  QuizAnswer,
  MultiplayerSession,
  GamificationProfile,
  LeaderboardEntry,
  QuizAnalytics,
  StudentAnalytics,
  ClassAnalytics,
  AIDraft
} from '@/types/quiz';
import { 
  mockQuizzes, 
  mockScheduledQuizzes, 
  mockQuizAttempts,
  mockGamificationProfile,
  mockLeaderboard,
  mockQuizAnalytics,
  mockStudentAnalytics,
  mockClassAnalytics,
  mockMultiplayerSession,
  mockAIDrafts,
} from './mockQuizData';

let quizzes = [...mockQuizzes];
let scheduledQuizzes = [...mockScheduledQuizzes];
let attempts = [...mockQuizAttempts];
let sessions: MultiplayerSession[] = [mockMultiplayerSession];

export const quizService = {
  // Quiz CRUD
  async getQuizzes(): Promise<Quiz[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return quizzes.filter(q => q.isPublished);
  },

  async getAllQuizzes(): Promise<Quiz[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return quizzes;
  },

  async getQuizById(id: string): Promise<Quiz | undefined> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return quizzes.find(q => q.id === id);
  },

  async getQuizzesByTeacher(teacherId: string): Promise<Quiz[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return quizzes.filter(q => q.teacherId === teacherId);
  },

  async getQuizzesByCourse(courseId: string): Promise<Quiz[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return quizzes.filter(q => q.courseId === courseId);
  },

  async createQuiz(data: Partial<Quiz>): Promise<Quiz> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newQuiz: Quiz = {
      id: `quiz-${Date.now()}`,
      title: data.title || '',
      description: data.description || '',
      courseId: data.courseId,
      classId: data.classId,
      schoolId: data.schoolId,
      teacherId: data.teacherId || '',
      teacherName: data.teacherName || '',
      language: data.language || 'en',
      questions: data.questions || [],
      totalPoints: data.questions?.reduce((sum, q) => sum + q.points, 0) || 0,
      timeLimit: data.timeLimit,
      isPublished: false,
      isMultiplayer: data.isMultiplayer || false,
      shuffleQuestions: data.shuffleQuestions || false,
      shuffleOptions: data.shuffleOptions || true,
      showResults: data.showResults ?? true,
      passingScore: data.passingScore || 60,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    quizzes.push(newQuiz);
    return newQuiz;
  },

  async updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = quizzes.findIndex(q => q.id === id);
    if (index !== -1) {
      quizzes[index] = { ...quizzes[index], ...data, updatedAt: new Date() };
      return quizzes[index];
    }
    throw new Error('Quiz not found');
  },

  async addQuestion(quizId: string, question: Partial<Question>): Promise<Question> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const quiz = quizzes.find(q => q.id === quizId);
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      quizId,
      type: question.type || 'mcq',
      question: question.question || '',
      options: question.options,
      correctAnswer: question.correctAnswer,
      points: question.points || 10,
      timeLimit: question.timeLimit || 30,
      order: quiz?.questions.length ? quiz.questions.length + 1 : 1,
    };
    if (quiz) {
      quiz.questions.push(newQuestion);
      quiz.totalPoints += newQuestion.points;
    }
    return newQuestion;
  },

  // Scheduling
  async getScheduledQuizzes(classId?: string): Promise<ScheduledQuiz[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    let result = scheduledQuizzes;
    if (classId) {
      result = result.filter(s => s.classId === classId);
    }
    return result.map(sq => ({
      ...sq,
      quiz: quizzes.find(q => q.id === sq.quizId),
    }));
  },

  async scheduleQuiz(data: Partial<ScheduledQuiz>): Promise<ScheduledQuiz> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const scheduled: ScheduledQuiz = {
      id: `sched-${Date.now()}`,
      quizId: data.quizId || '',
      classId: data.classId,
      courseId: data.courseId,
      startTime: data.startTime || new Date(),
      endTime: data.endTime || new Date(),
      duration: data.duration || 15,
      isLive: data.isLive || false,
      joinCode: data.isLive ? generateJoinCode() : undefined,
      status: 'scheduled',
      maxParticipants: data.maxParticipants,
      createdAt: new Date(),
    };
    scheduledQuizzes.push(scheduled);
    return scheduled;
  },

  // Attempts & Results
  async startAttempt(quizId: string, studentId: string, studentName: string): Promise<QuizAttempt> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId,
      studentId,
      studentName,
      answers: [],
      score: 0,
      totalPoints: 0,
      percentage: 0,
      timeTaken: 0,
      startedAt: new Date(),
      isCompleted: false,
    };
    attempts.push(attempt);
    return attempt;
  },

  async submitAnswer(attemptId: string, answer: QuizAnswer): Promise<QuizAttempt> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const attempt = attempts.find(a => a.id === attemptId);
    if (attempt) {
      attempt.answers.push(answer);
      if (answer.isCorrect) {
        attempt.score += answer.pointsEarned;
      }
    }
    return attempt!;
  },

  async completeAttempt(attemptId: string, timeTaken: number): Promise<QuizAttempt> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const attempt = attempts.find(a => a.id === attemptId);
    if (attempt) {
      const quiz = quizzes.find(q => q.id === attempt.quizId);
      attempt.isCompleted = true;
      attempt.completedAt = new Date();
      attempt.timeTaken = timeTaken;
      attempt.totalPoints = quiz?.totalPoints || 0;
      attempt.percentage = attempt.totalPoints > 0 
        ? Math.round((attempt.score / attempt.totalPoints) * 100) 
        : 0;
    }
    return attempt!;
  },

  async getAttemptsByStudent(studentId: string): Promise<QuizAttempt[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return attempts.filter(a => a.studentId === studentId);
  },

  async getAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return attempts.filter(a => a.quizId === quizId);
  },

  // Multiplayer
  async createSession(scheduledQuizId: string, hostId: string): Promise<MultiplayerSession> {
    await new Promise(resolve => setTimeout(resolve, 400));
    const scheduled = scheduledQuizzes.find(s => s.id === scheduledQuizId);
    const quiz = quizzes.find(q => q.id === scheduled?.quizId);
    
    const session: MultiplayerSession = {
      id: `session-${Date.now()}`,
      scheduledQuizId,
      quiz: quiz!,
      joinCode: scheduled?.joinCode || generateJoinCode(),
      hostId,
      status: 'waiting',
      currentQuestionIndex: 0,
      participants: [],
      createdAt: new Date(),
    };
    sessions.push(session);
    return session;
  },

  async joinSession(joinCode: string, studentId: string, studentName: string): Promise<MultiplayerSession | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const session = sessions.find(s => s.joinCode === joinCode && s.status === 'waiting');
    if (session) {
      session.participants.push({
        id: `p-${Date.now()}`,
        sessionId: session.id,
        studentId,
        studentName,
        score: 0,
        correctAnswers: 0,
        currentStreak: 0,
        hasAnswered: false,
        rank: session.participants.length + 1,
        joinedAt: new Date(),
      });
      return session;
    }
    return null;
  },

  async getSessionByCode(code: string): Promise<MultiplayerSession | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return sessions.find(s => s.joinCode === code) || null;
  },

  // Analytics
  async getQuizAnalytics(quizId: string): Promise<QuizAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { ...mockQuizAnalytics, quizId };
  },

  async getStudentAnalytics(studentId: string): Promise<StudentAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { ...mockStudentAnalytics, studentId };
  },

  async getClassAnalytics(classId: string): Promise<ClassAnalytics> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { ...mockClassAnalytics, classId };
  },

  // Gamification
  async getGamificationProfile(userId: string): Promise<GamificationProfile> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...mockGamificationProfile, userId };
  },

  async getLeaderboard(type: 'global' | 'school' | 'course', id?: string): Promise<LeaderboardEntry[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (type === 'school' && id) {
      return mockLeaderboard.filter(e => e.schoolId === id);
    }
    return mockLeaderboard;
  },

  async awardPoints(userId: string, points: number, reason: string): Promise<GamificationProfile> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const profile = { ...mockGamificationProfile };
    profile.totalPoints += points;
    profile.xp += points;
    // Check level up logic would go here
    return profile;
  },

  // AI Drafts
  async generateQuizDraft(sourceContent: string, userId: string): Promise<AIDraft> {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI generation time
    const draft: AIDraft = {
      id: `draft-${Date.now()}`,
      type: 'quiz',
      status: 'ready',
      sourceContent,
      generatedContent: mockQuizzes[0], // Simulated generated quiz
      createdBy: userId,
      createdAt: new Date(),
    };
    return draft;
  },

  async generateLessonSummary(lessonContent: string, userId: string): Promise<AIDraft> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const draft: AIDraft = {
      id: `draft-${Date.now()}`,
      type: 'lesson_summary',
      status: 'ready',
      sourceContent: lessonContent,
      generatedContent: 'This is an AI-generated summary of the lesson content. It highlights key concepts and provides a concise overview for students to review.',
      createdBy: userId,
      createdAt: new Date(),
    };
    return draft;
  },

  async approveDraft(draftId: string, userId: string, notes?: string): Promise<AIDraft> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const draft = mockAIDrafts.find(d => d.id === draftId);
    if (draft) {
      draft.status = 'approved';
      draft.reviewedAt = new Date();
      draft.reviewedBy = userId;
      draft.reviewNotes = notes;
    }
    return draft!;
  },

  async rejectDraft(draftId: string, userId: string, notes?: string): Promise<AIDraft> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const draft = mockAIDrafts.find(d => d.id === draftId);
    if (draft) {
      draft.status = 'rejected';
      draft.reviewedAt = new Date();
      draft.reviewedBy = userId;
      draft.reviewNotes = notes;
    }
    return draft!;
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
