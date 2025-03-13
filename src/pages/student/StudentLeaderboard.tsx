import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, ChevronDown, ChevronUp, Calendar, TrendingUp, Award, Target } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { quizService } from '@/services/quizzes';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { toast } from 'sonner';
import type { Quiz, QuizAttempt } from '@/types/quiz';

interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  score: number;
  percentage: number;
  timeTaken: number;
  completedAt: Date;
  rank: number;
}

export const StudentLeaderboard = () => {
  const { user } = useAuth();
  const { t } = useI18n();
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('all');
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizLeaderboards, setQuizLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({});

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const [fetchedQuizzes, fetchedAttempts] = await Promise.all([
          quizService.getQuizzes(),
          quizService.getAttemptsByStudent(user.id),
        ]);

        setQuizzes(fetchedQuizzes);
        setAttempts(fetchedAttempts);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load leaderboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Get quizzes the student has participated in
  const studentQuizzes = attempts
    .filter(attempt => attempt.status === 'completed')
    .map(attempt => {
      const quiz = quizzes.find(q => q.id === attempt.quizId);
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

  // Fetch leaderboard for a specific quiz
  const fetchQuizLeaderboard = async (quizId: string) => {
    if (quizLeaderboards[quizId]) return; // Already fetched

    try {
      const allAttempts = await quizService.getAttemptsByQuiz(quizId);
      
      // Get only completed attempts and sort by score
      const completedAttempts = allAttempts
        .filter(attempt => attempt.status === 'completed')
        .sort((a, b) => {
          // Sort by score (descending), then by time taken (ascending)
          if (b.score !== a.score) return b.score - a.score;
          return a.timeTaken - b.timeTaken;
        });

      // Create leaderboard entries with ranks
      const leaderboard: LeaderboardEntry[] = completedAttempts.map((attempt, index) => ({
        studentId: attempt.studentId,
        studentName: attempt.studentName,
        score: attempt.score,
        percentage: attempt.percentage,
        timeTaken: attempt.timeTaken,
        completedAt: attempt.completedAt || new Date(),
        rank: index + 1,
      }));

      setQuizLeaderboards(prev => ({
        ...prev,
        [quizId]: leaderboard,
      }));
    } catch (error) {
      console.error('Error fetching quiz leaderboard:', error);
    }
  };

  // Fetch leaderboard when quiz is expanded
  useEffect(() => {
    if (expandedQuiz) {
      fetchQuizLeaderboard(expandedQuiz);
    }
  }, [expandedQuiz]);

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

  const LeaderboardEntry = ({ entry, isCurrentUser = false }: { entry: LeaderboardEntry, isCurrentUser?: boolean }) => (
    <div className={`flex items-center gap-4 p-3 rounded-lg ${isCurrentUser ? 'bg-primary/10 border-2 border-primary' : 'bg-muted/30'}`}>
      <div className="w-10 flex items-center justify-center">
        {getRankIcon(entry.rank)}
      </div>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs">{entry.studentName?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">
          {entry.studentName} {isCurrentUser && <Badge variant="secondary" className="ml-2">You</Badge>}
        </p>
        <p className="text-xs text-muted-foreground">
          {Math.floor(entry.timeTaken / 60)}:{(entry.timeTaken % 60).toString().padStart(2, '0')} time
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{entry.score}</p>
        <p className="text-xs text-muted-foreground">points</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold">{entry.percentage}%</p>
        <p className="text-xs text-muted-foreground">score</p>
      </div>
    </div>
  );

  // Calculate overall stats
  const totalQuizzes = filteredQuizzes.length;
  const averageScore = totalQuizzes > 0
    ? Math.round(filteredQuizzes.reduce((sum, q) => sum + q.attempt.percentage, 0) / totalQuizzes)
    : 0;

  // Calculate top ranks by fetching leaderboards
  const calculateTopRanks = () => {
    let topRanksCount = 0;
    filteredQuizzes.forEach(quiz => {
      const leaderboard = quizLeaderboards[quiz.id!];
      if (leaderboard) {
        const userEntry = leaderboard.find(entry => entry.studentId === user?.id);
        if (userEntry && userEntry.rank <= 3) {
          topRanksCount++;
        }
      }
    });
    return topRanksCount;
  };

  const topRanks = calculateTopRanks();

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
              {loading ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading leaderboard...</p>
                  </CardContent>
                </Card>
              ) : filteredQuizzes.length > 0 ? (
                <div className="space-y-3">
                  {filteredQuizzes.map((quiz, index) => {
                    if (!quiz || !quiz.id) return null;

                    const quizLeaderboard = quizLeaderboards[quiz.id] || [];
                    const currentUserEntry = quizLeaderboard.find(entry => entry.studentId === user?.id);
                    const isExpanded = expandedQuiz === quiz.id;
                    const completedDate = quiz.attempt.completedAt
                      ? new Date(quiz.attempt.completedAt).toLocaleDateString()
                      : 'N/A';

                    // Calculate rank from leaderboard if available
                    const displayRank = currentUserEntry?.rank || quiz.attempt.rank || 0;

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
                                    displayRank === 1 ? 'bg-yellow-500/20' :
                                    displayRank === 2 ? 'bg-gray-400/20' :
                                    displayRank === 3 ? 'bg-amber-600/20' :
                                    'bg-primary/10'
                                  }`}>
                                    <div className="flex flex-col items-center">
                                      {displayRank && displayRank <= 3 ? (
                                        <Medal className={`h-8 w-8 ${getRankColor(displayRank)}`} />
                                      ) : (
                                        <Trophy className="h-8 w-8 text-primary" />
                                      )}
                                      <p className={`text-xl font-bold mt-1 ${getRankColor(displayRank || 0)}`}>
                                        {displayRank ? `#${displayRank}` : 'N/A'}
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
                                      {displayRank && displayRank <= 10 && (
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
                              {quizLeaderboard.length > 0 ? (
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
                                        isCurrentUser={entry.studentId === user?.id}
                                      />
                                    ))}
                                  </div>

                                  {quizLeaderboard.length > 20 && (
                                    <p className="text-xs text-center text-muted-foreground mt-3">
                                      Showing top 20 of {quizLeaderboard.length} participants
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                                  <p className="text-sm text-muted-foreground">Loading leaderboard...</p>
                                </div>
                              )}
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
