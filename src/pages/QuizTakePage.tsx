import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { QuizPlayer } from '@/components/quiz/QuizPlayer';
import { Button } from '@/components/ui/button';
import { quizService } from '@/services/quizzes';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Quiz, QuizAnswer } from '@/types/quiz';

const QuizTakePage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!quizId) {
        toast.error('Quiz not found');
        navigate('/quizzes');
        return;
      }

      try {
        const fetchedQuiz = await quizService.getQuizById(quizId);
        if (!fetchedQuiz) {
          toast.error('Quiz not found');
          navigate('/quizzes');
          return;
        }

        if (!fetchedQuiz.isPublished) {
          toast.error('This quiz is not available');
          navigate('/quizzes');
          return;
        }

        setQuiz(fetchedQuiz);

        // Start attempt if user is authenticated
        if (isAuthenticated && user?.id) {
          const attempt = await quizService.startAttempt(
            quizId,
            user.id,
            user.name || user.email || 'Anonymous'
          );
          setAttemptId(attempt.id);
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        toast.error('Failed to load quiz');
        navigate('/quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, navigate, isAuthenticated, user]);

  const handleComplete = async (answers: QuizAnswer[], timeTaken: number) => {
    if (!quiz || !attemptId) return;

    try {
      // Submit each answer
      for (const answer of answers) {
        await quizService.submitAnswer(attemptId, answer);
      }

      // Complete the attempt
      await quizService.completeAttempt(attemptId, timeTaken);

      toast.success('Quiz completed successfully!');
      
      // Navigate based on user role
      if (user?.role === 'student') {
        navigate('/student/quizzes');
      } else {
        navigate('/quizzes');
      }
    } catch (error) {
      console.error('Error completing quiz:', error);
      toast.error('Failed to save quiz results');
    }
  };

  const handleExit = () => {
    if (user?.role === 'student') {
      navigate('/student/quizzes');
    } else {
      navigate('/quizzes');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!quiz) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Quiz not found</p>
            <Button onClick={() => navigate('/quizzes')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <QuizPlayer
            quiz={quiz}
            onComplete={handleComplete}
            onExit={handleExit}
          />
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default QuizTakePage;
