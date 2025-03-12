import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { BookOpen, Search, Plus, Eye, Edit, Trash2, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CourseUploadDialog } from '@/components/school/CourseUploadDialog';
import { CourseEditDialog } from '@/components/school/CourseEditDialog';
import { coursesService } from '@/services/courses';
import { toast } from 'sonner';
import type { Course } from '@/types';

export const ManageCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const allCourses = await coursesService.getAllCourses();
        setCourses(allCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleCourseCreated = () => {
    // Refresh courses list
    coursesService.getAllCourses().then(setCourses);
  };

  const handleDeleteCourse = async (courseId: string, title: string) => {
    try {
      await coursesService.deleteCourse(courseId);
      setCourses(courses.filter(c => c.id !== courseId));
      toast.success(`${title} has been deleted`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category)))];
  const levels = ['all', 'beginner', 'intermediate', 'advanced'];

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.isPublished).length,
    totalEnrollments: courses.reduce((acc, c) => acc + c.enrolledCount, 0),
    avgEnrollment: courses.length > 0 ? Math.round(courses.reduce((acc, c) => acc + c.enrolledCount, 0) / courses.length) : 0,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-8 w-8" />
              Manage Courses
            </h1>
            <p className="text-muted-foreground mt-2">View, create, and manage all courses</p>
          </div>
          <CourseUploadDialog onCourseCreated={handleCourseCreated} />
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <p className="text-sm text-muted-foreground">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.totalEnrollments}</div>
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.avgEnrollment}</div>
              <p className="text-sm text-muted-foreground">Avg per Course</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses List */}
        <Card>
          <CardHeader>
            <CardTitle>Courses ({filteredCourses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground mt-4">Loading courses...</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="space-y-3">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">📚</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{course.title}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{course.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant="secondary">{course.level}</Badge>
                          <Badge variant={course.isPublished ? 'default' : 'secondary'}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            By {course.teacherName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {course.lessons.length} lessons
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {course.enrolledCount} enrolled
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setEditingCourse(course)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
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
                              onClick={() => handleDeleteCourse(course.id, course.title)} 
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No courses found</p>
              </div>
            )}
          </CardContent>
        </Card>

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

export default ManageCourses;
