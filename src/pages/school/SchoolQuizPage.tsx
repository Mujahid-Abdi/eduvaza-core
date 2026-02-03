import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileQuestion, Calendar, Play, BarChart3, Trophy, Medal } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { QuizBuilder } from '@/components/quiz/QuizBuilder';
import { QuizScheduler } from '@/components/quiz/QuizScheduler';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { useI18n } from '@/contexts/I18nContext';
import { mockQuizzes, mockScheduledQuizzes, mockQuizAnalytics } from '@/services/mockQuizData';
import { mockClasses } from '@/services/mockData';
import type { Quiz } from '@/types/quiz';

export const SchoolQuizPage = () => {
  const { t } = useI18n();
  const [view, setView] = useState<'list' | 'create' | 'schedule' | 'analytics' | 'leaderboard'>('list');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  // Helper function to get top students for a specific quiz
  const getTopStudentsForQuiz = (quizId: string) => {
    // Mock data - will be fetched from Firebase based on quiz results
    const quizStudents = [
      { name: 'Alice Johnson', country: 'United States', flag: '🇺🇸', score: 98, points: 196 },
      { name: 'Bob Smith', country: 'United Kingdom', flag: '🇬🇧', score: 95, points: 190 },
      { name: 'Charlie Brown', country: 'Canada', flag: '🇨🇦', score: 92, points: 184 },
      { name: 'Diana Prince', country: 'Australia', flag: '🇦🇺', score: 90, points: 180 },
      { name: 'Ethan Hunt', country: 'Germany', flag: '🇩🇪', score: 88, points: 176 },
      { name: 'Fiona Green', country: 'France', flag: '🇫🇷', score: 85, points: 170 },
      { name: 'George Wilson', country: 'United States', flag: '🇺🇸', score: 83, points: 166 },
      { name: 'Hannah Lee', country: 'South Korea', flag: '🇰🇷', score: 80, points: 160 },
      { name: 'Ian Malcolm', country: 'United Kingdom', flag: '🇬🇧', score: 78, points: 156 },
      { name: 'Julia Roberts', country: 'Canada', flag: '🇨🇦', score: 75, points: 150 },
    ];
    return quizStudents;
  };

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
                <TabsTrigger value="completed">Completed</TabsTrigger>
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

              <TabsContent value="completed" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {mockQuizzes.filter(q => q.isPublished).map((quiz) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">{quiz.title}</h3>
                                <Badge variant="outline" className="text-xs">Completed</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{quiz.description}</p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{quiz.questions.length} questions</Badge>
                                <Badge variant="secondary">{quiz.totalPoints} pts</Badge>
                                <Badge variant="secondary">45 participants</Badge>
                              </div>
                              <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center justify-between text-sm mb-2">
                                  <span className="text-muted-foreground">Average Score:</span>
                                  <span className="font-bold text-primary">85%</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Pass Rate:</span>
                                  <span className="font-bold text-green-600">89%</span>
                                </div>
                              </div>
                            </div>
                            <Trophy className="h-8 w-8 text-yellow-500 flex-shrink-0 ml-4" />
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                setSelectedQuiz(quiz);
                                setView('leaderboard');
                              }}
                            >
                              <Trophy className="h-4 w-4 mr-1" /> View Top Scorers
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setView('analytics')}>
                              <BarChart3 className="h-4 w-4 mr-1" /> Analytics
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

        {view === 'leaderboard' && selectedQuiz && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Top Scorers - {selectedQuiz.title}</h2>
                <p className="text-muted-foreground">Best performing students in this quiz</p>
              </div>
              <Button variant="outline" onClick={() => setView('list')}>Back to Quizzes</Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Students ranked by quiz performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {getTopStudentsForQuiz(selectedQuiz.id).map((student, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent border-yellow-200' : 'hover:bg-muted/50'
                      } transition-colors`}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted font-bold text-lg">
                        {index < 3 ? (
                          <div className="flex items-center justify-center">
                            {index === 0 && <Medal className="h-6 w-6 text-yellow-500" />}
                            {index === 1 && <Medal className="h-6 w-6 text-gray-400" />}
                            {index === 2 && <Medal className="h-6 w-6 text-amber-600" />}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">#{index + 1}</span>
                        )}
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{student.name}</h3>
                          {index < 3 && (
                            <Badge variant="secondary" className="text-xs">
                              {index === 0 ? '🏆 Champion' : index === 1 ? '🥈 Runner-up' : '🥉 Third Place'}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xl">{student.flag}</span>
                          <span className="text-sm text-muted-foreground">{student.country}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="hidden md:flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className="text-lg font-bold text-primary">{student.score}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Points</p>
                          <p className="text-lg font-bold">{student.points}</p>
                        </div>
                      </div>

                      {/* Mobile Stats */}
                      <div className="flex md:hidden flex-col items-end">
                        <p className="text-sm font-bold text-primary">{student.score}%</p>
                        <p className="text-xs text-muted-foreground">{student.points} pts</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SchoolQuizPage;
