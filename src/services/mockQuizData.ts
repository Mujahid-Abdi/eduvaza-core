// Mock Quiz & Gamification Data
import type { 
  Quiz, 
  Question, 
  ScheduledQuiz, 
  QuizAttempt, 
  MultiplayerSession,
  GamificationProfile,
  Badge,
  LeaderboardEntry,
  QuizAnalytics,
  StudentAnalytics,
  ClassAnalytics,
  AIDraft
} from '@/types/quiz';

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Algebra Basics Quiz',
    description: 'Test your understanding of basic algebraic concepts',
    courseId: 'course-1',
    schoolId: 'sch-1',
    teacherId: 'teacher-1',
    teacherName: 'John Mwamba',
    language: 'en',
    questions: [
      {
        id: 'q1',
        quizId: 'quiz-1',
        type: 'mcq',
        question: 'What is the value of x in the equation: 2x + 4 = 10?',
        options: [
          { id: 'o1', text: '2', isCorrect: false },
          { id: 'o2', text: '3', isCorrect: true },
          { id: 'o3', text: '4', isCorrect: false },
          { id: 'o4', text: '6', isCorrect: false },
        ],
        points: 10,
        timeLimit: 30,
        order: 1,
      },
      {
        id: 'q2',
        quizId: 'quiz-1',
        type: 'true_false',
        question: 'In algebra, a variable can only be represented by the letter x.',
        options: [
          { id: 'tf1', text: 'True', isCorrect: false },
          { id: 'tf2', text: 'False', isCorrect: true },
        ],
        points: 5,
        timeLimit: 15,
        order: 2,
      },
      {
        id: 'q3',
        quizId: 'quiz-1',
        type: 'mcq',
        question: 'Simplify: 3(x + 2)',
        options: [
          { id: 'o5', text: '3x + 2', isCorrect: false },
          { id: 'o6', text: '3x + 6', isCorrect: true },
          { id: 'o7', text: 'x + 6', isCorrect: false },
          { id: 'o8', text: '3x + 5', isCorrect: false },
        ],
        points: 10,
        timeLimit: 30,
        order: 3,
      },
      {
        id: 'q4',
        quizId: 'quiz-1',
        type: 'short_answer',
        question: 'What do we call the number in front of a variable (e.g., the 5 in 5x)?',
        correctAnswer: 'coefficient',
        points: 15,
        timeLimit: 45,
        order: 4,
      },
    ],
    totalPoints: 40,
    timeLimit: 10,
    isPublished: true,
    isMultiplayer: true,
    shuffleQuestions: false,
    shuffleOptions: true,
    showResults: true,
    passingScore: 60,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'quiz-2',
    title: 'Science: Ecosystems',
    description: 'Explore your knowledge about ecosystems and environment',
    courseId: 'course-2',
    schoolId: 'sch-1',
    teacherId: 'teacher-2',
    teacherName: 'Fatima Osei',
    language: 'en',
    questions: [
      {
        id: 'q5',
        quizId: 'quiz-2',
        type: 'mcq',
        question: 'Which of the following is a producer in an ecosystem?',
        options: [
          { id: 'o9', text: 'Lion', isCorrect: false },
          { id: 'o10', text: 'Grass', isCorrect: true },
          { id: 'o11', text: 'Rabbit', isCorrect: false },
          { id: 'o12', text: 'Snake', isCorrect: false },
        ],
        points: 10,
        timeLimit: 30,
        order: 1,
      },
      {
        id: 'q6',
        quizId: 'quiz-2',
        type: 'true_false',
        question: 'Decomposers break down dead organic matter.',
        options: [
          { id: 'tf3', text: 'True', isCorrect: true },
          { id: 'tf4', text: 'False', isCorrect: false },
        ],
        points: 5,
        timeLimit: 15,
        order: 2,
      },
    ],
    totalPoints: 15,
    timeLimit: 5,
    isPublished: true,
    isMultiplayer: false,
    shuffleQuestions: true,
    shuffleOptions: true,
    showResults: true,
    passingScore: 50,
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-25'),
  },
];

