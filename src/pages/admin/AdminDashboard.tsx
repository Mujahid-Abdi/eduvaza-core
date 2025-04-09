import { motion } from 'framer-motion';
import { 
  School, Users, GraduationCap, BookOpen, TrendingUp, AlertCircle, 
  CheckCircle, Clock, Flag, Trash2, Eye, AlertTriangle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockSchools, mockStats } from '@/services/mockData';
import { toast } from 'sonner';

export const AdminDashboard = () => {
  const pendingSchools = mockSchools.filter(s => s.status === 'pending');

  // Mock reported courses
  const reportedCourses = [
    {
      id: 'report-1',
      courseId: 'course-1',
      courseName: 'Mathematics 101',
      reportedBy: 'student-1',
      reporterName: 'Amara Diallo',
      reason: 'Inappropriate content in lesson 3',
      uploadedBy: 'teacher-1',
      uploaderName: 'John Mwamba',
      uploaderRole: 'teacher',
      schoolId: 'sch-1',
      schoolName: 'Green Valley School',
      date: new Date('2024-01-15'),
      status: 'pending',
    },
    {
      id: 'report-2',
      courseId: 'course-2',
      courseName: 'Physics Basics',
      reportedBy: 'teacher-2',
      reporterName: 'Sarah Johnson',
      reason: 'Outdated information, needs update',
      uploadedBy: 'school-1',
      uploaderName: 'Green Valley School',
      uploaderRole: 'school',
      schoolId: 'sch-1',
      schoolName: 'Green Valley School',
      date: new Date('2024-01-20'),
      status: 'pending',
    },
  ];

  const statCards = [
    { icon: School, label: 'Schools', value: mockStats.totalSchools, color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Users, label: 'Teachers', value: mockStats.totalTeachers, color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: GraduationCap, label: 'Students', value: mockStats.totalStudents, color: 'text-accent', bg: 'bg-accent/10' },
    { icon: BookOpen, label: 'Courses', value: mockStats.totalCourses, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  const handleApproveSchool = () => {
    toast.success('School approved successfully');
  };

  const handleRejectSchool = () => {
    toast.error('School rejected');
  };

  const handleDeleteCourse = () => {
    toast.success('Course deleted successfully');
  };

  const handleWarnUser = (userName: string) => {
    toast.warning(`Warning sent to ${userName}`);
  };

  const handleResolveReport = () => {
    toast.success('Report resolved');
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
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage platform, users, and content</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {pendingSchools.length} pending approvals
            </Badge>
            <Badge variant="destructive" className="gap-1">
              <Flag className="h-3 w-3" />
              {reportedCourses.length} reports
            </Badge>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-3 grid-cols-4"
        >
          {statCards.map((stat) => (
            <Card key={stat.label} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex flex-col items-center text-center">
                  <div className={`p-2 rounded-lg ${stat.bg} mb-2`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-lg font-bold text-foreground">
                    {stat.value.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>+12%</span>
                  </div>
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
                Pending School Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSchools.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No pending approvals</p>
              ) : (
                <div className="space-y-3">
                  {pendingSchools.map((school) => (
                    <div
                      key={school.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-border gap-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning font-bold text-sm">
                          {school.name[0]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-foreground truncate">{school.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{school.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                          <Eye className="h-3 w-3 sm:mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={handleApproveSchool}
                          className="flex-1 sm:flex-none"
                        >
                          <CheckCircle className="h-3 w-3 sm:mr-1" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={handleRejectSchool}
                          className="flex-1 sm:flex-none"
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Reported Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5 text-destructive" />
                Reported Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportedCourses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No reports</p>
              ) : (
                <div className="space-y-4">
                  {reportedCourses.map((report) => (
                    <div key={report.id} className="p-4 rounded-xl border-2 border-destructive/20 bg-destructive/5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-lg">{report.courseName}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Reported by: {report.reporterName} on {report.date.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="destructive">{report.status}</Badge>
                      </div>
                      
                      <div className="bg-background p-3 rounded-lg mb-3">
                        <p className="text-sm font-medium mb-1">Reason:</p>
                        <p className="text-sm text-muted-foreground">{report.reason}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">Uploaded By:</p>
                          <p className="font-medium">{report.uploaderName}</p>
                          <Badge variant="outline" className="mt-1">{report.uploaderRole}</Badge>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <p className="text-xs text-muted-foreground mb-1">School:</p>
                          <p className="font-medium">{report.schoolName}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Course
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleWarnUser(report.uploaderName)}
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Warn {report.uploaderRole}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={handleDeleteCourse}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete Course
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={handleResolveReport}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-sm">New school registered: Green Valley School</p>
                  <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <p className="text-sm">Course reported: Mathematics 101</p>
                  <span className="text-xs text-muted-foreground ml-auto">5 hours ago</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <p className="text-sm">New teacher joined: Sarah Johnson</p>
                  <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
