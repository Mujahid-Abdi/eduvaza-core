import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, CheckCircle, Medal, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { GamificationCard } from '@/components/gamification/GamificationCard';
import { useI18n } from '@/contexts/I18nContext';
import { mockQuizzes, mockGamificationProfile, mockQuizAttempts } from '@/services/mockQuizData';
import type { Quiz } from '@/types/quiz';

export const StudentQuizPage = () => {
  const { t } = useI18n();
  const [view, setView] = useState<'list' | 'play'>('list');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const currentStudentId = 'student-1'; // This should come from auth context

  // Get student's completed quizzes
  const completedQuizzes = mockQuizAttempts
    .filter(attempt => attempt.studentId === currentStudentId && attempt.status === 'completed')
    .map(attempt => {
      const quiz = mockQuizzes.find(q => q.id === attempt.quizId);
      return {
        ...attempt,
        quiz,
      };
    });

  // Get available quizzes (not yet taken)
  const completedQuizIds = completedQuizzes.map(cq => cq.quizId);
  const availableQuizzes = mockQuizzes.filter(
    q => q.isPublished && !completedQuizIds.includes(q.id)
  );

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setView('play');
  };

  const handleCompleteQuiz = (answers: any[], timeTaken: number) => {
    console.log('Quiz completed:', { answers, timeTaken });
    setView('list');
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500"><Medal className="h-3 w-3 mr-1" />1st Place</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400"><Medal className="h-3 w-3 mr-1" />2nd Place</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600"><Medal className="h-3 w-3 mr-1" />3rd Place</Badge>;
    return <Badge variant="outline">Rank #{rank}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {view === 'list' && (
          <>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <GamificationCard profile={mockGamificationProfile} compact onViewLeaderboard={() => setView('leaderboard')} />
            </motion.div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setView('calendar')}>
                <CalendarIcon className="h-4 w-4 mr-2" />
                {t('quiz.calendar')}
              </Button>
              <Button variant="outline" onClick={() => setView('leaderboard')}>
                <Trophy className="h-4 w-4 mr-2" />
                {t('gamification.leaderboard')}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Available Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {mockQuizzes.filter(q => q.isPublished).map((quiz) => (
                    <div key={quiz.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                      <h3 className="font-semibold">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge>{quiz.questions.length} Q</Badge>
                        <Badge variant="outline">{quiz.totalPoints} pts</Badge>
                        {quiz.timeLimit && <Badge variant="secondary">{quiz.timeLimit} min</Badge>}
                      </div>
                      <Button size="sm" className="mt-4 w-full" onClick={() => handleStartQuiz(quiz)}>
                        <Play className="h-4 w-4 mr-2" /> Start Quiz
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {view === 'play' && activeQuiz && (
          <QuizPlayer quiz={activeQuiz} onComplete={handleCompleteQuiz} onExit={() => setView('list')} />
        )}

        {view === 'calendar' && (
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setView('list')}>← Back</Button>
            <QuizCalendar scheduledQuizzes={mockScheduledQuizzes} />
          </div>
        )}

        {view === 'leaderboard' && (
          <div className="space-y-4">
            <Button variant="outline" onClick={() => setView('list')}>← Back</Button>
            <Leaderboard entries={mockLeaderboard} currentUserId="student-1" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizPage;
