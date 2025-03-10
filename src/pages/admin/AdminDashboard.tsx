import { motion } from 'framer-motion';
import { School, Users, GraduationCap, BookOpen, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/contexts/I18nContext';
import { mockSchools, mockStats } from '@/services/mockData';

const statCards = [
  { icon: School, label: 'admin.totalSchools', value: mockStats.totalSchools, color: 'text-primary', bg: 'bg-primary/10' },
  { icon: Users, label: 'admin.totalTeachers', value: mockStats.totalTeachers, color: 'text-secondary', bg: 'bg-secondary/10' },
  { icon: GraduationCap, label: 'admin.totalStudents', value: mockStats.totalStudents, color: 'text-accent', bg: 'bg-accent/10' },
  { icon: BookOpen, label: 'admin.totalCourses', value: mockStats.totalCourses, color: 'text-warning', bg: 'bg-warning/10' },
];

export const AdminDashboard = () => {
  const { t } = useI18n();

  const pendingSchools = mockSchools.filter(s => s.status === 'pending');

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
            <h1 className="text-3xl font-bold text-foreground">{t('admin.platformOverview')}</h1>
            <p className="text-muted-foreground">{t('common.tagline')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {mockStats.pendingApprovals} pending
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {statCards.map((stat, index) => (
            <Card key={stat.label} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t(stat.label)}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-4 text-sm text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                {t('admin.pendingApprovals')}
              </CardTitle>
              <Button variant="outline" size="sm">
                {t('common.viewAll')}
              </Button>
            </CardHeader>
            <CardContent>
              {pendingSchools.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending approvals</p>
              ) : (
                <div className="space-y-4">
                  {pendingSchools.map((school) => (
                    <div
                      key={school.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning font-bold">
                          {school.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{school.name}</p>
                          <p className="text-sm text-muted-foreground">{school.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          {t('admin.viewDetails')}
                        </Button>
                        <Button variant="hero" size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t('admin.approveSchool')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* All Schools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.manageSchools')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockSchools.map((school) => (
                  <div
                    key={school.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${
                        school.status === 'approved' ? 'bg-success/10 text-success' :
                        school.status === 'pending' ? 'bg-warning/10 text-warning' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {school.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{school.name}</p>
                        <p className="text-sm text-muted-foreground">{school.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <p className="text-muted-foreground">{school.teacherCount} teachers</p>
                        <p className="text-muted-foreground">{school.studentCount} students</p>
                      </div>
                      <Badge variant={
                        school.status === 'approved' ? 'default' :
                        school.status === 'pending' ? 'secondary' :
                        'destructive'
                      }>
                        {school.status}
                      </Badge>
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

export default AdminDashboard;
