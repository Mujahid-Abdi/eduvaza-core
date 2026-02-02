import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Trophy, Trash2, Edit } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseUploadDialog } from '@/components/school/CourseUploadDialog';
import { CourseEditDialog } from '@/components/school/CourseEditDialog';
import { QuizCreateDialog } from '@/components/school/QuizCreateDialog';
import { QuizEditDialog } from '@/components/school/QuizEditDialog';
import { QuizLeaderboardDialog } from '@/components/school/QuizLeaderboardDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export const SchoolDashboard = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get tab from URL or default to 'courses'
  const tabFromUrl = searchParams.get('tab') || 'courses';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);

  // Sync activeTab with URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab') || 'courses';
    setActiveTab(tab);
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  // Mock data - will be replaced with real Firebase data
  const myCourses = [
    { 
      id: '1', 
      title: 'Mathematics 101', 
      description: 'Introduction to basic mathematics concepts',
      category: 'Mathematics',
      level: 'beginner' as const,
      language: 'en',
      enrolledStudents: 45, 
      teacher: 'John Doe' 
    },
    { 
      id: '2', 
      title: 'Physics Basics', 
      description: 'Fundamental physics principles',
      category: 'Physics',
      level: 'intermediate' as const,
      language: 'en',
      enrolledStudents: 32, 
      teacher: 'Jane Smith' 
    },
  ];

  const myQuizzes = [
    { 
      id: '1', 
      title: 'Math Quiz 1', 
      course: 'Mathematics 101',
      startTime: '2024-02-10 10:00',
      endTime: '2024-02-10 11:00',
      participants: 38
    },
  ];

  const handleDeleteCourse = async (courseId: string) => {
    try {
      // TODO: Implement Firebase course deletion
      // await firebaseService.deleteCourse(courseId);
      toast.success('Course deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      // TODO: Implement Firebase quiz deletion
      // await firebaseService.deleteQuiz(quizId);
      toast.success('Quiz deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete quiz');
    }
  };

  const stats = [
    { icon: BookOpen, label: 'My Courses', value: myCourses.length, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Users, label: 'Total Enrollments', value: myCourses.reduce((sum, c) => sum + c.enrolledStudents, 0), color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: Trophy, label: 'Active Quizzes', value: myQuizzes.length, color: 'text-accent', bg: 'bg-accent/10' },
  ];

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
            <h1 className="text-3xl font-bold text-foreground">School Dashboard</h1>
            <p className="text-muted-foreground">Manage your courses and quizzes</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
            </TabsList>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Courses I Created</h2>
                <CourseUploadDialog />
              </div>

              <div className="grid gap-4">
                {myCourses.map((course) => (
                  <Card key={course.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Assigned Teacher: {course.teacher}</p>
                            <p>Enrolled Students: {course.enrolledStudents}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingCourse(course)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{course.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCourse(course.id)} className="bg-destructive text-destructive-foreground">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {myCourses.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No courses yet. Upload your first course!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Quizzes I Created</h2>
                <QuizCreateDialog />
              </div>

              <div className="grid gap-4">
                {myQuizzes.map((quiz) => (
                  <Card key={quiz.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{quiz.title}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Course: {quiz.course}</p>
                            <p>Start: {quiz.startTime}</p>
                            <p>End: {quiz.endTime}</p>
                            <p>Participants: {quiz.participants}</p>
                          </div>
                          <QuizLeaderboardDialog quizId={quiz.id} quizTitle={quiz.title} />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingQuiz(quiz)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{quiz.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteQuiz(quiz.id)} className="bg-destructive text-destructive-foreground">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {myQuizzes.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No quizzes yet. Create your first quiz!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Edit Dialogs */}
        {editingCourse && (
          <CourseEditDialog
            open={!!editingCourse}
            onOpenChange={(open) => !open && setEditingCourse(null)}
            course={editingCourse}
            onCourseUpdated={() => {
              // TODO: Refresh courses list
              setEditingCourse(null);
            }}
          />
        )}

        {editingQuiz && (
          <QuizEditDialog
            open={!!editingQuiz}
            onOpenChange={(open) => !open && setEditingQuiz(null)}
            quiz={editingQuiz}
            onQuizUpdated={() => {
              // TODO: Refresh quizzes list
              setEditingQuiz(null);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SchoolDashboard;
