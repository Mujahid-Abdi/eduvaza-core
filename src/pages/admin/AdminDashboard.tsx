import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  School, Users, GraduationCap, BookOpen, TrendingUp, AlertCircle, 
  CheckCircle, Clock, Flag, Trash2, Eye, Edit, Ban, AlertTriangle,
  Plus, Search, Mail, MapPin
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/contexts/I18nContext';
import { mockSchools, mockStats, mockCourses, mockUsers } from '@/services/mockData';
import { quizService } from '@/services/quizzes';
import { toast } from 'sonner';
import type { Quiz } from '@/types/quiz';

export const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  // Fetch quizzes from Firebase
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const allQuizzes = await quizService.getAllQuizzes();
        setQuizzes(allQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
    fetchQuizzes();
  }, []);

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

  const pendingSchools = mockSchools.filter(s => s.status === 'pending');
  const allUsers = mockUsers;
  const teachers = allUsers.filter(u => u.role === 'teacher');
  const students = allUsers.filter(u => u.role === 'student');
  const schools = allUsers.filter(u => u.role === 'school');

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

  const handleSuspendUser = (userName: string) => {
    toast.error(`${userName} has been suspended`);
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
          className="grid gap-3 grid-cols-2 lg:grid-cols-4"
        >
          {statCards.map((stat) => (
            <Card key={stat.label} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="schools" className="text-xs sm:text-sm">Schools</TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm">Users</TabsTrigger>
              <TabsTrigger value="courses" className="text-xs sm:text-sm">Courses</TabsTrigger>
              <TabsTrigger value="quizzes" className="text-xs sm:text-sm">Quizzes</TabsTrigger>
              <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Pending Approvals */}
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

              {/* Recent Activity */}
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
            </TabsContent>

            {/* Schools Tab */}
            <TabsContent value="schools">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Manage Schools</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search schools..."
                          className="pl-10 w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSchools.map((school) => (
                      <div
                        key={school.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors gap-3"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm ${
                            school.status === 'approved' ? 'bg-success/10 text-success' :
                            school.status === 'pending' ? 'bg-warning/10 text-warning' :
                            'bg-destructive/10 text-destructive'
                          }`}>
                            {school.name[0]}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-foreground truncate">{school.name}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-muted-foreground mt-1">
                              <span className="flex items-center gap-1 truncate">
                                <Mail className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{school.email}</span>
                              </span>
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{school.address}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <div className="text-right text-xs hidden sm:block">
                            <p className="text-muted-foreground">{school.teacherCount} teachers</p>
                            <p className="text-muted-foreground">{school.studentCount} students</p>
                          </div>
                          <Badge variant={
                            school.status === 'approved' ? 'default' :
                            school.status === 'pending' ? 'secondary' :
                            'destructive'
                          } className="text-xs">
                            {school.status}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Ban className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="teachers">
                    <TabsList>
                      <TabsTrigger value="teachers">Teachers ({teachers.length})</TabsTrigger>
                      <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
                      <TabsTrigger value="schools">School Admins ({schools.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="teachers" className="mt-4">
                      <div className="space-y-3">
                        {teachers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                {user.name[0]}
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleWarnUser(user.name)}>
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Warn
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleSuspendUser(user.name)}>
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="students" className="mt-4">
                      <div className="space-y-3">
                        {students.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-semibold">
                                {user.name[0]}
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleWarnUser(user.name)}>
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Warn
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleSuspendUser(user.name)}>
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="schools" className="mt-4">
                      <div className="space-y-3">
                        {schools.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                                {user.name[0]}
                              </div>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleWarnUser(user.name)}>
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Warn
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleSuspendUser(user.name)}>
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Manage Courses</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockCourses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-2xl">
                            📚
                          </div>
                          <div>
                            <p className="font-semibold">{course.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline">{course.category}</Badge>
                              <span className="text-xs text-muted-foreground">By {course.teacherName}</span>
                              <span className="text-xs text-muted-foreground">{course.enrolledCount} enrolled</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={handleDeleteCourse}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quizzes Tab */}
            <TabsContent value="quizzes">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Manage Quizzes</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Quiz
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quizzes.slice(0, 5).map((quiz) => (
                      <div key={quiz.id} className="flex items-center justify-between p-4 rounded-xl border border-border">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                            🎯
                          </div>
                          <div>
                            <p className="font-semibold">{quiz.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="outline">{quiz.questions.length} questions</Badge>
                              <span className="text-xs text-muted-foreground">{quiz.totalPoints} points</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
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

                          <div className="flex gap-2">
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
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
