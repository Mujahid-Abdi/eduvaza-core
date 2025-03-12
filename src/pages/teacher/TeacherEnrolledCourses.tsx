import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, Play, ChevronRight, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { coursesService } from '@/services/courses';
import { toast } from '@/components/ui/use-toast';
import type { Course } from '@/types';

export const TeacherEnrolledCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<Array<Course & { progress: number; lastLesson: string; completedLessons: number; totalLessons: number }>>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch enrolled and available courses
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const enrollments = await coursesService.getEnrollments(user.id);
        
        // Fetch course details for each enrollment
        const coursesWithProgress = await Promise.all(
          enrollments.map(async (enrollment) => {
            const course = await coursesService.getCourseById(enrollment.courseId);
            if (course) {
              const lastCompletedLessonId = enrollment.completedLessons[enrollment.completedLessons.length - 1];
              const lastLesson = lastCompletedLessonId 
                ? course.lessons.find(l => l.id === lastCompletedLessonId)?.title || 'Getting Started'
                : course.lessons[0]?.title || 'Getting Started';
              
              return {
                ...course,
                progress: enrollment.progress,
                lastLesson,
                completedLessons: enrollment.completedLessons.length,
                totalLessons: course.lessons.length,
              };
            }
            return null;
          })
        );
        
        setEnrolledCourses(coursesWithProgress.filter(Boolean) as any);
        
        // Fetch available courses (not enrolled and not created by teacher)
        const allCourses = await coursesService.getCourses();
        const enrolledIds = enrollments.map(e => e.courseId);
        const available = allCourses.filter(c => !enrolledIds.includes(c.id) && c.teacherId !== user.id);
        setAvailableCourses(available);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?.id]);

  const handleEnroll = async (courseId: string) => {
    if (!user?.id) return;

    // Check if trying to enroll in own course
    const course = availableCourses.find(c => c.id === courseId);
    if (course && course.teacherId === user.id) {
      toast({
        title: 'Cannot Enroll',
        description: 'You cannot enroll in your own course.',
        variant: 'destructive',
      });
      return;
    }

    setEnrollingCourseId(courseId);
    try {
      await coursesService.enrollStudent(user.id, courseId);
      
      // Refresh the courses
      const fetchedCourse = await coursesService.getCourseById(courseId);
      if (fetchedCourse) {
        setEnrolledCourses([...enrolledCourses, {
          ...fetchedCourse,
          progress: 0,
          lastLesson: fetchedCourse.lessons[0]?.title || 'Getting Started',
          completedLessons: 0,
          totalLessons: fetchedCourse.lessons.length,
        }]);
        setAvailableCourses(availableCourses.filter(c => c.id !== courseId));
      }
      
      toast({
        title: 'Successfully Enrolled!',
        description: 'You can now access this course from My Learning',
      });
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: 'Enrollment Failed',
        description: 'Failed to enroll in course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const filteredAvailableCourses = availableCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    enrolledCourses: enrolledCourses.length,
    hoursLearned: enrolledCourses.reduce((sum, c) => sum + c.lessons.reduce((s, l) => s + (l.duration || 0), 0), 0) / 60,
    avgProgress: enrolledCourses.length > 0 ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length) : 0,
    completedCourses: enrolledCourses.filter(c => c.progress === 100).length,
  };

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
            <h1 className="text-3xl font-bold text-foreground">My Learning</h1>
            <p className="text-muted-foreground">Continue your professional development journey</p>
          </div>
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
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stats.enrolledCourses}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Hours Learned</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{Math.round(stats.hoursLearned)}</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Progress</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stats.avgProgress}%</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stats.completedCourses}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="enrolled">
            <TabsList>
              <TabsTrigger value="enrolled">My Courses</TabsTrigger>
              <TabsTrigger value="browse">Browse Courses</TabsTrigger>
            </TabsList>

            {/* Enrolled Courses */}
            <TabsContent value="enrolled" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Continue Learning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border">
                          <div className="w-20 h-20 rounded-lg bg-muted animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                            <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                            <div className="h-2 bg-muted rounded animate-pulse" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/student/courses/${course.id}/learn?lesson=0`)}
                    >
                      <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0 relative">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">📚</div>
                        )}
                        <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-8 w-8 text-background" fill="currentColor" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          By: {course.teacherName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Continue: {course.lastLesson}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{course.level}</Badge>
                          <Badge variant="secondary">{course.category}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {course.completedLessons}/{course.totalLessons} lessons
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <Progress value={course.progress} className="flex-1 h-2" />
                          <span className="text-sm font-medium text-foreground">{course.progress}%</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No enrolled courses yet. Browse courses to get started!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Browse Courses */}
            <TabsContent value="browse" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Development Courses</CardTitle>
                  <div className="mt-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search courses..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-border overflow-hidden">
                          <div className="aspect-video bg-muted animate-pulse" />
                          <div className="p-4 space-y-2">
                            <div className="h-4 bg-muted rounded animate-pulse" />
                            <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredAvailableCourses.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-3">
                      {filteredAvailableCourses.map((course) => (
                      <div
                        key={course.id}
                        className="rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="aspect-video bg-muted">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">By {course.teacherName}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline">{course.level}</Badge>
                            <Badge variant="secondary">{course.category}</Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-muted-foreground">
                              {course.lessons.length} lessons
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {course.enrolledCount} enrolled
                            </span>
                          </div>
                          <Button 
                            className="w-full mt-4" 
                            size="sm"
                            onClick={() => handleEnroll(course.id)}
                            disabled={enrollingCourseId === course.id}
                          >
                            {enrollingCourseId === course.id ? 'Enrolling...' : 'Enroll Now'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No courses available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherEnrolledCourses;
