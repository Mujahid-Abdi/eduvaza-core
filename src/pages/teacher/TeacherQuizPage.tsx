import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileQuestion, Calendar, Play, BarChart3 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QuizBuilder } from '@/components/quiz/QuizBuilder';
import { QuizScheduler } from '@/components/quiz/QuizScheduler';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { AIDraftGenerator } from '@/components/ai/AIDraftGenerator';
import { useI18n } from '@/contexts/I18nContext';
import { mockQuizzes, mockScheduledQuizzes, mockQuizAnalytics } from '@/services/mockQuizData';
import { mockClasses } from '@/services/mockData';
import type { Quiz } from '@/types/quiz';

export const TeacherQuizPage = () => {
  const { t } = useI18n();
  const [view, setView] = useState<'list' | 'create' | 'schedule' | 'analytics'>('list');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleSaveQuiz = (quiz: Partial<Quiz>) => {
    console.log('Saving quiz:', quiz);
    setView('list');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {view === 'list' && (
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold">{t('quiz.myQuizzes')}</h1>
                <p className="text-muted-foreground">Create and manage quizzes for your courses</p>
              </div>
              <Button onClick={() => setView('create')}>
                <Plus className="h-4 w-4 mr-2" />
                {t('quiz.createQuiz')}
              </Button>
            </motion.div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Quizzes</TabsTrigger>
                <TabsTrigger value="published">Published</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {mockQuizzes.map((quiz) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{quiz.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                <Badge>{quiz.questions.length} questions</Badge>
                                <Badge variant="outline">{quiz.totalPoints} pts</Badge>
                                {quiz.isMultiplayer && <Badge variant="secondary">Multiplayer</Badge>}
                                <Badge variant={quiz.isPublished ? 'default' : 'secondary'}>
                                  {quiz.isPublished ? 'Published' : 'Draft'}
                                </Badge>
                              </div>
                            </div>
                            <FileQuestion className="h-8 w-8 text-primary/50" />
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="outline" onClick={() => { setSelectedQuiz(quiz); setView('schedule'); }}>
                              <Calendar className="h-4 w-4 mr-1" /> Schedule
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setView('analytics')}>
                              <BarChart3 className="h-4 w-4 mr-1" /> Analytics
                            </Button>
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-1" /> Start Live
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {view === 'create' && (
          <QuizBuilder
            onSave={handleSaveQuiz}
            onCancel={() => setView('list')}
            onGenerateAI={() => {}}
          />
        )}

        {view === 'schedule' && selectedQuiz && (
          <QuizScheduler
            quiz={selectedQuiz}
            classes={mockClasses}
            onSchedule={(data) => { console.log('Scheduled:', data); setView('list'); }}
            onCancel={() => setView('list')}
          />
        )}

        {view === 'analytics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{t('quiz.analytics')}</h2>
              <Button variant="outline" onClick={() => setView('list')}>Back to Quizzes</Button>
            </div>
            <AnalyticsDashboard quizAnalytics={mockQuizAnalytics} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherQuizPage;
