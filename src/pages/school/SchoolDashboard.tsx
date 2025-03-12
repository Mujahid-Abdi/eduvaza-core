import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Trophy, TrendingUp, Award, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { coursesService } from '@/services/courses';
import { toast } from 'sonner';
import type { Course } from '@/types';

export const SchoolDashboard = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch school's courses from Firebase
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      
      // For school users, schoolId is their own user ID
      const schoolId = user.role === 'school' ? user.id : user.schoolId;
      
      if (!schoolId) {
        console.error('No schoolId found for user:', user);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        console.log('Fetching courses for schoolId:', schoolId);
        const courses = await coursesService.getCoursesBySchool(schoolId);
        console.log('Fetched courses:', courses);
        setMyCourses(courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Total Courses', 
      value: loading ? '...' : myCourses.length, 
      color: 'text-primary', 
      bg: 'bg-primary/10',
      action: () => navigate('/school/courses')
    },
    { 
      icon: Users, 
      label: 'Total Students', 
      value: loading ? '...' : myCourses.reduce((sum, c) => sum + c.enrolledCount, 0), 
      color: 'text-secondary', 
      bg: 'bg-secondary/10',
      action: () => navigate('/school/courses')
    },
    { 
      icon: Trophy, 
      label: 'Active Quizzes', 
      value: loading ? '...' : 0, 
      color: 'text-accent', 
      bg: 'bg-accent/10',
      action: () => navigate('/school/quizzes')
    },
    { 
      icon: TrendingUp, 
      label: 'Published Courses', 
      value: loading ? '...' : myCourses.filter(c => c.isPublished).length, 
      color: 'text-success', 
      bg: 'bg-success/10',
      action: () => navigate('/school/courses')
    },
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
            <h1 className="text-3xl font-bold text-foreground">
              {t('dashboard.welcome')}, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">School Dashboard Overview</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <Card 
              key={stat.label} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={stat.action}
            >
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
                  onClick={() => navigate('/school/courses')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Manage Courses</div>
                      <div className="text-xs text-muted-foreground">Create and edit courses</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 justify-start"
                  onClick={() => navigate('/school/quizzes')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Trophy className="h-5 w-5 text-secondary" />
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
                  onClick={() => navigate('/school/analytics')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-success/10">
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Analytics</div>
                      <div className="text-xs text-muted-foreground">View performance data</div>
                    </div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto py-4 justify-start"
                  onClick={() => navigate('/school/settings')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Award className="h-5 w-5 text-warning" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Settings</div>
                      <div className="text-xs text-muted-foreground">School configuration</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Courses</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/school/courses')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                  <p className="text-muted-foreground mt-4 text-sm">Loading courses...</p>
                </div>
              ) : myCourses.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {myCourses.slice(0, 4).map((course) => (
                    <div
                      key={course.id}
                      className="flex gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate('/school/courses')}
                    >
                      <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex-shrink-0">
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
                        <p className="text-xs text-muted-foreground mt-1">
                          By: {course.teacherName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No courses yet. Create your first course!</p>
                  <Button className="mt-4" onClick={() => navigate('/school/courses')}>
                    Create Course
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SchoolDashboard;
