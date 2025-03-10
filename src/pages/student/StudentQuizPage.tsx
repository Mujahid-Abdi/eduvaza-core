import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, Calendar as CalendarIcon } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { QuizCalendar } from '@/components/quiz/QuizCalendar';
import { MultiplayerLobby } from '@/components/quiz/MultiplayerLobby';
import { GamificationCard } from '@/components/gamification/GamificationCard';
import { Leaderboard } from '@/components/gamification/Leaderboard';
import { useI18n } from '@/contexts/I18nContext';
import { mockQuizzes, mockScheduledQuizzes, mockGamificationProfile, mockLeaderboard } from '@/services/mockQuizData';
import type { Quiz } from '@/types/quiz';

export const StudentQuizPage = () => {
  const { t } = useI18n();
  const [view, setView] = useState<'list' | 'play' | 'join' | 'leaderboard' | 'calendar'>('list');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setView('play');
  };

  const handleCompleteQuiz = (answers: any[], timeTaken: number) => {
    console.log('Quiz completed:', { answers, timeTaken });
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
              <Button variant="outline" onClick={() => setView('join')}>
                <Play className="h-4 w-4 mr-2" />
                {t('quiz.joinLive')}
              </Button>
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

        {view === 'join' && (
          <MultiplayerLobby isHost={false} onJoin={(code, name) => console.log('Join:', code, name)} onLeave={() => setView('list')} />
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
