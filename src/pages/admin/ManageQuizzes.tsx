import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileQuestion, Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { mockQuizzes } from '@/services/mockQuizData';
import { toast } from 'sonner';

export const ManageQuizzes = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = mockQuizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateQuiz = () => {
    toast.info('Opening quiz creation dialog...');
  };

  const handleViewQuiz = (title: string) => {
    toast.info(`Viewing ${title}`);
  };

  const handleEditQuiz = (title: string) => {
    toast.info(`Editing ${title}`);
  };

  const handleDeleteQuiz = (title: string) => {
    toast.success(`${title} has been deleted`);
  };

  const stats = {
    total: mockQuizzes.length,
    totalQuestions: mockQuizzes.reduce((acc, q) => acc + q.questions.length, 0),
    totalPoints: mockQuizzes.reduce((acc, q) => acc + q.totalPoints, 0),
    avgQuestions: Math.round(mockQuizzes.reduce((acc, q) => acc + q.questions.length, 0) / mockQuizzes.length),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
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
          <Button onClick={handleCreateQuiz}>
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
                    <Button variant="ghost" size="sm" onClick={() => handleViewQuiz(quiz.title)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditQuiz(quiz.title)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteQuiz(quiz.title)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageQuizzes;
