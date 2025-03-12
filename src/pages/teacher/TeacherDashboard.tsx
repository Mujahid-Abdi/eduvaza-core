import { motion } from 'framer-motion';
import { BookOpen, Users, PlusCircle, Eye, Trophy, Settings, BarChart3, GraduationCap, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { coursesService } from '@/services/courses';
import type { Course } from '@/types';

export const TeacherDashboard = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch teacher's courses from Firebase
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const courses = await coursesService.getCoursesByTeacher(user.id);
        setMyCourses(courses.slice(0, 4)); // Show first 4 courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user?.id]);

  const publishedCount = myCourses.filter(c => c.isPublished).length;
  const totalStudents = myCourses.reduce((sum, c) => sum + c.enrolledCount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">
            {t('dashboard.welcome')}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">{t('teacher.title')}</p>
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
                  <p className="text-sm text-muted-foreground">Total Courses</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{myCourses.length}</p>
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
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{publishedCount}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <Eye className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{totalStudents}</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Courses Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('teacher.myCourses')}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/teacher/courses')}>
                {t('common.viewAll')}
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : myCourses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate('/teacher/courses')}
                    >
                      <div className="w-24 h-24 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            📚
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {course.lessons.length} lessons • {course.enrolledCount} students
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <Badge variant="outline">{course.level}</Badge>
                          <Badge variant="outline">{course.language.toUpperCase()}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No courses yet. Create your first course!</p>
                  <Button className="mt-4" onClick={() => navigate('/teacher/courses')}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button 
                  variant="outline" 
                  className="h-auto py-4 justify-start"
                  onClick={() => navigate('/teacher/quizzes')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Trophy className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Manage Quizzes</div>
                      <div className="text-xs text-muted-foreground">Create and schedule quizzes</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 justify-start"
                  onClick={() => navigate('/teacher/courses')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <BookOpen className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Manage Courses</div>
                      <div className="text-xs text-muted-foreground">View and edit your courses</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 justify-start"
                  onClick={() => navigate('/teacher/analytics')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <BarChart3 className="h-5 w-5 text-success" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Analytics</div>
                      <div className="text-xs text-muted-foreground">View teaching performance</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 justify-start"
                  onClick={() => navigate('/teacher/learning')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <GraduationCap className="h-5 w-5 text-warning" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">My Learning</div>
                      <div className="text-xs text-muted-foreground">Courses you're taking</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
