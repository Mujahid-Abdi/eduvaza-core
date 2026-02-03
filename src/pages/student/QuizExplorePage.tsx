import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, Trophy, Users, Play, Star, TrendingUp, Award, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockQuizzes } from '@/services/mockQuizData';

export const QuizExplorePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter quizzes
  const filteredQuizzes = mockQuizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Categorize quizzes
  const featuredQuizzes = filteredQuizzes.slice(0, 3);
  const popularQuizzes = filteredQuizzes.filter(q => q.id !== featuredQuizzes[0]?.id).slice(0, 6);
  const recentQuizzes = filteredQuizzes.slice(0, 8);

  const getDifficultyColor = (points: number) => {
    if (points >= 100) return 'bg-red-500';
    if (points >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getDifficultyLabel = (points: number) => {
    if (points >= 100) return 'Hard';
    if (points >= 50) return 'Medium';
    return 'Easy';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Explore Quizzes</h1>
            <p className="text-muted-foreground">Challenge yourself and test your knowledge</p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search quizzes by title or topic..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <CardTitle>Featured Quizzes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {featuredQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="relative rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                    onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                  >
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="bg-yellow-500 text-white">Featured</Badge>
                    </div>
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                      <div className="text-6xl">🎯</div>
                      <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-background" fill="currentColor" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-1">{quiz.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{quiz.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="outline" className={getDifficultyColor(quiz.totalPoints)}>
                          {getDifficultyLabel(quiz.totalPoints)}
                        </Badge>
                        <Badge variant="secondary">{quiz.language.toUpperCase()}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {quiz.totalPoints} pts
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {quiz.timeLimit || quiz.questions.length * 2} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {quiz.questions.length} Qs
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Quizzes</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>

            {/* All Quizzes */}
            <TabsContent value="all" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all group cursor-pointer"
                        onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                      >
                        <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                          <div className="text-5xl">📝</div>
                          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-10 w-10 text-background" fill="currentColor" />
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground line-clamp-1">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{quiz.description}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className={getDifficultyColor(quiz.totalPoints)}>
                              {getDifficultyLabel(quiz.totalPoints)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Trophy className="h-3 w-3" />
                              {quiz.totalPoints} pts
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {quiz.timeLimit || quiz.questions.length * 2} min
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Popular Quizzes */}
            <TabsContent value="popular" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>Most Popular</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {popularQuizzes.map((quiz, index) => (
                      <div
                        key={quiz.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                      >
                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary font-bold text-lg flex-shrink-0">
                          #{index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{quiz.description}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className={`text-xs ${getDifficultyColor(quiz.totalPoints)}`}>
                              {getDifficultyLabel(quiz.totalPoints)}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Trophy className="h-3 w-3" />
                              {quiz.totalPoints} points
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {quiz.timeLimit || quiz.questions.length * 2} min
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Quizzes */}
            <TabsContent value="recent" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recently Added</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {recentQuizzes.map((quiz) => (
                      <div
                        key={quiz.id}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors group cursor-pointer"
                        onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                      >
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl flex-shrink-0">
                          📝
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground line-clamp-1">{quiz.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{quiz.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={`text-xs ${getDifficultyColor(quiz.totalPoints)}`}>
                              {getDifficultyLabel(quiz.totalPoints)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {quiz.questions.length} questions
                            </span>
                          </div>
                        </div>
                        <Play className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Quizzes</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{filteredQuizzes.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Duration</p>
                  <p className="text-3xl font-bold text-foreground mt-1">15m</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {filteredQuizzes.reduce((sum, q) => sum + q.totalPoints, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-accent/10">
                  <Award className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default QuizExplorePage;
