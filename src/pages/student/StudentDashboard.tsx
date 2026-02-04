import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, Play, ChevronRight, Trophy, Medal, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { coursesService } from '@/services/courses';
import { mockQuizzes, mockQuizAttempts } from '@/services/mockQuizData';
import type { Course, Enrollment } from '@/types';

export const StudentDashboard = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const currentStudentId = user?.id || 'student-1';
  
  const [enrolledCourses, setEnrolledCourses] = useState<Array<Course & { progress: number; lastLesson: string; enrollmentId: string }>>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
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
                enrollmentId: enrollment.id,
              };
            }
            return null;
          })
        );
        
        setEnrolledCourses(coursesWithProgress.filter(Boolean) as any);
        
        // Fetch recommended courses (not enrolled)
        const allCourses = await coursesService.getCourses();
        const enrolledIds = enrollments.map(e => e.courseId);
        const recommended = allCourses.filter(c => !enrolledIds.includes(c.id)).slice(0, 6);
        setRecommendedCourses(recommended);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [user?.id]);

  // Get recent completed quizzes with rankings
  const recentQuizAttempts = mockQuizAttempts
    .filter(attempt => attempt.studentId === currentStudentId && attempt.status === 'completed')
    .sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5)
    .map(attempt => {
      const quiz = mockQuizzes.find(q => q.id === attempt.quizId);
      return { ...attempt, quizTitle: quiz?.title || 'Unknown Quiz' };
    });

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <Trophy className="h-5 w-5 text-primary" />;
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
            <h1 className="text-3xl font-bold text-foreground">
              {t('dashboard.welcome')}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">{t('student.continueWhere')}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/student/quiz-explore">
                <Trophy className="h-4 w-4 mr-2" />
                Explore Quizzes
              </Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/student/browse">
                <BookOpen className="h-4 w-4 mr-2" />
                {t('student.browseCourses')}
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-3"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{enrolledCourses.length}</p>
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
                  <p className="text-3xl font-bold text-foreground mt-1">24</p>
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
                  <p className="text-3xl font-bold text-foreground mt-1">35%</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('student.myCourses')}</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/courses">{t('common.viewAll')}</Link>
              </Button>
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
                <Link
                  key={course.id}
                  to={`/student/course/${course.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors group cursor-pointer"
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
                      Continue: {course.lastLesson}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <Progress value={course.progress} className="flex-1 h-2" />
                      <span className="text-sm font-medium text-foreground">{course.progress}%</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-3">No enrolled courses yet</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Quiz Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                <CardTitle>My Quiz Rankings</CardTitle>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/student/leaderboard">
                  {t('common.viewAll')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentQuizAttempts.length > 0 ? (
                <div className="space-y-3">
                  {recentQuizAttempts.map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                    >
                      {/* Rank Badge */}
                      <div className={`p-3 rounded-lg ${
                        attempt.rank === 1 ? 'bg-yellow-500/20' :
                        attempt.rank === 2 ? 'bg-gray-400/20' :
                        attempt.rank === 3 ? 'bg-amber-600/20' :
                        'bg-primary/10'
                      }`}>
                        <div className="flex flex-col items-center">
                          {getRankIcon(attempt.rank || 0)}
                          <p className={`text-lg font-bold mt-1 ${getRankColor(attempt.rank || 0)}`}>
                            #{attempt.rank}
                          </p>
                        </div>
                      </div>

                      {/* Quiz Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{attempt.quizTitle}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Completed {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : 'recently'}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            Score: {attempt.score}/{attempt.totalPoints}
                          </Badge>
                          <Badge className={`text-xs ${
                            attempt.percentage >= 90 ? 'bg-green-500' :
                            attempt.percentage >= 70 ? 'bg-blue-500' :
                            attempt.percentage >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}>
                            {attempt.percentage}%
                          </Badge>
                          {attempt.rank && attempt.rank <= 3 && (
                            <Badge variant="outline" className="text-xs border-primary text-primary">
                              <Award className="h-3 w-3 mr-1" />
                              Top 3
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Time Taken */}
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-foreground">
                          {Math.floor(attempt.timeTaken / 60)}:{(attempt.timeTaken % 60).toString().padStart(2, '0')}
                        </p>
                        <p className="text-xs text-muted-foreground">time</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No completed quizzes yet</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link to="/student/quizzes">Take Your First Quiz</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommended */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {recommendedCourses.map((course) => (
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
                      <p className="text-sm text-muted-foreground mt-1">{course.teacherName}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          {course.lessons.length} lessons
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {course.enrolledCount} enrolled
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
