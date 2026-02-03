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
              <GamificationCard profile={mockGamificationProfile} compact />
            </motion.div>

            <Tabs defaultValue="available">
              <TabsList>
                <TabsTrigger value="available">Available Quizzes</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedQuizzes.length})</TabsTrigger>
              </TabsList>

              {/* Available Quizzes */}
              <TabsContent value="available" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Quizzes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {availableQuizzes.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {availableQuizzes.map((quiz) => (
                          <div key={quiz.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <h3 className="font-semibold">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
                            <div className="flex gap-2 mt-3">
                              <Badge>{quiz.questions.length} Questions</Badge>
                              <Badge variant="outline">{quiz.totalPoints} Points</Badge>
                              {quiz.timeLimit && <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />{quiz.timeLimit} min</Badge>}
                            </div>
                            <Button size="sm" className="mt-4 w-full" onClick={() => handleStartQuiz(quiz)}>
                              <Play className="h-4 w-4 mr-2" /> Start Quiz
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                        <p className="text-muted-foreground">You've completed all available quizzes!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Completed Quizzes */}
              <TabsContent value="completed" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Completed Quizzes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {completedQuizzes.length > 0 ? (
                      <div className="space-y-4">
                        {completedQuizzes.map((attempt) => (
                          <div key={attempt.id} className="p-4 rounded-lg border">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold">{attempt.quiz?.title}</h3>
                                  <CheckCircle className="h-4 w-4 text-success" />
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <Badge variant="outline">
                                    Score: {attempt.score}/{attempt.quiz?.totalPoints}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {Math.round((attempt.score / (attempt.quiz?.totalPoints || 1)) * 100)}%
                                  </Badge>
                                  {attempt.timeTaken && (
                                    <Badge variant="outline">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {Math.floor(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')}
                                    </Badge>
                                  )}
                                  {getRankBadge(attempt.rank || 0)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Completed on {new Date(attempt.completedAt!).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <Trophy className="h-8 w-8 text-primary mx-auto mb-1" />
                                <p className="text-xs text-muted-foreground">Rank</p>
                                <p className="text-lg font-bold">#{attempt.rank}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">No completed quizzes yet. Start taking quizzes!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {view === 'play' && activeQuiz && (
          <QuizPlayer quiz={activeQuiz} onComplete={handleCompleteQuiz} onExit={() => setView('list')} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizPage;
