import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, Layers, BarChart3, Plus, TrendingUp } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { mockClasses, mockCourses } from '@/services/mockData';

export const SchoolDashboard = () => {
  const { t } = useI18n();
  const { user } = useAuth();

  const schoolId = user?.schoolId || 'sch-1';
  const classes = mockClasses.filter(c => c.schoolId === schoolId);
  const courses = mockCourses.filter(c => c.schoolId === schoolId);

  const stats = [
    { icon: Users, label: 'Teachers', value: 45, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: GraduationCap, label: 'Students', value: 850, color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: Layers, label: 'Classes', value: classes.length, color: 'text-accent', bg: 'bg-accent/10' },
    { icon: BookOpen, label: 'Courses', value: courses.length, color: 'text-warning', bg: 'bg-warning/10' },
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
            <h1 className="text-3xl font-bold text-foreground">{t('school.title')}</h1>
            <p className="text-muted-foreground">Manage your institution</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2">
            <Plus className="h-5 w-5" />
            {t('school.createTeacher')}
          </Button>
          <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2">
            <Plus className="h-5 w-5" />
            {t('school.createStudent')}
          </Button>
          <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2">
            <Plus className="h-5 w-5" />
            {t('school.createClass')}
          </Button>
          <Button variant="outline" size="lg" className="h-auto py-4 flex-col gap-2">
            <Plus className="h-5 w-5" />
            {t('school.assignCourse')}
          </Button>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Classes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{t('school.manageClasses')}</CardTitle>
                <Button variant="ghost" size="sm">{t('common.viewAll')}</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium">{cls.name}</p>
                      <p className="text-sm text-muted-foreground">{cls.studentCount} students • {cls.assignedCourses.length} courses</p>
                    </div>
                    <Button variant="ghost" size="sm">{t('common.view')}</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t('school.results')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Completion Rate</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Average Course Progress</span>
                    <span className="font-semibold">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Active Students This Week</span>
                    <span className="font-semibold">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="pt-4 flex items-center gap-2 text-success text-sm">
                  <TrendingUp className="h-4 w-4" />
                  <span>+5% improvement from last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SchoolDashboard;
