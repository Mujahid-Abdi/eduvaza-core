import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, ArrowRight, ArrowLeft, Trophy, RotateCcw, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

export interface PreviewQuestion {
  id: number;
  question: string;
  type: string;
  difficulty: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
}

interface QuizPreviewModeProps {
  questions: PreviewQuestion[];
  title: string;
  onClose: () => void;
  onPublish: () => void;
}

interface Answer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

export const QuizPreviewMode = ({ questions, title, onClose, onPublish }: QuizPreviewModeProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const checkAnswer = (): boolean => {
    const question = currentQuestion;
    
    if (question.type === 'short_answer') {
      return textAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    }
    
    return selectedAnswer === question.correctAnswer;
  };

  const submitAnswer = () => {
    const isCorrect = checkAnswer();
    
    const answer: Answer = {
      questionId: currentQuestion.id,
      selectedAnswer: currentQuestion.type === 'short_answer' ? textAnswer : (selectedAnswer || ''),
      isCorrect,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setTextAnswer('');
        setShowFeedback(false);
      } else {
        setIsCompleted(true);
      }
    }, 1500);
  };

  const restart = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setTextAnswer('');
    setIsCompleted(false);
    setShowFeedback(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalCorrect = answers.filter(a => a.isCorrect).length;
  const percentage = Math.round((totalCorrect / questions.length) * 100);

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto"
      >
        <Card className="overflow-hidden">
          <div className={`p-8 text-center ${percentage >= 70 ? 'bg-accent/10' : 'bg-destructive/10'}`}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              {percentage >= 70 ? (
                <Trophy className="h-16 w-16 mx-auto text-accent mb-4" />
              ) : (
                <XCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
              )}
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Preview Complete!</h2>
            <p className="text-muted-foreground">
              This is how students will experience the quiz
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
                {totalCorrect} / {questions.length} correct
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-4 border-y">
              <div>
                <p className="text-2xl font-bold text-accent">{totalCorrect}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{questions.length - totalCorrect}</p>
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
              <Button variant="outline" className="flex-1" onClick={restart}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button className="flex-1" onClick={onPublish}>
                Publish Quiz
              </Button>
            </div>
            <Button variant="ghost" className="w-full" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Close Preview
            </Button>
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
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Preview Mode</Badge>
            <h2 className="font-semibold text-foreground">{title}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          <X className="h-4 w-4 mr-2" />
          Exit Preview
        </Button>
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
                    <Badge variant="outline" className="capitalize">
                      {currentQuestion.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {currentQuestion.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Options */}
              {currentQuestion.type !== 'short_answer' && currentQuestion.options && (
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => {
                    const optionLetter = option.charAt(0);
                    const isSelected = selectedAnswer === optionLetter;
                    const isCorrect = optionLetter === currentQuestion.correctAnswer;
                    const showCorrect = showFeedback && isCorrect;
                    const showWrong = showFeedback && isSelected && !isCorrect;

                    return (
                      <motion.button
                        key={index}
                        onClick={() => !showFeedback && setSelectedAnswer(optionLetter)}
                        disabled={showFeedback}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                          showCorrect
                            ? 'border-accent bg-accent/10'
                            : showWrong
                            ? 'border-destructive bg-destructive/10'
                            : isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        whileHover={{ scale: showFeedback ? 1 : 1.01 }}
                        whileTap={{ scale: showFeedback ? 1 : 0.99 }}
                      >
                        <Checkbox
                          checked={isSelected}
                          className="pointer-events-none"
                        />
                        <span className="flex-1">{option}</span>
                        {showCorrect && <CheckCircle2 className="h-5 w-5 text-accent" />}
                        {showWrong && <XCircle className="h-5 w-5 text-destructive" />}
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
                    disabled={showFeedback}
                    className="text-lg"
                  />
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg ${
                        textAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim()
                          ? 'bg-accent/10 text-accent'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      Correct answer: {currentQuestion.correctAnswer}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Explanation feedback */}
              {showFeedback && currentQuestion.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 rounded-lg bg-muted"
                >
                  <p className="text-sm text-muted-foreground">
                    💡 {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex(prev => prev - 1);
              setSelectedAnswer(null);
              setTextAnswer('');
              setShowFeedback(false);
              // Remove last answer
              setAnswers(prev => prev.slice(0, -1));
            }
          }}
          disabled={currentIndex === 0 || showFeedback}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={submitAnswer}
          disabled={
            showFeedback ||
            (currentQuestion.type === 'short_answer' ? !textAnswer.trim() : !selectedAnswer)
          }
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Preview'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
