import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, ChevronDown, ChevronUp, Calendar, TrendingUp, Award, Target } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { mockQuizzes, mockLeaderboard, mockQuizAttempts } from '@/services/mockQuizData';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

export const StudentLeaderboard = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  
  // Always use 'student-1' for demo purposes since that's what the mock data uses
  const currentStudentId = 'student-1';

  console.log('Current User:', user);
  console.log('Using Student ID:', currentStudentId);
  console.log('All Quiz Attempts:', mockQuizAttempts);
  console.log('Filtered Attempts:', mockQuizAttempts.filter(a => a.studentId === currentStudentId));

  // Get quizzes the student has participated in
  const studentQuizzes = mockQuizAttempts
    .filter(attempt => attempt.studentId === currentStudentId && attempt.status === 'completed')
    .map(attempt => {
      const quiz = mockQuizzes.find(q => q.id === attempt.quizId);
      if (!quiz) return null;
      return {
        ...quiz,
        attempt,
      };
    })
    .filter((quiz): quiz is NonNullable<typeof quiz> => quiz !== null)
    .sort((a, b) => {
      const dateA = a.attempt.completedAt ? new Date(a.attempt.completedAt).getTime() : 0;
      const dateB = b.attempt.completedAt ? new Date(b.attempt.completedAt).getTime() : 0;
      return dateB - dateA;
    });

  // Filter quizzes by time period
  const getFilteredQuizzes = () => {
    const now = new Date();
    return studentQuizzes.filter(quiz => {
      if (!quiz.attempt.completedAt) return false;
      const completedDate = new Date(quiz.attempt.completedAt);
      
      if (timeFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return completedDate >= weekAgo;
      } else if (timeFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return completedDate >= monthAgo;
      }
      return true;
    });
  };

  const filteredQuizzes = getFilteredQuizzes();

  console.log('Student Quizzes:', studentQuizzes);
  console.log('Filtered Quizzes:', filteredQuizzes);
  console.log('Time Filter:', timeFilter);

  // Mock function to get leaderboard for a specific quiz
  const getQuizLeaderboard = (quizId: string) => {
    return mockLeaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      totalPoints: Math.floor(Math.random() * 50) + 50,
      averageScore: Math.floor(Math.random() * 30) + 70,
    }));
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Medal className={`h-5 w-5 ${getRankColor(rank)}`} />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const LeaderboardEntry = ({ entry, isCurrentUser = false }: { entry: typeof mockLeaderboard[0], isCurrentUser?: boolean }) => (
    <div className={`flex items-center gap-4 p-3 rounded-lg ${isCurrentUser ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/30'}`}>
      <div className="w-10 flex items-center justify-center">
        {getRankIcon(entry.rank)}
      </div>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">{entry.studentName?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">
          {entry.studentName || entry.userName} {isCurrentUser && <Badge variant="secondary" className="ml-2">You</Badge>}
        </p>
        <p className="text-xs text-muted-foreground">{entry.quizzesCompleted} quizzes</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{entry.totalPoints}</p>
        <p className="text-xs text-muted-foreground">points</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{entry.averageScore}%</p>
        <p className="text-xs text-muted-foreground">score</p>
      </div>
    </div>
  );

  // Calculate overall stats
  const totalQuizzes = filteredQuizzes.length;
  const averageScore = totalQuizzes > 0 
    ? Math.round(filteredQuizzes.reduce((sum, q) => sum + q.attempt.percentage, 0) / totalQuizzes)
    : 0;
  const topRanks = filteredQuizzes.filter(q => q.attempt.rank && q.attempt.rank <= 3).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            My Quiz Rankings
          </h1>
          <p className="text-muted-foreground">
            Track your performance and rankings across all quizzes
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Target className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalQuizzes}</p>
                  <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{averageScore}%</p>
                  <p className="text-sm text-muted-foreground">Average Score</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-500/10">
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{topRanks}</p>
                  <p className="text-sm text-muted-foreground">Top 3 Finishes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Time Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="week">
                  <Calendar className="h-4 w-4 mr-2" />
                  This Week
                </TabsTrigger>
                <TabsTrigger value="month">
                  <Calendar className="h-4 w-4 mr-2" />
                  This Month
                </TabsTrigger>
                <TabsTrigger value="all">
                  <Trophy className="h-4 w-4 mr-2" />
                  All Time
                </TabsTrigger>
              </TabsList>
              {filteredQuizzes.length > 0 && (
                <Badge variant="outline" className="text-sm">
                  {filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'quiz' : 'quizzes'}
                </Badge>
              )}
            </div>

            <TabsContent value={timeFilter} className="mt-0">
              {filteredQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {filteredQuizzes.map((quiz, index) => {
                    if (!quiz || !quiz.id) return null;
                    
                    const quizLeaderboard = getQuizLeaderboard(quiz.id);
                    const currentUserEntry = quizLeaderboard.find(entry => entry.studentId === currentStudentId);
                    const isExpanded = expandedQuiz === quiz.id;
                    const completedDate = quiz.attempt.completedAt 
                      ? new Date(quiz.attempt.completedAt).toLocaleDateString()
                      : 'N/A';

                    return (
                      <Card key={`quiz-${quiz.id}-${index}`} className={isExpanded ? 'ring-2 ring-primary' : ''}>
                        <Collapsible
                          open={isExpanded}
                          onOpenChange={() => setExpandedQuiz(isExpanded ? null : quiz.id!)}
                        >
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  {/* Rank Badge */}
                                  <div className={`p-4 rounded-lg ${
                                    quiz.attempt.rank === 1 ? 'bg-yellow-500/20' :
                                    quiz.attempt.rank === 2 ? 'bg-gray-400/20' :
                                    quiz.attempt.rank === 3 ? 'bg-amber-600/20' :
                                    'bg-primary/10'
                                  }`}>
                                    <div className="flex flex-col items-center">
                                      {quiz.attempt.rank && quiz.attempt.rank <= 3 ? (
                                        <Medal className={`h-8 w-8 ${getRankColor(quiz.attempt.rank)}`} />
                                      ) : (
                                        <Trophy className="h-8 w-8 text-primary" />
                                      )}
                                      <p className={`text-xl font-bold mt-1 ${getRankColor(quiz.attempt.rank || 0)}`}>
                                        #{quiz.attempt.rank || 'N/A'}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {/* Quiz Info */}
                                  <div className="text-left flex-1">
                                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Completed on {completedDate}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge variant="secondary">
                                        Score: {quiz.attempt.score}/{quiz.attempt.totalPoints}
                                      </Badge>
                                      <Badge className={
                                        quiz.attempt.percentage >= 90 ? 'bg-green-500 hover:bg-green-600' :
                                        quiz.attempt.percentage >= 70 ? 'bg-blue-500 hover:bg-blue-600' :
                                        quiz.attempt.percentage >= 50 ? 'bg-yellow-500 hover:bg-yellow-600' :
                                        'bg-red-500 hover:bg-red-600'
                                      }>
                                        {quiz.attempt.percentage}%
                                      </Badge>
                                      {quiz.attempt.rank && quiz.attempt.rank <= 10 && (
                                        <Badge variant="outline" className="border-primary text-primary">
                                          Top 10
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Expand Icon */}
                                <div className="flex items-center gap-2 ml-4">
                                  {isExpanded ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <CardContent className="pt-0 pb-6">
                              <div className="space-y-3">
                                {/* Your Rank Highlight */}
                                {currentUserEntry && (
                                  <div className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <h3 className="font-semibold text-sm flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-primary" />
                                        Your Position
                                      </h3>
                                    </div>
                                    <LeaderboardEntry entry={currentUserEntry} isCurrentUser />
                                  </div>
                                )}

                                <Separator />

                                <div className="flex items-center justify-between mt-4 mb-3">
                                  <h3 className="font-semibold text-sm">Quiz Leaderboard</h3>
                                  <Badge variant="outline">{quizLeaderboard.length} participants</Badge>
                                </div>

                                {/* Top 20 Leaderboard */}
                                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                  {quizLeaderboard.slice(0, 20).map((entry) => (
                                    <LeaderboardEntry
                                      key={`${entry.studentId}-${entry.rank}`}
                                      entry={entry}
                                      isCurrentUser={entry.studentId === currentStudentId}
                                    />
                                  ))}
                                </div>

                                {quizLeaderboard.length > 20 && (
                                  <p className="text-xs text-center text-muted-foreground mt-3">
                                    Showing top 20 of {quizLeaderboard.length} participants
                                  </p>
                                )}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Quizzes Yet</h3>
                    <p className="text-muted-foreground">
                      {timeFilter === 'week' 
                        ? "You haven't completed any quizzes this week"
                        : timeFilter === 'month'
                        ? "You haven't completed any quizzes this month"
                        : "Start taking quizzes to see your rankings here"}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentLeaderboard;
