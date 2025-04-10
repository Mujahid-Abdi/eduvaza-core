import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, FileQuestion, Users, Clock, Star, X, Trophy, Bookmark, BookmarkCheck, UserPlus, Play, Swords, Eye, MapPin, GraduationCap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { quizService } from '@/services/quizzes';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Quiz } from '@/types/quiz';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const QuizzesPage = () => {
  const { t } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [savedQuizIds, setSavedQuizIds] = useState<string[]>([]);
  const [registeredQuizIds, setRegisteredQuizIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingQuiz, setSavingQuiz] = useState<string | null>(null);
  const [registeringQuiz, setRegisteringQuiz] = useState<string | null>(null);
  
  // Quiz detail modal state
  const [showQuizDetail, setShowQuizDetail] = useState(false);
  const [selectedQuizDetail, setSelectedQuizDetail] = useState<Quiz | null>(null);

  // Get active mode from URL params (default to 'self-practice')
  const activeMode = searchParams.get('mode') || 'self-practice';

  const setActiveMode = (mode: string) => {
    setSearchParams({ mode });
  };

  // Fetch quizzes from Firebase
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        console.log('🔍 Fetching published quizzes from Firebase...');
        
        // Auto-convert expired multiplayer quizzes
        await quizService.convertExpiredMultiplayerQuizzes();
        
        const fetchedQuizzes = await quizService.getQuizzes();
        console.log('✅ Fetched', fetchedQuizzes.length, 'published quizzes');
        setQuizzes(fetchedQuizzes);
        
        // Fetch saved quizzes if user is logged in
        if (user?.id) {
          const fetchedSavedQuizIds = await quizService.getSavedQuizzes(user.id);
          setSavedQuizIds(fetchedSavedQuizIds);
          
          // Fetch registered quizzes
          const registeredIds: string[] = [];
          for (const quiz of fetchedQuizzes) {
            if (quiz.isMultiplayer && quiz.id) {
              const isRegistered = await quizService.isRegisteredForQuiz(quiz.id, user.id);
              if (isRegistered) {
                registeredIds.push(quiz.id);
              }
            }
          }
          setRegisteredQuizIds(registeredIds);
        }
      } catch (error) {
        console.error('❌ Error fetching quizzes:', error);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user]);

  const handleToggleSaveQuiz = async (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user?.id) {
      toast.error('Please login to save quizzes');
      navigate('/auth/login');
      return;
    }

    setSavingQuiz(quizId);
    try {
      const isSaved = savedQuizIds.includes(quizId);
      
      if (isSaved) {
        await quizService.unsaveQuiz(user.id, quizId);
        setSavedQuizIds(prev => prev.filter(id => id !== quizId));
        toast.success('Quiz removed from saved');
      } else {
        await quizService.saveQuizForLater(user.id, quizId);
        setSavedQuizIds(prev => [...prev, quizId]);
        toast.success('Quiz saved for later');
      }
    } catch (error) {
      console.error('Error toggling save quiz:', error);
      toast.error('Failed to save quiz');
    } finally {
      setSavingQuiz(null);
    }
  };

  // Filter quizzes based on mode
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
      const matchesLanguage = selectedLanguage === 'all' || quiz.language === selectedLanguage;
      
      // Filter by mode
      if (activeMode === 'multiplayer') {
        return matchesSearch && matchesDifficulty && matchesLanguage && quiz.isMultiplayer;
      }
      // Self-practice shows non-multiplayer quizzes
      return matchesSearch && matchesDifficulty && matchesLanguage && !quiz.isMultiplayer;
    });
  }, [quizzes, searchQuery, selectedDifficulty, selectedLanguage, activeMode]);

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

  const handleStartMultiplayerQuiz = (quiz: Quiz) => {
    if (!isAuthenticated) {
      toast.error('Please login to join multiplayer quizzes');
      navigate('/auth/login');
      return;
    }
    
    // Check if user is registered
    if (quiz.id && !registeredQuizIds.includes(quiz.id)) {
      toast.error('You must register for this quiz before joining');
      return;
    }
    
    // Check if quiz has started
    if (quiz.scheduledStartTime && new Date() < new Date(quiz.scheduledStartTime)) {
      toast.error('This quiz has not started yet');
      return;
    }
    
    navigate(`/quiz/${quiz.id}?mode=multiplayer`);
  };

  const handleStartSelfPractice = (quizId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login or register to take quizzes');
      navigate('/auth/login');
      return;
    }
    navigate(`/quiz/${quizId}`);
  };

  const handleViewQuizDetail = (quiz: Quiz, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedQuizDetail(quiz);
    setShowQuizDetail(true);
  };

  const handleRegisterForQuiz = async (quizId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!user?.id) {
      toast.error('Please login to register for quizzes');
      navigate('/auth/login');
      return;
    }

    setRegisteringQuiz(quizId);
    try {
      await quizService.registerForQuiz(quizId, user.id);
      setRegisteredQuizIds(prev => [...prev, quizId]);
      toast.success('Successfully registered for the quiz!');
      
      // Refresh quiz data to update registered count
      const updatedQuiz = await quizService.getQuizById(quizId);
      if (updatedQuiz) {
        setQuizzes(prev => prev.map(q => q.id === quizId ? updatedQuiz : q));
        if (selectedQuizDetail?.id === quizId) {
          setSelectedQuizDetail(updatedQuiz);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to register for quiz');
    } finally {
      setRegisteringQuiz(null);
    }
  };

  const handleUnregisterFromQuiz = async (quizId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!user?.id) return;

    setRegisteringQuiz(quizId);
    try {
      await quizService.unregisterFromQuiz(quizId, user.id);
      setRegisteredQuizIds(prev => prev.filter(id => id !== quizId));
      toast.success('Unregistered from the quiz');
      
      // Refresh quiz data
      const updatedQuiz = await quizService.getQuizById(quizId);
      if (updatedQuiz) {
        setQuizzes(prev => prev.map(q => q.id === quizId ? updatedQuiz : q));
        if (selectedQuizDetail?.id === quizId) {
          setSelectedQuizDetail(updatedQuiz);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to unregister from quiz');
    } finally {
      setRegisteringQuiz(null);
    }
  };

  const renderQuizCard = (quiz: Quiz, index: number) => {
    const isMultiplayer = activeMode === 'multiplayer';
    const isRegistered = quiz.id ? registeredQuizIds.includes(quiz.id) : false;
    const hasStarted = quiz.scheduledStartTime ? new Date() >= new Date(quiz.scheduledStartTime) : false;
    const registrationOpen = quiz.registrationDeadline ? new Date() < new Date(quiz.registrationDeadline) : true;
    const canJoin = isMultiplayer && isRegistered && hasStarted;
    const canRegister = isMultiplayer && !isRegistered && registrationOpen && !hasStarted;
    
    return (
      <motion.div
        key={quiz.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group h-full flex flex-col">
          <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={getDifficultyColor(quiz.difficulty)}>
                {quiz.difficulty}
              </Badge>
              {quiz.isMultiplayer && (
                <Badge variant="secondary">
                  <Trophy className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              )}
              {isRegistered && (
                <Badge variant="default" className="bg-green-500">
                  <UserPlus className="h-3 w-3 mr-1" />
                  Registered
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {quiz.language.toUpperCase()}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {quiz.questions.length} questions
              </Badge>
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => handleToggleSaveQuiz(quiz.id!, e)}
                  disabled={savingQuiz === quiz.id}
                  className="h-7 w-7 p-0 ml-auto"
                >
                  {savedQuizIds.includes(quiz.id!) ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors flex-1">
              {quiz.title}
            </h3>
            <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-muted-foreground pb-3 border-b border-border gap-2">
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
            </div>
            
            {/* Multiplayer Schedule Info */}
            {isMultiplayer && quiz.scheduledStartTime && (
              <div className="mt-3 p-2 bg-muted/50 rounded-md text-xs">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                  <span>Starts: {new Date(quiz.scheduledStartTime).toLocaleString()}</span>
                </div>
                {quiz.registrationDeadline && (
                  <div className="flex items-center gap-1 text-warning">
                    <UserPlus className="h-3 w-3" />
                    <span>Register by: {new Date(quiz.registrationDeadline).toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-2 mt-3">
              <Button 
                className="flex-1" 
                variant="outline"
                size="sm"
                onClick={(e) => handleViewQuizDetail(quiz, e)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              
              {isMultiplayer ? (
                canRegister ? (
                  <Button 
                    className="flex-1" 
                    variant="default"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isAuthenticated) {
                        toast.error('Please login to register');
                        navigate('/auth/login');
                      } else {
                        handleRegisterForQuiz(quiz.id!, e);
                      }
                    }}
                    disabled={registeringQuiz === quiz.id}
                  >
                    <UserPlus className="h-4 w-4 mr-1" />
                    {registeringQuiz === quiz.id ? 'Registering...' : 'Register'}
                  </Button>
                ) : canJoin ? (
                  <Button 
                    className="flex-1" 
                    variant="default"
                    size="sm"
                    onClick={() => handleStartMultiplayerQuiz(quiz)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Join
                  </Button>
                ) : (
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    size="sm"
                    disabled
                  >
                    {!registrationOpen ? 'Registration Closed' : !hasStarted ? 'Not Started' : 'Unavailable'}
                  </Button>
                )
              ) : (
                <Button 
                  className="flex-1" 
                  variant="default"
                  size="sm"
                  onClick={() => handleStartSelfPractice(quiz.id!)}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-hero py-8 sm:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t('quiz.exploreQuizzes')}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              {t('quiz.testKnowledge')}
            </p>
            
            {/* Mode Selector */}
            <div className="flex justify-center gap-4 mb-6">
              <Button
                variant={activeMode === 'self-practice' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setActiveMode('self-practice')}
                className="flex-1 max-w-[200px]"
              >
                <FileQuestion className="h-5 w-5 mr-2" />
                Self Practice
              </Button>
              <Button
                variant={activeMode === 'multiplayer' ? 'default' : 'outline'}
                size="lg"
                onClick={() => setActiveMode('multiplayer')}
                className="flex-1 max-w-[200px]"
              >
                <Swords className="h-5 w-5 mr-2" />
                Multiplayer
              </Button>
            </div>

            {/* Mode Description */}
            <div className="mb-6 sm:mb-8">
              {activeMode === 'self-practice' ? (
                <p className="text-sm text-muted-foreground">
                  Practice at your own pace. Login required to start.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Compete with others in real-time. Login and register before the deadline to join.
                </p>
              )}
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={`Search ${activeMode === 'multiplayer' ? 'multiplayer' : ''} quizzes...`}
                className="pl-14 pr-4 h-12 sm:h-14 text-base sm:text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            {hasActiveFilters && (
              <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 justify-center">
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
      <section className="py-8 sm:py-16">
        <div className="container mx-auto px-4">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8">
            {/* Difficulty Filter */}
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full sm:w-[160px] transition-all hover:shadow-md hover:border-primary">
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
              <SelectTrigger className="w-full sm:w-[150px] transition-all hover:shadow-md hover:border-primary">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="sw">Swahili</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="am">Amharic</SelectItem>
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
                Clear
              </Button>
            )}

            {/* Results Count */}
            <div className="ml-auto text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredQuizzes.length}</span> quiz{filteredQuizzes.length !== 1 ? 'zes' : ''}
            </div>
          </div>

          {/* Quizzes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredQuizzes.map((quiz, index) => renderQuizCard(quiz, index))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              {activeMode === 'multiplayer' ? (
                <Swords className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              ) : (
                <FileQuestion className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              )}
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No {activeMode === 'multiplayer' ? 'multiplayer ' : ''}quizzes found
              </h3>
              <p className="text-muted-foreground mb-4">
                {activeMode === 'multiplayer' 
                  ? 'No live multiplayer quizzes are available right now. Check back later!'
                  : 'Try adjusting your search or filters'}
              </p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Quiz Detail Dialog */}
      <Dialog open={showQuizDetail} onOpenChange={setShowQuizDetail}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedQuizDetail?.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Detailed information about the quiz
            </DialogDescription>
          </DialogHeader>
          
          {selectedQuizDetail && (
            <div className="space-y-6 py-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={getDifficultyColor(selectedQuizDetail.difficulty)}>
                  {selectedQuizDetail.difficulty}
                </Badge>
                {selectedQuizDetail.isMultiplayer && (
                  <Badge variant="secondary">
                    <Trophy className="h-3 w-3 mr-1" />
                    Multiplayer
                  </Badge>
                )}
                <Badge variant="outline">
                  {selectedQuizDetail.language.toUpperCase()}
                </Badge>
              </div>

              {/* Multiplayer Schedule Info */}
              {selectedQuizDetail.isMultiplayer && selectedQuizDetail.scheduledStartTime && (
                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Scheduled Event
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Start Time</p>
                        <p className="font-semibold">
                          {new Date(selectedQuizDetail.scheduledStartTime).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">End Time</p>
                        <p className="font-semibold">
                          {selectedQuizDetail.scheduledEndTime 
                            ? new Date(selectedQuizDetail.scheduledEndTime).toLocaleString()
                            : 'Not set'}
                        </p>
                      </div>
                      {selectedQuizDetail.registrationDeadline && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground">Registration Deadline</p>
                          <p className="font-semibold text-warning">
                            {new Date(selectedQuizDetail.registrationDeadline).toLocaleString()}
                          </p>
                        </div>
                      )}
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Registered Students</p>
                        <p className="font-semibold text-primary">
                          {(selectedQuizDetail.registeredStudents || []).length}
                          {selectedQuizDetail.maxParticipants && ` / ${selectedQuizDetail.maxParticipants}`}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {selectedQuizDetail.description || 'No description available'}
                </p>
              </div>

              {/* Star Rating */}
              <div>
                <h3 className="font-semibold mb-2">Rating</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star 
                        key={star} 
                        className={`h-5 w-5 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">4.0</span>
                  <span className="text-sm text-muted-foreground">(245 reviews)</span>
                </div>
              </div>

              {/* Quiz Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileQuestion className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{selectedQuizDetail.questions.length}</p>
                        <p className="text-xs text-muted-foreground">Questions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Clock className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{selectedQuizDetail.timeLimit || 'No'}</p>
                        <p className="text-xs text-muted-foreground">{selectedQuizDetail.timeLimit ? 'Minutes' : 'Limit'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-500/10">
                        <Trophy className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{selectedQuizDetail.totalPoints}</p>
                        <p className="text-xs text-muted-foreground">Total Points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Users className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {selectedQuizDetail.isMultiplayer 
                            ? (selectedQuizDetail.registeredStudents || []).length
                            : '1.2k'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedQuizDetail.isMultiplayer ? 'Registered' : 'Students'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Teacher/School Info */}
              <div>
                <h3 className="font-semibold mb-3">Created By</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-full bg-primary/10">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{selectedQuizDetail.teacherName}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>United States 🇺🇸</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Professional educator with 5+ years of experience
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t">
                {/* Registration Button for Multiplayer - Only show if before deadline AND before start time */}
                {selectedQuizDetail.isMultiplayer && 
                 selectedQuizDetail.registrationDeadline && 
                 new Date() < new Date(selectedQuizDetail.registrationDeadline) &&
                 (!selectedQuizDetail.scheduledStartTime || new Date() < new Date(selectedQuizDetail.scheduledStartTime)) && (
                  <div className="flex gap-3">
                    {isAuthenticated ? (
                      registeredQuizIds.includes(selectedQuizDetail.id!) ? (
                        <Button
                          variant="outline"
                          onClick={(e) => handleUnregisterFromQuiz(selectedQuizDetail.id!, e)}
                          disabled={registeringQuiz === selectedQuizDetail.id}
                          className="flex-1"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          {registeringQuiz === selectedQuizDetail.id ? 'Processing...' : 'Unregister'}
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) => handleRegisterForQuiz(selectedQuizDetail.id!, e)}
                          disabled={registeringQuiz === selectedQuizDetail.id}
                          className="flex-1"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          {registeringQuiz === selectedQuizDetail.id ? 'Registering...' : 'Register Now'}
                        </Button>
                      )
                    ) : (
                      <Button
                        onClick={() => {
                          setShowQuizDetail(false);
                          navigate('/auth/login');
                        }}
                        className="flex-1"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Login to Register
                      </Button>
                    )}
                  </div>
                )}

                {/* Save and Start Buttons */}
                <div className="flex gap-3">
                  {isAuthenticated && (
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSaveQuiz(selectedQuizDetail.id!, e);
                      }}
                      disabled={savingQuiz === selectedQuizDetail.id}
                      className="flex-1"
                    >
                      {savedQuizIds.includes(selectedQuizDetail.id!) ? (
                        <>
                          <BookmarkCheck className="h-4 w-4 mr-2" />
                          Saved
                        </>
                      ) : (
                        <>
                          <Bookmark className="h-4 w-4 mr-2" />
                          Save for Later
                        </>
                      )}
                    </Button>
                  )}
                  
                  {/* Start/Join Button - Only show if not multiplayer or if registered/started */}
                  {(!selectedQuizDetail.isMultiplayer || 
                    registeredQuizIds.includes(selectedQuizDetail.id!) ||
                    (selectedQuizDetail.scheduledStartTime && new Date() >= new Date(selectedQuizDetail.scheduledStartTime))) && (
                    <Button 
                      className="flex-1" 
                      onClick={() => {
                        setShowQuizDetail(false);
                        if (selectedQuizDetail.isMultiplayer) {
                          handleStartMultiplayerQuiz(selectedQuizDetail);
                        } else {
                          handleStartSelfPractice(selectedQuizDetail.id!);
                        }
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {selectedQuizDetail.isMultiplayer ? 'Join Game' : 'Start Quiz'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default QuizzesPage;
