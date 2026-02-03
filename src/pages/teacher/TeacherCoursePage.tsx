import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Eye, Edit, Trash2, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CourseUploadDialog } from '@/components/school/CourseUploadDialog';
import { CourseEditDialog } from '@/components/school/CourseEditDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useI18n } from '@/contexts/I18nContext';
import { toast } from 'sonner';

export const TeacherCoursePage = () => {
  const { t } = useI18n();
  const [editingCourse, setEditingCourse] = useState<any>(null);

  // Mock data - will be replaced with real Firebase data
  const myCourses = [
    { 
      id: '1', 
      title: 'Mathematics 101', 
      description: 'Introduction to basic mathematics concepts',
      category: 'Mathematics',
      level: 'beginner' as const,
      language: 'en',
      enrolledStudents: 45,
      isPublished: true,
      lessons: 12,
      teacher: 'John Doe'
    },
    { 
      id: '2', 
      title: 'Advanced Calculus', 
      description: 'Deep dive into calculus',
      category: 'Mathematics',
      level: 'advanced' as const,
      language: 'en',
      enrolledStudents: 23,
      isPublished: true,
      lessons: 18,
      teacher: 'John Doe'
    },
    { 
      id: '3', 
      title: 'Physics Basics', 
      description: 'Fundamental physics principles',
      category: 'Physics',
      level: 'intermediate' as const,
      language: 'en',
      enrolledStudents: 32,
      isPublished: false,
      lessons: 8,
      teacher: 'John Doe'
    },
  ];

  const handleDeleteCourse = async (courseId: string) => {
    try {
      // TODO: Implement Firebase course deletion
      // await coursesService.deleteCourse(courseId);
      toast.success('Course deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const publishedCourses = myCourses.filter(c => c.isPublished);
  const draftCourses = myCourses.filter(c => !c.isPublished);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Create and manage your courses</p>
          </div>
          <CourseUploadDialog onCourseCreated={() => {
            // TODO: Refresh courses list
          }} />
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
                  <p className="text-3xl font-bold text-foreground mt-1">{publishedCourses.length}</p>
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
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {myCourses.reduce((sum, c) => sum + c.enrolledStudents, 0)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Courses Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Courses</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4">
              <div className="grid gap-4">
                {myCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-3xl flex-shrink-0">
                                📚
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                                    {course.isPublished ? 'Published' : 'Draft'}
                                  </Badge>
                                  <Badge variant="outline">{course.level}</Badge>
                                  <Badge variant="outline">{course.category}</Badge>
                                  <Badge variant="outline">{course.language.toUpperCase()}</Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                  <span>{course.lessons} lessons</span>
                                  <span>•</span>
                                  <span>{course.enrolledStudents} students</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingCourse(course)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{course.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteCourse(course.id)} 
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {myCourses.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No courses yet. Create your first course!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="published" className="mt-4">
              <div className="grid gap-4">
                {publishedCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-3xl flex-shrink-0">
                                📚
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="default">Published</Badge>
                                  <Badge variant="outline">{course.level}</Badge>
                                  <Badge variant="outline">{course.category}</Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                  <span>{course.lessons} lessons</span>
                                  <span>•</span>
                                  <span>{course.enrolledStudents} students</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingCourse(course)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{course.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteCourse(course.id)} 
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {publishedCourses.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No published courses yet.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="mt-4">
              <div className="grid gap-4">
                {draftCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center text-3xl flex-shrink-0">
                                📚
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="secondary">Draft</Badge>
                                  <Badge variant="outline">{course.level}</Badge>
                                  <Badge variant="outline">{course.category}</Badge>
                                </div>
                                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                  <span>{course.lessons} lessons</span>
                                  <span>•</span>
                                  <span>{course.enrolledStudents} students</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingCourse(course)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{course.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteCourse(course.id)} 
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {draftCourses.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No draft courses.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Edit Dialog */}
        {editingCourse && (
          <CourseEditDialog
            open={!!editingCourse}
            onOpenChange={(open) => !open && setEditingCourse(null)}
            course={editingCourse}
            onCourseUpdated={() => {
              // TODO: Refresh courses list
              setEditingCourse(null);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherCoursePage;
