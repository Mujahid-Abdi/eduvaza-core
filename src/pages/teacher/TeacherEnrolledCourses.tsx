import { motion } from 'framer-motion';
import { BookOpen, Clock, TrendingUp, Play, ChevronRight, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const TeacherEnrolledCourses = () => {

  // Mock enrolled courses for teacher learning
  const enrolledCourses = [
    {
      id: '1',
      title: 'Advanced Teaching Methodologies',
      description: 'Modern approaches to effective teaching',
      instructor: 'Dr. Sarah Johnson',
      category: 'Professional Development',
      level: 'advanced' as const,
      progress: 65,
      lastLesson: 'Interactive Learning Techniques',
      totalLessons: 12,
      completedLessons: 8,
      thumbnail: null,
    },
    {
      id: '2',
      title: 'Digital Tools for Educators',
      description: 'Master the latest educational technology',
      instructor: 'Prof. Michael Chen',
      category: 'Technology',
      level: 'intermediate' as const,
      progress: 30,
      lastLesson: 'Introduction to LMS Platforms',
      totalLessons: 10,
      completedLessons: 3,
      thumbnail: null,
    },
    {
      id: '3',
      title: 'Student Psychology & Motivation',
      description: 'Understanding student behavior and engagement',
      instructor: 'Dr. Emily Rodriguez',
      category: 'Psychology',
      level: 'beginner' as const,
      progress: 10,
      lastLesson: 'Getting Started',
      totalLessons: 15,
      completedLessons: 2,
      thumbnail: null,
    },
  ];

  // Available courses to browse
  const availableCourses = [
    {
      id: '4',
      title: 'Classroom Management Strategies',
      description: 'Effective techniques for managing diverse classrooms',
      instructor: 'Prof. David Williams',
      category: 'Professional Development',
      level: 'intermediate' as const,
      totalLessons: 8,
      enrolledCount: 234,
      rating: 4.8,
    },
    {
      id: '5',
      title: 'Assessment & Evaluation Methods',
      description: 'Modern approaches to student assessment',
      instructor: 'Dr. Lisa Anderson',
      category: 'Assessment',
      level: 'advanced' as const,
      totalLessons: 10,
      enrolledCount: 189,
      rating: 4.9,
    },
    {
      id: '6',
      title: 'Inclusive Education Practices',
      description: 'Creating inclusive learning environments',
      instructor: 'Prof. James Taylor',
      category: 'Inclusion',
      level: 'beginner' as const,
      totalLessons: 12,
      enrolledCount: 312,
      rating: 4.7,
    },
  ];

  const stats = {
    enrolledCourses: enrolledCourses.length,
    hoursLearned: 24,
    avgProgress: Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length),
    completedCourses: 2,
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
                  <p className="text-3xl font-bold text-foreground mt-1">{stats.hoursLearned}</p>
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
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
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
                          Instructor: {course.instructor}
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
                  ))}

                  {enrolledCourses.length === 0 && (
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
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {availableCourses.map((course) => (
                      <div
                        key={course.id}
                        className="rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      >
                        <div className="aspect-video bg-muted">
                          <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">By {course.instructor}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline">{course.level}</Badge>
                            <Badge variant="secondary">{course.category}</Badge>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-muted-foreground">
                              {course.totalLessons} lessons
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-yellow-600">★</span>
                              <span className="text-xs font-medium">{course.rating}</span>
                            </div>
                          </div>
                          <Button className="w-full mt-4" size="sm">
                            Enroll Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
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
