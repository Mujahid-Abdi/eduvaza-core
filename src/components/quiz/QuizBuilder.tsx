import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  CheckCircle2, 
  XCircle,
  Clock,
  Save,
  Eye,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useI18n } from '@/contexts/I18nContext';
import type { Quiz, Question, QuestionType, QuestionOption } from '@/types/quiz';

interface QuizBuilderProps {
  initialQuiz?: Partial<Quiz>;
  onSave: (quiz: Partial<Quiz>) => void;
  onCancel: () => void;
  onGenerateAI?: () => void;
}

type Step = 'details' | 'questions' | 'settings' | 'preview';

export const QuizBuilder = ({ initialQuiz, onSave, onCancel, onGenerateAI }: QuizBuilderProps) => {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [quiz, setQuiz] = useState<Partial<Quiz>>(initialQuiz || {
    title: '',
    description: '',
    language: 'en',
    quizType: 'practice',
    difficulty: 'medium',
    questions: [],
    timeLimit: 15,
    shuffleQuestions: false,
    shuffleOptions: true,
    showResults: true,
    passingScore: 60,
    isPublished: false,
    isMultiplayer: false,
  });

  const steps: Step[] = ['details', 'questions', 'settings', 'preview'];
  const currentStepIndex = steps.indexOf(currentStep);

  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: `new-q-${Date.now()}`,
      quizId: quiz.id || '',
      type,
      question: '',
      options: type !== 'short_answer' ? [
        { id: `opt-${Date.now()}-1`, text: '', isCorrect: false },
        { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
        type === 'mcq' ? { id: `opt-${Date.now()}-3`, text: '', isCorrect: false } : undefined,
        type === 'mcq' ? { id: `opt-${Date.now()}-4`, text: '', isCorrect: false } : undefined,
      ].filter(Boolean) as QuestionOption[] : undefined,
      correctAnswer: type === 'short_answer' ? '' : undefined,
      points: 10,
      timeLimit: 30,
      order: (quiz.questions?.length || 0) + 1,
    };

    if (type === 'true_false') {
      newQuestion.options = [
        { id: `opt-${Date.now()}-t`, text: 'True', isCorrect: false },
        { id: `opt-${Date.now()}-f`, text: 'False', isCorrect: false },
      ];
    }

    setQuiz(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQuestion],
    }));
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions?.map((q, i) => i === index ? { ...q, ...updates } : q),
    }));
  };

  const removeQuestion = (index: number) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index),
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, updates: Partial<QuestionOption>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions?.map((q, qi) => {
        if (qi === questionIndex && q.options) {
          return {
            ...q,
            options: q.options.map((opt, oi) => oi === optionIndex ? { ...opt, ...updates } : opt),
          };
        }
        return q;
      }),
    }));
  };

  const setCorrectOption = (questionIndex: number, optionId: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions?.map((q, qi) => {
        if (qi === questionIndex && q.options) {
          return {
            ...q,
            options: q.options.map(opt => ({ ...opt, isCorrect: opt.id === optionId })),
          };
        }
        return q;
      }),
    }));
  };

  const totalPoints = quiz.questions?.reduce((sum, q) => sum + q.points, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <motion.button
              onClick={() => setCurrentStep(step)}
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                index <= currentStepIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {index + 1}
            </motion.button>
            {index < steps.length - 1 && (
              <div className={`w-12 h-1 mx-2 rounded ${
                index < currentStepIndex ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Details */}
        {currentStep === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Quiz Details
                  {onGenerateAI && (
                    <Button variant="outline" size="sm" onClick={onGenerateAI}>
                      <Sparkles className="h-4 w-4 mr-2 text-warning" />
                      Generate with AI
                      <Badge variant="secondary" className="ml-2 text-xs">Draft</Badge>
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input
                    id="title"
                    value={quiz.title}
                    onChange={(e) => setQuiz(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter quiz title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={quiz.description}
                    onChange={(e) => setQuiz(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your quiz"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={quiz.language}
                      onValueChange={(value) => setQuiz(prev => ({ ...prev, language: value as Quiz['language'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="sw">Kiswahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Time Limit (minutes)</Label>
                    <Input
                      type="number"
                      value={quiz.timeLimit || ''}
                      onChange={(e) => setQuiz(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || undefined }))}
                      placeholder="No limit"
                      min={1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Questions */}
        {currentStep === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Questions ({quiz.questions?.length || 0})</h3>
                <p className="text-sm text-muted-foreground">Total Points: {totalPoints}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => addQuestion('mcq')}>
                  <Plus className="h-4 w-4 mr-1" /> MCQ
                </Button>
                <Button variant="outline" size="sm" onClick={() => addQuestion('true_false')}>
                  <Plus className="h-4 w-4 mr-1" /> True/False
                </Button>
                <Button variant="outline" size="sm" onClick={() => addQuestion('short_answer')}>
                  <Plus className="h-4 w-4 mr-1" /> Short Answer
                </Button>
              </div>
            </div>

            {quiz.questions?.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No questions yet. Add your first question above.</p>
                  {onGenerateAI && (
                    <Button variant="outline" onClick={onGenerateAI}>
                      <Sparkles className="h-4 w-4 mr-2 text-warning" />
                      Generate Questions with AI
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {quiz.questions?.map((question, qIndex) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-muted cursor-move">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <Badge variant="outline">{question.type.replace('_', ' ').toUpperCase()}</Badge>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>{question.points} pts</span>
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            <span>{question.timeLimit}s</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                        placeholder="Enter your question"
                        rows={2}
                      />
                    </div>

                    {question.type !== 'short_answer' && question.options && (
                      <div className="space-y-2">
                        <Label>Options (click to mark correct)</Label>
                        <RadioGroup
                          value={question.options.find(o => o.isCorrect)?.id || ''}
                          onValueChange={(value) => setCorrectOption(qIndex, value)}
                        >
                          {question.options.map((option, oIndex) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <RadioGroupItem value={option.id} id={option.id} />
                              <Input
                                value={option.text}
                                onChange={(e) => updateOption(qIndex, oIndex, { text: e.target.value })}
                                placeholder={`Option ${oIndex + 1}`}
                                className={option.isCorrect ? 'border-success ring-1 ring-success' : ''}
                              />
                              {option.isCorrect && <CheckCircle2 className="h-5 w-5 text-success" />}
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {question.type === 'short_answer' && (
                      <div className="space-y-2">
                        <Label>Correct Answer</Label>
                        <Input
                          value={question.correctAnswer}
                          onChange={(e) => updateQuestion(qIndex, { correctAnswer: e.target.value })}
                          placeholder="Enter the correct answer"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={question.points}
                          onChange={(e) => updateQuestion(qIndex, { points: parseInt(e.target.value) || 10 })}
                          min={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time Limit (seconds)</Label>
                        <Input
                          type="number"
                          value={question.timeLimit}
                          onChange={(e) => updateQuestion(qIndex, { timeLimit: parseInt(e.target.value) || 30 })}
                          min={5}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Step 3: Settings */}
        {currentStep === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quiz Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Shuffle Questions</Label>
                    <p className="text-sm text-muted-foreground">Randomize question order for each attempt</p>
                  </div>
                  <Switch
                    checked={quiz.shuffleQuestions}
                    onCheckedChange={(checked) => setQuiz(prev => ({ ...prev, shuffleQuestions: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Shuffle Options</Label>
                    <p className="text-sm text-muted-foreground">Randomize answer options</p>
                  </div>
                  <Switch
                    checked={quiz.shuffleOptions}
                    onCheckedChange={(checked) => setQuiz(prev => ({ ...prev, shuffleOptions: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Results</Label>
                    <p className="text-sm text-muted-foreground">Show correct answers after completion</p>
                  </div>
                  <Switch
                    checked={quiz.showResults}
                    onCheckedChange={(checked) => setQuiz(prev => ({ ...prev, showResults: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Passing Score (%)</Label>
                  <Input
                    type="number"
                    value={quiz.passingScore}
                    onChange={(e) => setQuiz(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 60 }))}
                    min={0}
                    max={100}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Preview */}
        {currentStep === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Quiz Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <h2 className="text-xl font-bold">{quiz.title || 'Untitled Quiz'}</h2>
                  <p className="text-muted-foreground mt-1">{quiz.description || 'No description'}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge>{quiz.questions?.length || 0} Questions</Badge>
                    <Badge>{totalPoints} Points</Badge>
                    {quiz.timeLimit && <Badge><Clock className="h-3 w-3 mr-1" />{quiz.timeLimit} min</Badge>}
                  </div>
                </div>

                {quiz.questions?.map((question, index) => (
                  <div key={question.id} className="p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{question.question || 'No question text'}</p>
                        {question.options && (
                          <div className="mt-2 space-y-1">
                            {question.options.map((opt, i) => (
                              <div key={opt.id} className={`flex items-center gap-2 p-2 rounded ${opt.isCorrect ? 'bg-success/10 text-success' : ''}`}>
                                <span className="w-5 h-5 flex items-center justify-center rounded-full border text-xs">
                                  {String.fromCharCode(65 + i)}
                                </span>
                                {opt.text || 'Empty option'}
                                {opt.isCorrect && <CheckCircle2 className="h-4 w-4 ml-auto" />}
                              </div>
                            ))}
                          </div>
                        )}
                        {question.type === 'short_answer' && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            Answer: <span className="text-success">{question.correctAnswer}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {(!quiz.questions || quiz.questions.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-warning" />
                    <p>No questions added yet.</p>
                    <Button variant="link" onClick={() => setCurrentStep('questions')}>
                      Add questions
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {currentStepIndex > 0 && (
            <Button variant="outline" onClick={() => setCurrentStep(steps[currentStepIndex - 1])}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {currentStepIndex < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(steps[currentStepIndex + 1])}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={() => onSave(quiz)}>
              <Save className="h-4 w-4 mr-2" />
              Save Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
