import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Trophy, Clock, Users, Play, Star, TrendingUp, Award, Target } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { mockQuizzes } from '@/services/mockQuizData';
import { useAuth } from '@/contexts/AuthContext';

const QuizzesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuizzes = mockQuizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredQuizzes = filteredQuizzes.slice(0, 3);
  const popularQuizzes = filteredQuizzes.slice(0, 6);
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

  const getQuizLink = (quizId: string) => {
    if (!isAuthenticated) return '/auth/login';
    if (user?.role === 'student') return `/student/quiz/${quizId}`;
    if (user?.role === 'teacher') return `/teacher/quizzes`;
    return '/auth/login';
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Trophy className="h-4 w-4" />
              Test Your Knowledge
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Explore Quizzes
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Challenge yourself with interactive quizzes across various subjects. Track your progress and compete with others!
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for quizzes..."
                className="pl-12 pr-4 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {!isAuthenticated && (
              <div className="mt-8 flex gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth/register">Sign Up to Take Quizzes</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth/login">Login</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                <Trophy className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-foreground">{filteredQuizzes.length}+</p>
              <p className="text-sm text-muted-foreground">Total Quizzes</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10 text-secondary mb-3">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-foreground">12K+</p>
              <p className="text-sm text-muted-foreground">Participants</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-foreground">15m</p>
              <p className="text-sm text-muted-foreground">Avg. Duration</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-warning/10 text-warning mb-3">
                <Award className="h-6 w-6" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {filteredQuizzes.reduce((sum, q) => sum + q.totalPoints, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Quizzes */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Quizzes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Popular quizzes chosen by our community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                    <div className="text-6xl">🎯</div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-yellow-500 text-white">Featured</Badge>
                    </div>
                    <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-background" fill="currentColor" />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {quiz.description}
                    </p>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className={getDifficultyColor(quiz.totalPoints)}>
                        {getDifficultyLabel(quiz.totalPoints)}
                      </Badge>
                      <Badge variant="secondary">{quiz.language.toUpperCase()}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {quiz.totalPoints} pts
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quiz.timeLimit || quiz.questions.length * 2} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {quiz.questions.length} Qs
                      </span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link to={getQuizLink(quiz.id)}>
                        {isAuthenticated ? 'Take Quiz' : 'Login to Take Quiz'}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Quizzes */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all">
            <div className="flex items-center justify-between mb-8">
              <TabsList>
                <TabsTrigger value="all">All Quizzes</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            <TabsContent value="all">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer h-full">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                        <div className="text-5xl">📝</div>
                        <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-10 w-10 text-background" fill="currentColor" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {quiz.description}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(quiz.totalPoints)}`}>
                            {getDifficultyLabel(quiz.totalPoints)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3" />
                            {quiz.totalPoints}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {quiz.timeLimit || quiz.questions.length * 2}m
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary font-bold text-lg flex-shrink-0">
                            #{index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground line-clamp-1">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{quiz.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(quiz.totalPoints)}`}>
                            {getDifficultyLabel(quiz.totalPoints)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {quiz.totalPoints} points
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <div className="grid md:grid-cols-2 gap-6">
                {recentQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-lg transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
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
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students challenging themselves and improving their skills every day.
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="secondary" size="lg" asChild>
                <Link to="/auth/register">Sign Up Free</Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                <Link to="/auth/login">Login</Link>
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="lg" asChild>
              <Link to={user?.role === 'student' ? '/student/quiz-explore' : '/teacher/quizzes'}>
                Go to My Quizzes
              </Link>
            </Button>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default QuizzesPage;
