import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Search, Filter, FileQuestion, Users, Clock, Star, X, Trophy } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { quizService } from '@/services/quizzes';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Quiz } from '@/types/quiz';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const QuizzesPage = () => {
  const { t } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  // Only redirect admin to dashboard, other users can see public pages
  if (isAuthenticated && user?.role === 'super_admin') {
    return <Navigate to="/admin" replace />;
  }

  // Fetch quizzes from Firebase
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const fetchedQuizzes = await quizService.getQuizzes();
        setQuizzes(fetchedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
      const matchesLanguage = selectedLanguage === 'all' || quiz.language === selectedLanguage;
      return matchesSearch && matchesDifficulty && matchesLanguage;
    });
  }, [quizzes, searchQuery, selectedDifficulty, selectedLanguage]);

  const hasActiveFilters = selectedDifficulty !== 'all' || selectedLanguage !== 'all';

  const clearFilters = () => {
    setSelectedDifficulty('all');
    setSelectedLanguage('all');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const featuredQuizzes = filteredQuizzes.slice(0, 3);
  const popularQuizzes = filteredQuizzes.slice(0, 6);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explore Quizzes
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Test your knowledge with interactive quizzes. Challenge yourself and compete with others.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search for quizzes..."
                className="pl-14 pr-4 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            {hasActiveFilters && (
              <div className="mt-6 flex flex-wrap items-center gap-2 justify-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedDifficulty !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedDifficulty}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedDifficulty('all')} />
                  </Badge>
                )}
                {selectedLanguage !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLanguage.toUpperCase()}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLanguage('all')} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quizzes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all">
            {/* Combined Filter Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {/* View Tabs */}
              <TabsList>
                <TabsTrigger value="all">All Quizzes</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-[160px] transition-all hover:shadow-md hover:border-primary">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>

              {/* Language Filter */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[150px] transition-all hover:shadow-md hover:border-primary">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="gap-2 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}

              {/* Results Count */}
              <div className="ml-auto text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredQuizzes.length}</span> quiz{filteredQuizzes.length !== 1 ? 'zes' : ''}
              </div>
            </div>

            <TabsContent value="all">
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-video bg-muted animate-pulse" />
                      <CardContent className="p-5">
                        <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredQuizzes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQuizzes.map((quiz, index) => (
                    <motion.div
                      key={quiz.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden flex items-center justify-center">
                          <FileQuestion className="h-20 w-20 text-primary/40" />
                          <div className="absolute top-3 right-3">
                            <Badge className={getDifficultyColor(quiz.difficulty)}>
                              {quiz.difficulty}
                            </Badge>
                          </div>
                          {quiz.isMultiplayer && (
                            <div className="absolute top-3 left-3">
                              <Badge variant="secondary">
                                <Trophy className="h-3 w-3 mr-1" />
                                Multiplayer
                              </Badge>
                            </div>
                          )}
                        </div>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline" className="text-xs">
                              {quiz.language.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {quiz.questions.length} questions
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {quiz.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {quiz.description}
                          </p>
                          <div className="flex items-center gap-1 mb-4">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <Star className="h-4 w-4 fill-gray-300 text-gray-300" />
                            <span className="text-sm text-muted-foreground ml-2">4.0</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                            <div className="flex items-center gap-1">
                              <FileQuestion className="h-4 w-4" />
                              <span>{quiz.totalPoints} pts</span>
                            </div>
                            {quiz.timeLimit && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{quiz.timeLimit}m</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>By {quiz.teacherName}</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4" variant="outline">
                            Start Quiz
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <FileQuestion className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No quizzes found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid md:grid-cols-3 gap-6">
                {featuredQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                      <div className="aspect-video bg-gradient-to-br from-yellow-500/20 to-orange-500/20 relative overflow-hidden flex items-center justify-center">
                        <FileQuestion className="h-20 w-20 text-yellow-500/40" />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-yellow-500 text-white">Featured</Badge>
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {quiz.description}
                        </p>
                        <Button className="w-full" variant="outline">
                          Start Quiz
                        </Button>
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
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
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
                          <Badge variant="outline" className="text-xs">{quiz.difficulty}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {quiz.questions.length} questions
                          </span>
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Test Your Knowledge?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of students already learning on EduVaza</p>
          <Button variant="secondary" size="lg">
            Get Started Today
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default QuizzesPage;
