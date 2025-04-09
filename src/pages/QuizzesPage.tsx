import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, FileQuestion, Users, Clock, Star, X, Trophy, Bookmark, BookmarkCheck, UserPlus, Play, Swords } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [savingQuiz, setSavingQuiz] = useState<string | null>(null);
  
  // Multiplayer registration state
  const [showMultiplayerRegister, setShowMultiplayerRegister] = useState(false);
  const [multiplayerName, setMultiplayerName] = useState('');
  const [selectedMultiplayerQuiz, setSelectedMultiplayerQuiz] = useState<Quiz | null>(null);

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
        const fetchedQuizzes = await quizService.getQuizzes();
        console.log('✅ Fetched', fetchedQuizzes.length, 'published quizzes');
        setQuizzes(fetchedQuizzes);
        
        // Fetch saved quizzes if user is logged in
        if (user?.id) {
          const fetchedSavedQuizIds = await quizService.getSavedQuizzes(user.id);
          setSavedQuizIds(fetchedSavedQuizIds);
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
      setSelectedMultiplayerQuiz(quiz);
      setShowMultiplayerRegister(true);
    } else {
      navigate(`/quiz/${quiz.id}?mode=multiplayer`);
    }
  };

  const handleMultiplayerRegister = () => {
    if (!multiplayerName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    // Store guest name in session storage for multiplayer
    sessionStorage.setItem('multiplayerGuestName', multiplayerName.trim());
    toast.success(`Welcome, ${multiplayerName}! Joining the quiz...`);
    setShowMultiplayerRegister(false);
    
    if (selectedMultiplayerQuiz) {
      navigate(`/quiz/${selectedMultiplayerQuiz.id}?mode=multiplayer&guest=${encodeURIComponent(multiplayerName.trim())}`);
    }
  };

  const handleStartSelfPractice = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  const renderQuizCard = (quiz: Quiz, index: number) => {
    const isMultiplayer = activeMode === 'multiplayer';
    
    return (
      <motion.div
        key={quiz.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group h-full flex flex-col">
          <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden flex items-center justify-center">
            {isMultiplayer ? (
              <Swords className="h-16 w-16 sm:h-20 sm:w-20 text-primary/40" />
            ) : (
              <FileQuestion className="h-16 w-16 sm:h-20 sm:w-20 text-primary/40" />
            )}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
              <Badge className={getDifficultyColor(quiz.difficulty)}>
                {quiz.difficulty}
              </Badge>
            </div>
            {quiz.isMultiplayer && (
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                <Badge variant="secondary">
                  <Trophy className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
            )}
            {isAuthenticated && (
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => handleToggleSaveQuiz(quiz.id!, e)}
                  disabled={savingQuiz === quiz.id}
                  className="h-8 w-8 p-0"
                >
                  {savedQuizIds.includes(quiz.id!) ? (
                    <BookmarkCheck className="h-4 w-4" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
          <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs">
                {quiz.language.toUpperCase()}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {quiz.questions.length} questions
              </Badge>
            </div>
            <h3 className="font-semibold text-base sm:text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {quiz.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
              {quiz.description}
            </p>
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}`} 
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">4.0</span>
            </div>
            <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-muted-foreground pt-4 border-t border-border gap-2">
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
                <span className="truncate max-w-[80px]">{quiz.teacherName}</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              variant={isMultiplayer ? "default" : "outline"}
              onClick={() => isMultiplayer ? handleStartMultiplayerQuiz(quiz) : handleStartSelfPractice(quiz.id!)}
            >
              {isMultiplayer ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Join Game
                </>
              ) : (
                'Start Quiz'
              )}
            </Button>
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
                  Practice at your own pace. No registration required.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Compete with others in real-time. Registration required to join.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Multiplayer Registration Dialog */}
      <Dialog open={showMultiplayerRegister} onOpenChange={setShowMultiplayerRegister}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Join Multiplayer Quiz
            </DialogTitle>
            <DialogDescription>
              Enter your name to join the game. You'll compete with other players in real-time!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="playerName">Your Name</Label>
              <Input
                id="playerName"
                placeholder="Enter your display name"
                value={multiplayerName}
                onChange={(e) => setMultiplayerName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMultiplayerRegister()}
              />
            </div>
            {selectedMultiplayerQuiz && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold">{selectedMultiplayerQuiz.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedMultiplayerQuiz.questions.length} questions • {selectedMultiplayerQuiz.timeLimit}min
                  </p>
                </CardContent>
              </Card>
            )}
            <p className="text-xs text-muted-foreground">
              Already have an account? <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link> for better tracking.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMultiplayerRegister(false)}>
              Cancel
            </Button>
            <Button onClick={handleMultiplayerRegister}>
              <Play className="h-4 w-4 mr-2" />
              Join Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default QuizzesPage;
