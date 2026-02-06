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
import { quizService } from '@/services/quizzes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Quiz } from '@/types/quiz';

export const ManageQuizzes = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'list' | 'create'>('list');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all quizzes from Firebase
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        console.log('🔍 Admin fetching all quizzes from Firebase...');
        const allQuizzes = await quizService.getAllQuizzes();
        console.log('✅ Fetched', allQuizzes.length, 'quizzes');
        setQuizzes(allQuizzes);
      } catch (error) {
        console.error('❌ Error fetching quizzes:', error);
        toast.error('Failed to load quizzes');
        setQuizzes([]);
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

  const handleSaveQuiz = async (quiz: Partial<Quiz>) => {
    if (!user?.id) {
      toast.error('Please wait for authentication to complete');
      return;
    }

    try {
      const quizData = {
        ...quiz,
        teacherId: user.id,
        teacherName: user.name || user.email || 'Admin',
        isPublished: quiz.isPublished ?? false,
      };

      console.log('📝 Admin creating quiz:', quizData);
      await quizService.createQuiz(quizData);
      toast.success('Quiz created successfully!');
      setView('list');
      
      // Refresh quizzes list
      const allQuizzes = await quizService.getAllQuizzes();
      setQuizzes(allQuizzes);
    } catch (error) {
      console.error('❌ Error saving quiz:', error);
      toast.error('Failed to save quiz');
    }
  };

  const handleDeleteQuiz = async (quizId: string, title: string) => {
    try {
      console.log('🗑️ Deleting quiz:', quizId);
      await quizService.deleteQuiz(quizId);
      toast.success(`${title} has been deleted`);
      setQuizzes(quizzes.filter(q => q.id !== quizId));
    } catch (error) {
      console.error('❌ Error deleting quiz:', error);
      toast.error('Failed to delete quiz');
    }
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
              className="grid gap-3 grid-cols-2 lg:grid-cols-4"
            >
              <Card>
                <CardContent className="p-4">
                  <div className="text-xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Total Quizzes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xl font-bold text-blue-600">{stats.totalQuestions}</div>
                  <p className="text-xs text-muted-foreground">Total Questions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xl font-bold text-purple-600">{stats.totalPoints}</div>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xl font-bold text-green-600">{stats.avgQuestions}</div>
                  <p className="text-xs text-muted-foreground">Avg Questions</p>
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
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors gap-3"
                      >
                        <div className="flex items-start gap-3 flex-1 w-full min-w-0">
                          <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                            🎯
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-foreground truncate">{quiz.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{quiz.description}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">{quiz.questions.length} questions</Badge>
                              <Badge variant="secondary" className="text-xs">{quiz.totalPoints} points</Badge>
                              <Badge variant={quiz.isPublished ? 'default' : 'secondary'} className="text-xs">
                                {quiz.isPublished ? 'Published' : 'Draft'}
                              </Badge>
                              {quiz.isMultiplayer && <Badge variant="secondary" className="text-xs">Multiplayer</Badge>}
                              <span className="text-xs text-muted-foreground">
                                {quiz.timeLimit} min
                              </span>
                              <span className="text-xs text-muted-foreground hidden sm:inline">
                                {quiz.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
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
            userRole="super_admin"
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageQuizzes;
