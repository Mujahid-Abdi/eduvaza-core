import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, CheckCircle, Medal, Clock, Bookmark, BookmarkCheck, RotateCcw, ExternalLink, AlertCircle, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GamificationCard } from '@/components/gamification/GamificationCard';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { quizService } from '@/services/quizzes';
import { mockGamificationProfile } from '@/services/mockQuizData';
import { toast } from 'sonner';
import type { Quiz, QuizAttempt } from '@/types/quiz';

export const StudentQuizPage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [savedQuizIds, setSavedQuizIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingQuiz, setSavingQuiz] = useState<string | null>(null);
  const [deletingAttempt, setDeletingAttempt] = useState<string | null>(null);

  // Fetch all data
  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [fetchedQuizzes, fetchedAttempts, fetchedSavedQuizIds] = await Promise.all([
        quizService.getQuizzes(),
        quizService.getAttemptsByStudent(user.id),
        quizService.getSavedQuizzes(user.id),
      ]);
      
      setQuizzes(fetchedQuizzes);
      setAttempts(fetchedAttempts);
      setSavedQuizIds(fetchedSavedQuizIds);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  // Get completed quizzes with their quiz data
  const completedAttempts = attempts
    .filter(attempt => attempt.status === 'completed')
    .map(attempt => ({
      ...attempt,
      quiz: quizzes.find(q => q.id === attempt.quizId),
    }))
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });

  // Get in-progress (unfinished) quizzes
  const inProgressAttempts = attempts
    .filter(attempt => attempt.status === 'in_progress')
    .map(attempt => ({
      ...attempt,
      quiz: quizzes.find(q => q.id === attempt.quizId),
    }))
    .sort((a, b) => {
      const dateA = a.startedAt ? new Date(a.startedAt).getTime() : 0;
      const dateB = b.startedAt ? new Date(b.startedAt).getTime() : 0;
      return dateB - dateA;
    });

  // Get available quizzes (all published quizzes - students can retake)
  const availableQuizzes = quizzes.filter(q => q.isPublished);

  // Get saved quizzes
  const savedQuizzes = quizzes.filter(q => savedQuizIds.includes(q.id!));

  const handleStartQuiz = (quiz: Quiz) => {
    navigate(`/quiz/${quiz.id}`);
  };

  const handleToggleSaveQuiz = async (quizId: string) => {
    if (!user?.id) {
      toast.error('Please login to save quizzes');
      return;
    }

    setSavingQuiz(quizId);
    try {
      const isSaved = savedQuizIds.includes(quizId);
      
      if (isSaved) {
        await quizService.unsaveQuiz(user.id, quizId);
        setSavedQuizIds(prev => prev.filter(id => id !== quizId));
        toast.success('Quiz removed from saved');
      } else {
        await quizService.saveQuizForLater(user.id, quizId);
        setSavedQuizIds(prev => [...prev, quizId]);
        toast.success('Quiz saved for later');
      }
    } catch (error) {
      console.error('Error toggling save quiz:', error);
      toast.error('Failed to save quiz');
    } finally {
      setSavingQuiz(null);
    }
  };

  const handleDeleteAttempt = async (attemptId: string) => {
    if (!user?.id) return;

    if (!confirm('Are you sure you want to delete this quiz attempt? This action cannot be undone.')) {
      return;
    }

    setDeletingAttempt(attemptId);
    try {
      await quizService.deleteAttempt(attemptId);
      toast.success('Quiz attempt deleted');
      
      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error deleting attempt:', error);
      toast.error('Failed to delete quiz attempt');
    } finally {
      setDeletingAttempt(null);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500"><Medal className="h-3 w-3 mr-1" />1st Place</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400"><Medal className="h-3 w-3 mr-1" />2nd Place</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600"><Medal className="h-3 w-3 mr-1" />3rd Place</Badge>;
    return <Badge variant="outline">Rank #{rank}</Badge>;
  };

  const QuizCard = ({ quiz, showSaveButton = true, showRetakeButton = false, attempt }: { 
    quiz: Quiz; 
    showSaveButton?: boolean; 
    showRetakeButton?: boolean;
    attempt?: QuizAttempt;
  }) => {
    const isSaved = savedQuizIds.includes(quiz.id!);
    
    return (
      <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold flex-1">{quiz.title}</h3>
          {showSaveButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggleSaveQuiz(quiz.id!)}
              disabled={savingQuiz === quiz.id}
              className="ml-2"
            >
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge>{quiz.questions.length} Questions</Badge>
          <Badge variant="outline">{quiz.totalPoints} Points</Badge>
          {quiz.timeLimit && <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />{quiz.timeLimit} min</Badge>}
          <Badge variant="outline">{quiz.difficulty}</Badge>
        </div>
        
        {attempt && (
          <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t">
            <Badge variant="outline">
              Score: {attempt.score}/{quiz.totalPoints}
            </Badge>
            <Badge variant="secondary">
              {attempt.percentage}%
            </Badge>
            {attempt.timeTaken && (
              <Badge variant="outline">
                <Clock className="h-3 w-3 mr-1" />
                {Math.floor(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          {showRetakeButton ? (
            <Button size="sm" className="flex-1" onClick={() => handleStartQuiz(quiz)}>
              <RotateCcw className="h-4 w-4 mr-2" /> Retake Quiz
            </Button>
          ) : (
            <Button size="sm" className="flex-1" onClick={() => handleStartQuiz(quiz)}>
              <Play className="h-4 w-4 mr-2" /> Start Quiz
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <GamificationCard profile={mockGamificationProfile} compact />
        </motion.div>

        <Tabs defaultValue="available">
          <TabsList>
            <TabsTrigger value="available">
              Available
              {inProgressAttempts.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {inProgressAttempts.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="saved">Saved ({savedQuizzes.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedAttempts.length})</TabsTrigger>
          </TabsList>

          {/* Available Quizzes */}
          <TabsContent value="available" className="mt-4">
            {/* In Progress Quizzes Section */}
            {inProgressAttempts.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-warning" />
                        Unfinished Quizzes
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Continue where you left off
                      </p>
                    </div>
                    <Badge variant="secondary">{inProgressAttempts.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {inProgressAttempts.map((attempt) => (
                      <div key={attempt.id} className="p-4 rounded-lg border bg-warning/5 border-warning/20">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{attempt.quiz?.title}</h3>
                              <Badge variant="outline" className="text-warning border-warning">
                                In Progress
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {attempt.quiz?.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge variant="outline">
                                {attempt.quiz?.questions.length} Questions
                              </Badge>
                              <Badge variant="outline">
                                {attempt.quiz?.totalPoints} Points
                              </Badge>
                              {attempt.quiz?.timeLimit && (
                                <Badge variant="secondary">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {attempt.quiz.timeLimit} min
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Started on {new Date(attempt.startedAt).toLocaleDateString()} at {new Date(attempt.startedAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 ml-4">
                            <Button 
                              size="sm"
                              onClick={() => attempt.quiz && handleStartQuiz(attempt.quiz)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Continue
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteAttempt(attempt.id!)}
                              disabled={deletingAttempt === attempt.id}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Browse Quizzes Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Browse All Quizzes</CardTitle>
                  <Button onClick={() => navigate('/quizzes')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Browse Quizzes
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading quizzes...</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-primary opacity-50" />
                    <p className="text-muted-foreground mb-2">
                      Explore {availableQuizzes.length} available quiz{availableQuizzes.length !== 1 ? 'zes' : ''}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Test your knowledge and improve your skills
                    </p>
                    <Button onClick={() => navigate('/quizzes')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Go to Quiz Library
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Saved Quizzes */}
          <TabsContent value="saved" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading saved quizzes...</p>
                  </div>
                ) : savedQuizzes.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedQuizzes.map((quiz) => (
                      <QuizCard key={quiz.id} quiz={quiz} showSaveButton showRetakeButton={false} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-2">No saved quizzes yet</p>
                    <p className="text-sm text-muted-foreground">
                      Click the bookmark icon on any quiz to save it for later
                    </p>
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
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading completed quizzes...</p>
                  </div>
                ) : completedAttempts.length > 0 ? (
                  <div className="space-y-4">
                    {completedAttempts.map((attempt) => (
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
                              <Badge variant={attempt.percentage >= (attempt.quiz?.passingScore || 60) ? 'default' : 'secondary'}>
                                {attempt.percentage}%
                              </Badge>
                              {attempt.timeTaken && (
                                <Badge variant="outline">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {Math.floor(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              Completed on {new Date(attempt.completedAt!).toLocaleDateString()} at {new Date(attempt.completedAt!).toLocaleTimeString()}
                            </p>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => attempt.quiz && handleStartQuiz(attempt.quiz)}
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Retake Quiz
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteAttempt(attempt.id!)}
                                disabled={deletingAttempt === attempt.id}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <Trophy className="h-8 w-8 text-primary mx-auto mb-1" />
                            <p className="text-2xl font-bold">{attempt.percentage}%</p>
                            <p className="text-xs text-muted-foreground">
                              {attempt.percentage >= (attempt.quiz?.passingScore || 60) ? 'Passed' : 'Failed'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No completed quizzes yet. Start taking quizzes!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizPage;
