import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useI18n } from '@/contexts/I18nContext';
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Clock,
  Award,
  Target,
  BarChart3,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const TeacherAnalytics = () => {
  const { t } = useI18n();

  // Mock analytics data - will be fetched from Firebase
  const overallStats = {
    totalStudents: 156,
    totalCourses: 8,
    totalQuizzes: 24,
    totalEnrollments: 342,
    averageRating: 4.7,
    completionRate: 68,
    activeStudents: 89,
    totalHoursTaught: 1240,
  };

  const courseAnalytics = [
    {
      id: '1',
      title: 'Mathematics 101',
      enrolledStudents: 45,
      completedStudents: 32,
      averageProgress: 71,
      averageScore: 85,
      totalQuizzes: 6,
      quizzesTaken: 180,
      rating: 4.8,
    },
    {
      id: '2',
      title: 'Advanced Calculus',
      enrolledStudents: 23,
      completedStudents: 12,
      averageProgress: 54,
      averageScore: 78,
      totalQuizzes: 8,
      quizzesTaken: 92,
      rating: 4.6,
    },
    {
      id: '3',
      title: 'Physics Basics',
      enrolledStudents: 32,
      completedStudents: 18,
      averageProgress: 62,
      averageScore: 82,
      totalQuizzes: 5,
      quizzesTaken: 120,
      rating: 4.9,
    },
  ];

  const quizAnalytics = [
    {
      id: '1',
      title: 'Math Quiz 1',
      course: 'Mathematics 101',
      totalAttempts: 45,
      averageScore: 85,
      passRate: 89,
      averageTime: 18, // minutes
    },
    {
      id: '2',
      title: 'Calculus Midterm',
      course: 'Advanced Calculus',
      totalAttempts: 23,
      averageScore: 78,
      passRate: 74,
      averageTime: 25,
    },
    {
      id: '3',
      title: 'Physics Final',
      course: 'Physics Basics',
      totalAttempts: 32,
      averageScore: 82,
      passRate: 81,
      averageTime: 22,
    },
  ];

  const studentsByCountry = [
    { country: 'United States', count: 45, flag: '🇺🇸' },
    { country: 'United Kingdom', count: 32, flag: '🇬🇧' },
    { country: 'Canada', count: 28, flag: '🇨🇦' },
    { country: 'Australia', count: 18, flag: '🇦🇺' },
    { country: 'Germany', count: 15, flag: '🇩🇪' },
    { country: 'France', count: 12, flag: '🇫🇷' },
    { country: 'India', count: 6, flag: '🇮🇳' },
  ];

  const recentActivity = [
    { type: 'enrollment', student: 'John Doe', course: 'Mathematics 101', time: '2 hours ago' },
    { type: 'quiz', student: 'Jane Smith', quiz: 'Math Quiz 1', score: 95, time: '3 hours ago' },
    { type: 'completion', student: 'Bob Johnson', course: 'Physics Basics', time: '5 hours ago' },
    { type: 'enrollment', student: 'Alice Brown', course: 'Advanced Calculus', time: '1 day ago' },
  ];

  const monthlyTrend = [
    { month: 'Jan', enrollments: 25, quizzes: 45 },
    { month: 'Feb', enrollments: 32, quizzes: 58 },
    { month: 'Mar', enrollments: 28, quizzes: 52 },
    { month: 'Apr', enrollments: 38, quizzes: 67 },
    { month: 'May', enrollments: 42, quizzes: 72 },
    { month: 'Jun', enrollments: 35, quizzes: 61 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Teaching Analytics</h1>
          <p className="text-muted-foreground">Overview of your teaching performance and student engagement</p>
        </motion.div>

        {/* Overall Stats */}
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
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{overallStats.totalStudents}</p>
                  <p className="text-xs text-green-600 mt-1">↑ {overallStats.activeStudents} active</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Enrollments</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{overallStats.totalEnrollments}</p>
                  <p className="text-xs text-muted-foreground mt-1">Across {overallStats.totalCourses} courses</p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/10">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quiz Completion</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{overallStats.completionRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">{overallStats.totalQuizzes} quizzes</p>
                </div>
                <div className="p-3 rounded-xl bg-accent/10">
                  <Trophy className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{overallStats.averageRating}</p>
                  <p className="text-xs text-yellow-600 mt-1">★★★★★</p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <Award className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Different Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="courses">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Courses Analytics */}
            <TabsContent value="courses" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Performance</CardTitle>
                  <CardDescription>Detailed analytics for each course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courseAnalytics.map((course) => (
                    <Card key={course.id} className="border-2">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">{course.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{course.enrolledStudents} enrolled</Badge>
                              <Badge variant="secondary">{course.completedStudents} completed</Badge>
                              <div className="flex items-center gap-1 text-yellow-600">
                                <Award className="h-4 w-4" />
                                <span className="text-sm font-medium">{course.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Avg Progress</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={course.averageProgress} className="flex-1 h-2" />
                              <span className="text-sm font-medium">{course.averageProgress}%</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Avg Score</p>
                            <p className="text-2xl font-bold text-foreground">{course.averageScore}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Quizzes</p>
                            <p className="text-2xl font-bold text-foreground">{course.totalQuizzes}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Quiz Attempts</p>
                            <p className="text-2xl font-bold text-foreground">{course.quizzesTaken}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quizzes Analytics */}
            <TabsContent value="quizzes" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quiz Performance</CardTitle>
                  <CardDescription>Analytics for all your quizzes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quizAnalytics.map((quiz) => (
                      <div key={quiz.id} className="p-4 rounded-lg border">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">{quiz.title}</h3>
                            <p className="text-sm text-muted-foreground">{quiz.course}</p>
                          </div>
                          <Badge>{quiz.totalAttempts} attempts</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Average Score</p>
                            <p className="text-xl font-bold text-foreground">{quiz.averageScore}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Pass Rate</p>
                            <p className="text-xl font-bold text-green-600">{quiz.passRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Avg Time</p>
                            <p className="text-xl font-bold text-foreground">{quiz.averageTime}m</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Students Analytics */}
            <TabsContent value="students" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Students by Country
                    </CardTitle>
                    <CardDescription>Geographic distribution of your students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {studentsByCountry.map((item, index) => (
                        <div key={item.country} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{item.flag}</span>
                            <div>
                              <p className="font-medium">{item.country}</p>
                              <p className="text-sm text-muted-foreground">{item.count} students</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(item.count / overallStats.totalStudents) * 100} 
                              className="w-24 h-2" 
                            />
                            <span className="text-sm font-medium w-12 text-right">
                              {Math.round((item.count / overallStats.totalStudents) * 100)}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Student Engagement
                    </CardTitle>
                    <CardDescription>Key engagement metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Active Students</p>
                        <p className="text-2xl font-bold">{overallStats.activeStudents}</p>
                      </div>
                      <Progress value={(overallStats.activeStudents / overallStats.totalStudents) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.round((overallStats.activeStudents / overallStats.totalStudents) * 100)}% of total students
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Course Completion</p>
                        <p className="text-2xl font-bold">{overallStats.completionRate}%</p>
                      </div>
                      <Progress value={overallStats.completionRate} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Average across all courses
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-muted">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">Total Hours Taught</p>
                        <p className="text-2xl font-bold">{overallStats.totalHoursTaught}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Across all courses and students
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Analytics */}
            <TabsContent value="activity" className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest student interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'enrollment' ? 'bg-primary/10' :
                            activity.type === 'quiz' ? 'bg-accent/10' :
                            'bg-success/10'
                          }`}>
                            {activity.type === 'enrollment' && <Users className="h-4 w-4 text-primary" />}
                            {activity.type === 'quiz' && <Trophy className="h-4 w-4 text-accent" />}
                            {activity.type === 'completion' && <Target className="h-4 w-4 text-success" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{activity.student}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.type === 'enrollment' && `Enrolled in ${activity.course}`}
                              {activity.type === 'quiz' && `Completed ${activity.quiz} - Score: ${activity.score}%`}
                              {activity.type === 'completion' && `Completed ${activity.course}`}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Monthly Trends
                    </CardTitle>
                    <CardDescription>Enrollments and quiz activity over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {monthlyTrend.map((month) => (
                        <div key={month.month} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{month.month}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-muted-foreground">{month.enrollments} enrollments</span>
                              <span className="text-muted-foreground">{month.quizzes} quizzes</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Progress value={(month.enrollments / 50) * 100} className="h-2" />
                            <Progress value={(month.quizzes / 80) * 100} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherAnalytics;
