// Quiz & Gamification Type Definitions

import type { Language } from './index';

// Question Types
export type QuestionType = 'mcq' | 'true_false' | 'short_answer';

// Quiz Types
export type QuizType = 'scheduled' | 'practice';
// 'scheduled' - Time-based multiplayer quiz with start/end times
// 'practice' - Anytime practice quiz for self-assessment

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  quizId: string;
  type: QuestionType;
  question: string;
  options?: QuestionOption[]; // For MCQ and True/False
  correctAnswer?: string; // For short answer
  points: number;
  timeLimit?: number; // seconds per question
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  quizType: QuizType; // Type of quiz: scheduled or practice
  courseId?: string;
  classId?: string;
  schoolId?: string;
  teacherId: string;
  teacherName: string;
  language: Language;
  questions: Question[];
  totalPoints: number;
  timeLimit?: number; // Total time in minutes
  isPublished: boolean;
  isMultiplayer?: boolean; // Whether it's a multiplayer quiz (only for scheduled type)
  difficulty?: 'easy' | 'medium' | 'hard'; // Quiz difficulty level
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showResults: boolean;
  passingScore: number; // Percentage
  createdAt: Date;
  updatedAt: Date;
  postedAt?: Date; // When the quiz was made available (for practice quizzes)
}

// Quiz Scheduling
export interface ScheduledQuiz {
  id: string;
  quizId: string;
  quiz?: Quiz;
  classId?: string;
  courseId?: string;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  isLive: boolean; // Is it a multiplayer session
  joinCode?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  maxParticipants?: number;
  createdAt: Date;
}

// Quiz Attempts & Results
export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  scheduledQuizId?: string;
  answers: QuizAnswer[];
  score: number;
  totalPoints: number;
  percentage: number;
  timeTaken: number; // seconds
  startedAt: Date;
  completedAt?: Date;
  isCompleted?: boolean; // Legacy compatibility
  status?: 'in_progress' | 'completed' | 'abandoned';
  rank?: number; // Student's rank in this quiz
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId?: string;
  textAnswer?: string;
  isCorrect: boolean;
  pointsEarned: number;
  timeTaken: number; // seconds
}

// Multiplayer Session
export interface MultiplayerSession {
  id: string;
  scheduledQuizId: string;
  quiz: Quiz;
  joinCode: string;
  hostId: string;
  status: 'waiting' | 'in_progress' | 'question' | 'results' | 'leaderboard' | 'completed';
  currentQuestionIndex: number;
  participants: SessionParticipant[];
  questionStartTime?: Date;
  createdAt: Date;
}

export interface SessionParticipant {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  avatar?: string;
  score: number;
  correctAnswers: number;
  currentStreak: number;
  hasAnswered: boolean;
  lastAnswerCorrect?: boolean;
  rank: number;
  joinedAt: Date;
}

// Gamification
export interface GamificationProfile {
  id: string;
  userId: string;
  totalPoints: number;
  level: number;
  levelName: string;
  xp: number;
  xpToNextLevel: number;
  badges: Badge[];
  streaks: Streak;
  achievements: Achievement[];
  rank: number;
  schoolRank?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'learning' | 'quiz' | 'streak' | 'social' | 'special';
  earnedAt: Date;
}

export interface Streak {
  current: number;
  longest: number;
  lastActivityDate: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  target: number;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  studentId?: string;
  studentName?: string;
  userName: string;
  avatar?: string;
  points: number;
  totalPoints?: number;
  level: number;
  badges: number;
  schoolId?: string;
  schoolName?: string;
  quizzesCompleted?: number;
  averageScore?: number;
}

// Analytics
export interface QuizAnalytics {
  quizId: string;
  totalAttempts: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  averageTime: number; // seconds
  completionRate: number;
  passRate: number;
  questionStats: QuestionAnalytics[];
}

export interface QuestionAnalytics {
  questionId: string;
  correctRate: number;
  averageTime: number;
  mostSelectedOption?: string;
}

export interface StudentAnalytics {
  studentId: string;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  totalPoints: number;
  strongCategories: string[];
  weakCategories: string[];
  progressOverTime: ProgressPoint[];
}

export interface ProgressPoint {
  date: Date;
  score: number;
  quizTitle: string;
}

export interface ClassAnalytics {
  classId: string;
  className: string;
  studentCount: number;
  averageScore: number;
  completionRate: number;
  topPerformers: LeaderboardEntry[];
  recentQuizzes: QuizAnalytics[];
}

// AI Draft Generation
export interface AIDraft {
  id: string;
  type: 'quiz' | 'lesson_summary';
  status: 'generating' | 'ready' | 'approved' | 'rejected';
  sourceContent?: string;
  generatedContent: Quiz | string;
  createdBy: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNotes?: string;
}

// UI State Types
export interface QuizBuilderState {
  currentStep: 'details' | 'questions' | 'settings' | 'preview';
  quiz: Partial<Quiz>;
  isSaving: boolean;
}

export interface QuizPlayerState {
  session: MultiplayerSession | null;
  currentQuestion: Question | null;
  timeRemaining: number;
  selectedAnswer: string | null;
  hasSubmitted: boolean;
  showResults: boolean;
}
