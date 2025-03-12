import { useState, useEffect } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { coursesService } from '@/services/courses';
import { toast } from 'sonner';
import type { Course } from '@/types';

export const SchoolCoursePage = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch school's courses
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

  const handleCourseCreated = () => {
    // Refresh courses list
    if (user) {
      const schoolId = user.role === 'school' ? user.id : user.schoolId;
      if (schoolId) {
        coursesService.getCoursesBySchool(schoolId).then(setMyCourses);
      }
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await coursesService.deleteCourse(courseId);
      setMyCourses(myCourses.filter(c => c.id !== courseId));
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
            <h1 className="text-3xl font-bold">School Courses</h1>
            <p className="text-muted-foreground">Create and manage your school's courses</p>
          </div>
          <CourseUploadDialog onCourseCreated={handleCourseCreated} />
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
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {loading ? '...' : myCourses.length}
                  </p>
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
                  <p className="text-3xl font-bold text-foreground mt-1">
                    {loading ? '...' : publishedCourses.length}
                  </p>
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
                    {loading ? '...' : myCourses.reduce((sum, c) => sum + c.enrolledCount, 0)}
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
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                  <p className="text-muted-foreground mt-4">Loading courses...</p>
                </div>
              ) : (
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
                                    <span>{course.lessons.length} lessons</span>
                                    <span>•</span>
                                    <span>{course.enrolledCount} students</span>
                                    <span>•</span>
                                    <span>By: {course.teacherName}</span>
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
                        <p className="text-muted-foreground">No courses yet. Upload your first course!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
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
                                  <span>{course.lessons.length} lessons</span>
                                  <span>•</span>
                                  <span>{course.enrolledCount} students</span>
                                  <span>•</span>
                                  <span>By: {course.teacherName}</span>
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
                                  <span>{course.lessons.length} lessons</span>
                                  <span>•</span>
                                  <span>{course.enrolledCount} students</span>
                                  <span>•</span>
                                  <span>By: {course.teacherName}</span>
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
              handleCourseCreated();
              setEditingCourse(null);
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default SchoolCoursePage;