export const mockScheduledQuizzes: ScheduledQuiz[] = [
  {
    id: 'sched-1',
    quizId: 'quiz-1',
    classId: 'class-1',
    startTime: new Date(Date.now() + 3600000), // 1 hour from now
    endTime: new Date(Date.now() + 7200000),
    duration: 15,
    isLive: true,
    joinCode: 'ABC123',
    status: 'scheduled',
    maxParticipants: 35,
    createdAt: new Date(),
  },
  {
    id: 'sched-2',
    quizId: 'quiz-2',
    courseId: 'course-2',
    startTime: new Date(Date.now() + 86400000), // Tomorrow
    endTime: new Date(Date.now() + 90000000),
    duration: 10,
    isLive: false,
    status: 'scheduled',
    createdAt: new Date(),
  },
  {
    id: 'sched-3',
    quizId: 'quiz-1',
    classId: 'class-2',
    startTime: new Date(Date.now() - 86400000), // Yesterday
    endTime: new Date(Date.now() - 82800000),
    duration: 15,
    isLive: true,
    joinCode: 'XYZ789',
    status: 'completed',
    maxParticipants: 32,
    createdAt: new Date(Date.now() - 172800000),
  },
];

export const mockQuizAttempts: QuizAttempt[] = [
  {
    id: 'attempt-1',
    quizId: 'quiz-1',
    studentId: 'student-1',
    studentName: 'Amara Diallo',
    answers: [
      { questionId: 'q1', selectedOptionId: 'o2', isCorrect: true, pointsEarned: 10, timeTaken: 25 },
      { questionId: 'q2', selectedOptionId: 'tf2', isCorrect: true, pointsEarned: 5, timeTaken: 10 },
      { questionId: 'q3', selectedOptionId: 'o5', isCorrect: false, pointsEarned: 0, timeTaken: 28 },
      { questionId: 'q4', textAnswer: 'coefficient', isCorrect: true, pointsEarned: 15, timeTaken: 35 },
    ],
    score: 30,
    totalPoints: 40,
    percentage: 75,
    timeTaken: 480,
    startedAt: new Date(Date.now() - 7200000),
    completedAt: new Date(Date.now() - 6720000),
    isCompleted: true,
  },
];

export const mockBadges: Badge[] = [
  { id: 'badge-1', name: 'First Quiz', description: 'Complete your first quiz', icon: '🎯', color: '#FF6B35', category: 'quiz', earnedAt: new Date() },
  { id: 'badge-2', name: 'Perfect Score', description: 'Score 100% on any quiz', icon: '⭐', color: '#FFD700', category: 'quiz', earnedAt: new Date() },
  { id: 'badge-3', name: 'Week Streak', description: 'Learn for 7 days in a row', icon: '🔥', color: '#FF4500', category: 'streak', earnedAt: new Date() },
  { id: 'badge-4', name: 'Quick Learner', description: 'Complete 5 courses', icon: '📚', color: '#6B35FF', category: 'learning', earnedAt: new Date() },
  { id: 'badge-5', name: 'Team Player', description: 'Participate in 10 multiplayer quizzes', icon: '🤝', color: '#35B5FF', category: 'social', earnedAt: new Date() },
  { id: 'badge-6', name: 'Early Bird', description: 'Join a live quiz before it starts', icon: '🐦', color: '#35FF6B', category: 'special', earnedAt: new Date() },
];

