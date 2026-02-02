import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { Quiz, Question, QuizAnswer } from '@/types/quiz';

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete: (answers: QuizAnswer[], timeTaken: number) => void;
  onExit: () => void;
}

export const QuizPlayer = ({ quiz, onComplete, onExit }: QuizPlayerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : 0);
  const [questionTime, setQuestionTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;

  // Main timer
  useEffect(() => {
    if (quiz.timeLimit && timeRemaining > 0 && !isCompleted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining, isCompleted]);

  // Question timer
  useEffect(() => {
    if (!isCompleted) {
      const timer = setInterval(() => {
        setQuestionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, isCompleted]);

  const handleAutoSubmit = useCallback(() => {
    // Submit all remaining questions as unanswered
    const remainingAnswers: QuizAnswer[] = [];
    for (let i = currentIndex; i < quiz.questions.length; i++) {
      remainingAnswers.push({
        questionId: quiz.questions[i].id,
        isCorrect: false,
        pointsEarned: 0,
        timeTaken: 0,
      });
    }
    const allAnswers = [...answers, ...remainingAnswers];
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    setIsCompleted(true);
    onComplete(allAnswers, timeTaken);
  }, [answers, currentIndex, quiz.questions, startTime, onComplete]);

  const checkAnswer = (): { isCorrect: boolean; pointsEarned: number } => {
    const question = currentQuestion;
    
    if (question.type === 'short_answer') {
      const isCorrect = textAnswer.toLowerCase().trim() === question.correctAnswer?.toLowerCase().trim();
      return { isCorrect, pointsEarned: isCorrect ? question.points : 0 };
    }
    
    const selectedOption = question.options?.find(o => o.id === selectedAnswer);
    const isCorrect = selectedOption?.isCorrect || false;
    return { isCorrect, pointsEarned: isCorrect ? question.points : 0 };
  };

  const submitAnswer = () => {
    const { isCorrect, pointsEarned } = checkAnswer();
    
    const answer: QuizAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: selectedAnswer || undefined,
      textAnswer: textAnswer || undefined,
      isCorrect,
      pointsEarned,
      timeTaken: questionTime,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setShowResult(true);

    setTimeout(() => {
      if (currentIndex < quiz.questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTextAnswer('');
        setQuestionTime(0);
        setShowResult(false);
      } else {
        setIsCompleted(true);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        onComplete(newAnswers, timeTaken);
      }
    }, quiz.showResults ? 1500 : 500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalScore = answers.reduce((sum, a) => sum + a.pointsEarned, 0);
  const maxScore = quiz.totalPoints;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card className="overflow-hidden">
          <div className={`p-8 text-center ${percentage >= quiz.passingScore ? 'bg-success/10' : 'bg-destructive/10'}`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              {percentage >= quiz.passingScore ? (
                <Trophy className="h-16 w-16 mx-auto text-success mb-4" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
              )}
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">
              {percentage >= quiz.passingScore ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-muted-foreground">
              {percentage >= quiz.passingScore 
                ? 'You passed the quiz!' 
                : `You need ${quiz.passingScore}% to pass.`}
            </p>
          </div>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="text-5xl font-bold text-foreground"
              >
                {percentage}%
              </motion.div>
              <p className="text-muted-foreground">
                {totalScore} / {maxScore} points
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-4 border-y">
              <div>
                <p className="text-2xl font-bold text-success">
                  {answers.filter(a => a.isCorrect).length}
                </p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {answers.filter(a => !a.isCorrect).length}
                </p>
                <p className="text-xs text-muted-foreground">Wrong</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {formatTime(Math.floor((Date.now() - startTime) / 1000))}
                </p>
                <p className="text-xs text-muted-foreground">Time</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={onExit}>
                Exit Quiz
              </Button>
              <Button className="flex-1" onClick={() => window.location.reload()}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">{quiz.title}</h2>
          <p className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        {quiz.timeLimit && (
          <Badge
            variant={timeRemaining < 60 ? 'destructive' : 'secondary'}
            className="text-lg px-3 py-1"
          >
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(timeRemaining)}
          </Badge>
        )}
      </div>

      {/* Progress */}
      <Progress value={progress} className="h-2" />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                  {currentIndex + 1}
                </span>
                <div className="flex-1">
                  <p className="text-lg font-medium">{currentQuestion.question}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Badge variant="outline">{currentQuestion.points} pts</Badge>
                    {currentQuestion.timeLimit && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {currentQuestion.timeLimit}s recommended
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Options */}
              {currentQuestion.type !== 'short_answer' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswer === option.id;
                    const showCorrect = showResult && option.isCorrect;
                    const showWrong = showResult && isSelected && !option.isCorrect;

                    return (
                      <motion.button
                        key={option.id}
                        onClick={() => !showResult && setSelectedAnswer(option.id)}
                        disabled={showResult}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                          showCorrect
                            ? 'border-success bg-success/10'
                            : showWrong
                            ? 'border-destructive bg-destructive/10'
                            : isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        whileHover={{ scale: showResult ? 1 : 1.01 }}
                        whileTap={{ scale: showResult ? 1 : 0.99 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex items-center justify-center w-8 h-8 rounded-full border-2 font-medium ${
                            isSelected || showCorrect
                              ? 'border-current bg-current/10'
                              : 'border-muted-foreground/30'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="flex-1">{option.text}</span>
                          {showCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                          {showWrong && <XCircle className="h-5 w-5 text-destructive" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Short Answer */}
              {currentQuestion.type === 'short_answer' && (
                <div className="space-y-2">
                  <Input
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={showResult}
                    className="text-lg"
                  />
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg ${
                        textAnswer.toLowerCase().trim() === currentQuestion.correctAnswer?.toLowerCase().trim()
                          ? 'bg-success/10 text-success'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      Correct answer: {currentQuestion.correctAnswer}
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onExit}>
          Exit Quiz
        </Button>
        <Button
          onClick={submitAnswer}
          disabled={
            showResult ||
            (currentQuestion.type === 'short_answer' ? !textAnswer.trim() : !selectedAnswer)
          }
        >
          {currentIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
