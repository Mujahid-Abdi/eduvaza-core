import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  BookOpen, 
  FileQuestion, 
  Send, 
  CheckCircle,
  Clock,
  User,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Question {
  id: string;
  studentName: string;
  studentId: string;
  teacherName: string;
  teacherId: string;
  type: 'course' | 'quiz';
  itemTitle: string;
  itemId: string;
  question: string;
  timestamp: string;
  status: 'pending' | 'answered';
  answer?: string;
  answeredAt?: string;
  answeredBy?: string;
}

export const SchoolStudentQuestions = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock questions data - will be fetched from Firebase
  const questions: Question[] = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      studentId: 'student1',
      teacherName: 'Mr. Smith',
      teacherId: 'teacher1',
      type: 'course',
      itemTitle: 'Mathematics 101',
      itemId: 'course1',
      question: 'Can you explain the concept of derivatives in more detail? I\'m having trouble understanding the practical applications.',
      timestamp: '2 hours ago',
      status: 'pending',
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      studentId: 'student2',
      teacherName: 'Ms. Johnson',
      teacherId: 'teacher2',
      type: 'quiz',
      itemTitle: 'Math Quiz 1',
      itemId: 'quiz1',
      question: 'I don\'t understand question 5 about quadratic equations. Could you provide another example?',
      timestamp: '5 hours ago',
      status: 'pending',
    },
    {
      id: '3',
      studentName: 'Charlie Brown',
      studentId: 'student3',
      teacherName: 'Mr. Smith',
      teacherId: 'teacher1',
      type: 'course',
      itemTitle: 'Advanced Calculus',
      itemId: 'course2',
      question: 'Are there any additional resources you recommend for learning integration techniques?',
      timestamp: '1 day ago',
      status: 'answered',
      answer: 'Yes! I recommend checking out Khan Academy\'s integration section and the textbook "Calculus Made Easy". Also, practice problems from MIT OpenCourseWare are excellent.',
      answeredAt: '1 day ago',
      answeredBy: 'Mr. Smith',
    },
    {
      id: '4',
      studentName: 'Diana Prince',
      studentId: 'student4',
      teacherName: 'Ms. Johnson',
      teacherId: 'teacher2',
      type: 'quiz',
      itemTitle: 'Calculus Midterm',
      itemId: 'quiz2',
      question: 'Will the final exam cover the same topics as this midterm?',
      timestamp: '2 days ago',
      status: 'answered',
      answer: 'The final exam will be cumulative, covering all topics from the semester including those from the midterm. However, there will be more emphasis on the later chapters.',
      answeredAt: '2 days ago',
      answeredBy: 'Ms. Johnson',
    },
    {
      id: '5',
      studentName: 'Ethan Hunt',
      studentId: 'student5',
      teacherName: 'Mr. Smith',
      teacherId: 'teacher1',
      type: 'course',
      itemTitle: 'Mathematics 101',
      itemId: 'course1',
      question: 'Could we have a review session before the final exam?',
      timestamp: '3 days ago',
      status: 'pending',
    },
  ];

  const pendingQuestions = questions.filter(q => q.status === 'pending');
  const answeredQuestions = questions.filter(q => q.status === 'answered');
  const courseQuestions = questions.filter(q => q.type === 'course');
  const quizQuestions = questions.filter(q => q.type === 'quiz');

  const handleAnswerQuestion = async () => {
    if (!selectedQuestion || !answerText.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement Firebase answer submission
      // await questionsService.answerQuestion(selectedQuestion.id, answerText);
      
      toast.success('Answer sent to student successfully!');
      setSelectedQuestion(null);
      setAnswerText('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send answer');
    } finally {
      setLoading(false);
    }
  };

  const QuestionCard = ({ question }: { question: Question }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${
            question.type === 'course' ? 'bg-primary/10' : 'bg-accent/10'
          }`}>
            {question.type === 'course' ? (
              <BookOpen className="h-5 w-5 text-primary" />
            ) : (
              <FileQuestion className="h-5 w-5 text-accent" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{question.studentName}</span>
                  <Badge variant={question.status === 'pending' ? 'default' : 'secondary'}>
                    {question.status === 'pending' ? (
                      <><Clock className="h-3 w-3 mr-1" /> Pending</>
                    ) : (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Answered</>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {question.type === 'course' ? 'Course' : 'Quiz'}
                  </Badge>
                  <span>{question.itemTitle}</span>
                  <span>•</span>
                  <GraduationCap className="h-3 w-3" />
                  <span>{question.teacherName}</span>
                  <span>•</span>
                  <span>{question.timestamp}</span>
                </div>
              </div>
            </div>
            <p className="text-sm mt-3 mb-3">{question.question}</p>
            {question.status === 'answered' && question.answer && (
              <div className="mt-3 p-3 rounded-lg bg-muted">
                <p className="text-xs font-semibold text-muted-foreground mb-1">
                  Answer by {question.answeredBy}:
                </p>
                <p className="text-sm">{question.answer}</p>
                <p className="text-xs text-muted-foreground mt-2">Answered {question.answeredAt}</p>
              </div>
            )}
            {question.status === 'pending' && (
              <Button 
                size="sm" 
                onClick={() => {
                  setSelectedQuestion(question);
                  setAnswerText('');
                }}
                className="mt-2"
              >
                <Send className="h-4 w-4 mr-2" />
                Answer Question
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Student Questions</h1>
          <p className="text-muted-foreground">Monitor and respond to student questions across all courses and quizzes</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Questions</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{questions.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{pendingQuestions.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Answered</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{answeredQuestions.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {Math.round((answeredQuestions.length / questions.length) * 100)}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/10">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Questions Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Questions</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingQuestions.length})</TabsTrigger>
              <TabsTrigger value="answered">Answered</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="space-y-4">
                {questions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
                {questions.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No questions yet</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="mt-4">
              <div className="space-y-4">
                {pendingQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
                {pendingQuestions.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
                      <p className="text-muted-foreground">All questions have been answered!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="answered" className="mt-4">
              <div className="space-y-4">
                {answeredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-4">
              <div className="space-y-4">
                {courseQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="quizzes" className="mt-4">
              <div className="space-y-4">
                {quizQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Answer Dialog */}
        <Dialog open={!!selectedQuestion} onOpenChange={(open) => !open && setSelectedQuestion(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Answer Student Question</DialogTitle>
            </DialogHeader>
            {selectedQuestion && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">{selectedQuestion.studentName}</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedQuestion.type === 'course' ? 'Course' : 'Quiz'}: {selectedQuestion.itemTitle}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      • Teacher: {selectedQuestion.teacherName}
                    </span>
                  </div>
                  <p className="text-sm">{selectedQuestion.question}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Answer</label>
                  <Textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={6}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your answer will be sent to {selectedQuestion.studentName} and {selectedQuestion.teacherName} via notification
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedQuestion(null)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleAnswerQuestion} disabled={loading || !answerText.trim()}>
                {loading ? 'Sending...' : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Answer
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default SchoolStudentQuestions;