export const mockGamificationProfile: GamificationProfile = {
  id: 'gam-1',
  userId: 'student-1',
  totalPoints: 2450,
  level: 8,
  levelName: 'Knowledge Seeker',
  xp: 450,
  xpToNextLevel: 600,
  badges: mockBadges.slice(0, 4),
  streaks: {
    current: 5,
    longest: 12,
    lastActivityDate: new Date(),
  },
  achievements: [
    { id: 'ach-1', name: 'Quiz Master', description: 'Complete 50 quizzes', icon: '🏆', progress: 23, target: 50, isCompleted: false },
    { id: 'ach-2', name: 'Perfect Week', description: 'Score above 80% for a week', icon: '📈', progress: 4, target: 7, isCompleted: false },
    { id: 'ach-3', name: 'Speed Demon', description: 'Answer 100 questions correctly in under 10 seconds', icon: '⚡', progress: 67, target: 100, isCompleted: false },
  ],
  rank: 24,
  schoolRank: 5,
};

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'student-5', userName: 'Kofi Mensah', points: 4520, level: 12, badges: 8, schoolId: 'sch-1', schoolName: 'Green Valley' },
  { rank: 2, userId: 'student-6', userName: 'Aisha Mohammed', points: 4180, level: 11, badges: 7, schoolId: 'sch-2', schoolName: 'Lagos Academy' },
  { rank: 3, userId: 'student-7', userName: 'Thabo Ndlovu', points: 3890, level: 10, badges: 6, schoolId: 'sch-1', schoolName: 'Green Valley' },
  { rank: 4, userId: 'student-8', userName: 'Fatou Diop', points: 3650, level: 10, badges: 6, schoolId: 'sch-2', schoolName: 'Lagos Academy' },
  { rank: 5, userId: 'student-1', userName: 'Amara Diallo', points: 2450, level: 8, badges: 4, schoolId: 'sch-1', schoolName: 'Green Valley' },
  { rank: 6, userId: 'student-9', userName: 'Chidi Okafor', points: 2280, level: 7, badges: 4, schoolId: 'sch-2', schoolName: 'Lagos Academy' },
  { rank: 7, userId: 'student-10', userName: 'Naledi Mokoena', points: 2150, level: 7, badges: 3, schoolId: 'sch-3', schoolName: 'Cape Town LC' },
  { rank: 8, userId: 'student-11', userName: 'Kwame Asante', points: 1980, level: 6, badges: 3, schoolId: 'sch-1', schoolName: 'Green Valley' },
  { rank: 9, userId: 'student-12', userName: 'Zainab Hassan', points: 1850, level: 6, badges: 2, schoolId: 'sch-4', schoolName: 'Accra Intl' },
  { rank: 10, userId: 'student-13', userName: 'Emmanuel Banda', points: 1720, level: 5, badges: 2, schoolId: 'sch-5', schoolName: 'DSM Academy' },
];

export const mockQuizAnalytics: QuizAnalytics = {
  quizId: 'quiz-1',
  totalAttempts: 45,
  averageScore: 72,
  highestScore: 100,
  lowestScore: 35,
  averageTime: 540,
  completionRate: 89,
  passRate: 78,
  questionStats: [
    { questionId: 'q1', correctRate: 82, averageTime: 22, mostSelectedOption: 'o2' },
    { questionId: 'q2', correctRate: 91, averageTime: 12, mostSelectedOption: 'tf2' },
    { questionId: 'q3', correctRate: 65, averageTime: 28, mostSelectedOption: 'o6' },
    { questionId: 'q4', correctRate: 48, averageTime: 40 },
  ],
};

export const mockStudentAnalytics: StudentAnalytics = {
  studentId: 'student-1',
  totalQuizzes: 23,
  completedQuizzes: 21,
  averageScore: 76,
  totalPoints: 2450,
  strongCategories: ['Mathematics', 'Science'],
  weakCategories: ['Languages'],
  progressOverTime: [
    { date: new Date(Date.now() - 2592000000), score: 65, quizTitle: 'Basic Math' },
    { date: new Date(Date.now() - 2160000000), score: 70, quizTitle: 'Algebra Intro' },
    { date: new Date(Date.now() - 1728000000), score: 68, quizTitle: 'Science Basics' },
    { date: new Date(Date.now() - 1296000000), score: 78, quizTitle: 'Algebra II' },
    { date: new Date(Date.now() - 864000000), score: 82, quizTitle: 'Ecosystems' },
    { date: new Date(Date.now() - 432000000), score: 75, quizTitle: 'Algebra Quiz' },
    { date: new Date(), score: 85, quizTitle: 'Latest Quiz' },
  ],
};

