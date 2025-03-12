import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FileQuestion, Search, Plus, Eye, Edit, Trash2, Calendar, BarChart3, Play } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QuizBuilder } from '@/components/quiz/QuizBuilder';
import { toast } from 'sonner';
import type { Quiz } from '@/types/quiz';

export const ManageQuizzes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'create'>('list');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        // TODO: Implement Firebase quiz fetching
        // const allQuizzes = await quizzesService.getAllQuizzes();
        // setQuizzes(allQuizzes);
        
        // For now, using mock data
        const { mockQuizzes } = await import('@/services/mockQuizData');
        setQuizzes(mockQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        toast.error('Failed to load quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveQuiz = (quiz: Partial<Quiz>) => {
    console.log('Saving quiz:', quiz);
    toast.success('Quiz created successfully!');
    setView('list');
    // Refresh quizzes list
    // fetchQuizzes();
  };

  const handleDeleteQuiz = (quizId: string, title: string) => {
    // TODO: Implement Firebase quiz deletion
    toast.success(`${title} has been deleted`);
    setQuizzes(quizzes.filter(q => q.id !== quizId));
  };

  const stats = {
    total: quizzes.length,
    totalQuestions: quizzes.reduce((acc, q) => acc + q.questions.length, 0),
    totalPoints: quizzes.reduce((acc, q) => acc + q.totalPoints, 0),
    avgQuestions: quizzes.length > 0 ? Math.round(quizzes.reduce((acc, q) => acc + q.questions.length, 0) / quizzes.length) : 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {view === 'list' ? (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  <FileQuestion className="h-8 w-8" />
                  Manage Quizzes
                </h1>
                <p className="text-muted-foreground mt-2">View, create, and manage all quizzes</p>
              </div>
              <Button onClick={() => setView('create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Quiz
              </Button>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-4 md:grid-cols-4"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-sm text-muted-foreground">Total Quizzes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalPoints}</div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">{stats.avgQuestions}</div>
                  <p className="text-sm text-muted-foreground">Avg Questions</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle>Search Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quizzes..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quizzes List */}
            <Card>
              <CardHeader>
                <CardTitle>Quizzes ({filteredQuizzes.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                    <p className="text-muted-foreground mt-4">Loading quizzes...</p>
                  </div>
                ) : filteredQuizzes.length > 0 ? (
                  <div className="space-y-3">
                    {filteredQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
                            🎯
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{quiz.title}</p>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{quiz.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline">{quiz.questions.length} questions</Badge>
                              <Badge variant="secondary">{quiz.totalPoints} points</Badge>
                              <Badge variant={quiz.isPublished ? 'default' : 'secondary'}>
                                {quiz.isPublished ? 'Published' : 'Draft'}
                              </Badge>
                              {quiz.isMultiplayer && <Badge variant="secondary">Multiplayer</Badge>}
                              <span className="text-xs text-muted-foreground">
                                {quiz.timeLimit} minutes
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Difficulty: {quiz.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileQuestion className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No quizzes found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <QuizBuilder
            onSave={handleSaveQuiz}
            onCancel={() => setView('list')}
            onGenerateAI={() => {}}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageQuizzes;