export const mockClassAnalytics: ClassAnalytics = {
  classId: 'class-1',
  className: 'Grade 8A',
  studentCount: 35,
  averageScore: 74,
  completionRate: 87,
  topPerformers: mockLeaderboard.slice(0, 5),
  recentQuizzes: [mockQuizAnalytics],
};

export const mockMultiplayerSession: MultiplayerSession = {
  id: 'session-1',
  scheduledQuizId: 'sched-1',
  quiz: mockQuizzes[0],
  joinCode: 'ABC123',
  hostId: 'teacher-1',
  status: 'waiting',
  currentQuestionIndex: 0,
  participants: [
    { id: 'p1', sessionId: 'session-1', studentId: 'student-1', studentName: 'Amara Diallo', score: 0, correctAnswers: 0, currentStreak: 0, hasAnswered: false, rank: 1, joinedAt: new Date() },
    { id: 'p2', sessionId: 'session-1', studentId: 'student-5', studentName: 'Kofi Mensah', score: 0, correctAnswers: 0, currentStreak: 0, hasAnswered: false, rank: 2, joinedAt: new Date() },
    { id: 'p3', sessionId: 'session-1', studentId: 'student-7', studentName: 'Thabo Ndlovu', score: 0, correctAnswers: 0, currentStreak: 0, hasAnswered: false, rank: 3, joinedAt: new Date() },
  ],
  createdAt: new Date(),
};

export const mockAIDrafts: AIDraft[] = [
  {
    id: 'draft-1',
    type: 'quiz',
    status: 'ready',
    sourceContent: 'Algebra lesson content about variables and equations',
    generatedContent: mockQuizzes[0],
    createdBy: 'teacher-1',
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'draft-2',
    type: 'lesson_summary',
    status: 'approved',
    sourceContent: 'Long lesson about ecosystems...',
    generatedContent: 'An ecosystem is a community of living organisms interacting with their physical environment. Key components include producers (plants), consumers (animals), and decomposers (fungi, bacteria). Energy flows through food chains and webs, while nutrients cycle through the ecosystem.',
    createdBy: 'teacher-2',
    createdAt: new Date(Date.now() - 86400000),
    reviewedAt: new Date(Date.now() - 82800000),
    reviewedBy: 'teacher-2',
    reviewNotes: 'Good summary, added to lesson.',
  },
];

// Level system
export const levelThresholds = [
  { level: 1, name: 'Beginner', minXP: 0, maxXP: 100 },
  { level: 2, name: 'Learner', minXP: 100, maxXP: 250 },
  { level: 3, name: 'Explorer', minXP: 250, maxXP: 450 },
  { level: 4, name: 'Achiever', minXP: 450, maxXP: 700 },
  { level: 5, name: 'Scholar', minXP: 700, maxXP: 1000 },
  { level: 6, name: 'Expert', minXP: 1000, maxXP: 1400 },
  { level: 7, name: 'Master', minXP: 1400, maxXP: 1900 },
  { level: 8, name: 'Knowledge Seeker', minXP: 1900, maxXP: 2500 },
  { level: 9, name: 'Sage', minXP: 2500, maxXP: 3200 },
  { level: 10, name: 'Guru', minXP: 3200, maxXP: 4000 },
  { level: 11, name: 'Legend', minXP: 4000, maxXP: 5000 },
  { level: 12, name: 'Grandmaster', minXP: 5000, maxXP: Infinity },
];
