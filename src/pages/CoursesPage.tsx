import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, BookOpen, Users, Clock, Star, X, CheckCircle, MapPin, GraduationCap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockCategories } from '@/services/mockData';
import { coursesService } from '@/services/courses';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { AIChatbotButton } from '@/components/shared';
import type { Course } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CoursesPage = () => {
  const { t } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState<Course | null>(null);

  // Fetch courses and enrollments from Firebase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedCourses = await coursesService.getCourses();
        setCourses(fetchedCourses);

        // Fetch user's enrollments if authenticated
        if (isAuthenticated && user && (user.role === 'student' || user.role === 'teacher')) {
          const enrollments = await coursesService.getEnrollments(user.id);
          setEnrolledCourseIds(enrollments.map(e => e.courseId));
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication Required',
        description: 'Please login to enroll in courses',
        variant: 'destructive',
      });
      navigate('/auth/login');
      return;
    }

    if (user.role !== 'student' && user.role !== 'teacher') {
      toast({
        title: 'Access Denied',
        description: 'Only students and teachers can enroll in courses',
        variant: 'destructive',
      });
      return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Check if course is paid
    if (course.isPaid) {
      setCourseToEnroll(course);
      setIsPaymentDialogOpen(true);
      return;
    }

    // Free course - enroll directly
    await enrollInCourse(courseId);
  };

  const enrollInCourse = async (courseId: string) => {
    setEnrollingCourseId(courseId);
    try {
      await coursesService.enrollStudent(user!.id, courseId);
      setEnrolledCourseIds([...enrolledCourseIds, courseId]);
      
      toast({
        title: 'Successfully Enrolled!',
        description: 'You can now access this course from your dashboard',
      });

      // Navigate to appropriate dashboard
      if (user!.role === 'student') {
        navigate('/student/dashboard');
      } else if (user!.role === 'teacher') {
        navigate('/teacher/my-learning');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: 'Enrollment Failed',
        description: 'Failed to enroll in course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!courseToEnroll) return;
    
    toast({
      title: 'Payment Confirmed (Demo)',
      description: 'In a real system, payment would be processed here.',
    });
    
    setIsPaymentDialogOpen(false);
    await enrollInCourse(courseToEnroll.id);
    setCourseToEnroll(null);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsDialogOpen(true);
  };

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
      const matchesLanguage = selectedLanguage === 'all' || course.language === selectedLanguage;
      const matchesPricing = selectedPricing === 'all' || 
                            (selectedPricing === 'free' && !course.isPaid) ||
                            (selectedPricing === 'paid' && course.isPaid);
      return matchesSearch && matchesCategory && matchesLevel && matchesLanguage && matchesPricing;
    });
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedLanguage, selectedPricing]);

  const hasActiveFilters = selectedCategory !== 'all' || selectedLevel !== 'all' || selectedLanguage !== 'all' || selectedPricing !== 'all';

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel('all');
    setSelectedLanguage('all');
    setSelectedPricing('all');
  };

  const featuredCourses = filteredCourses.slice(0, 3);
  const popularCourses = filteredCourses.slice(0, 6);
  const recentCourses = filteredCourses.slice(0, 8);

  return (
    <MainLayout>
      <AIChatbotButton />
      {/* Hero Section */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explore Our Courses
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover thousands of courses taught by expert instructors. Learn at your own pace.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search for courses..."
                className="pl-14 pr-4 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Pills */}
            {hasActiveFilters && (
              <div className="mt-6 flex flex-wrap items-center gap-2 justify-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                  </Badge>
                )}
                {selectedLevel !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLevel}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLevel('all')} />
                  </Badge>
                )}
                {selectedLanguage !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedLanguage.toUpperCase()}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedLanguage('all')} />
                  </Badge>
                )}
                {selectedPricing !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedPricing === 'free' ? 'Free' : 'Paid'}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPricing('all')} />
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear all
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="all">
            {/* Combined Filter Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              {/* View Tabs */}
              <TabsList>
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] transition-all hover:shadow-md hover:border-primary">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {mockCategories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Level Filter */}
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[160px] transition-all hover:shadow-md hover:border-primary">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              {/* Language Filter */}
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[150px] transition-all hover:shadow-md hover:border-primary">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="sw">Swahili</SelectItem>
                  <SelectItem value="ar">Arabic</SelectItem>
                </SelectContent>
              </Select>

              {/* Pricing Filter */}
              <Select value={selectedPricing} onValueChange={setSelectedPricing}>
                <SelectTrigger className="w-[140px] transition-all hover:shadow-md hover:border-primary">
                  <SelectValue placeholder="Pricing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="gap-2 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              )}

              {/* Results Count */}
              <div className="ml-auto text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? 's' : ''}
              </div>
            </div>

            <TabsContent value="all">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="aspect-video bg-muted animate-pulse" />
                      <CardContent className="p-5">
                        <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
                  {filteredCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group h-full flex flex-col">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl">
                              📚
                            </div>
                          )}
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <Badge className="bg-primary text-primary-foreground">
                              {course.level}
                            </Badge>
                            {course.isPaid ? (
                              <Badge className="bg-green-600 text-white">
                                {course.currency} {course.price}
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-600 text-white">
                                FREE
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-5 flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {course.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {course.language.toUpperCase()}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-lg text-foreground mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border mb-4">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{course.lessons.length} lessons</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{course.enrolledCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{course.lessons.reduce((sum, l) => sum + (l.duration || 0), 0)}m</span>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-auto">
                            <Button 
                              className="flex-1" 
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCourse(course)}
                            >
                              View
                            </Button>
                            {isEnrolled(course.id) ? (
                              <Button 
                                className="flex-1" 
                                variant="default"
                                size="sm"
                                asChild
                              >
                                <Link to={user?.role === 'student' ? '/student/dashboard' : '/teacher/my-learning'}>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Enrolled
                                </Link>
                              </Button>
                            ) : (
                              <Button 
                                className="flex-1" 
                                variant="default"
                                size="sm"
                                onClick={() => handleEnroll(course.id)}
                                disabled={enrollingCourseId === course.id}
                              >
                                {enrollingCourseId === course.id ? 'Enrolling...' : 'Enroll'}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured">
              <div className="grid md:grid-cols-3 gap-6">
                {featuredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group h-full flex flex-col">
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">
                            📚
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-yellow-500 text-white">Featured</Badge>
                        </div>
                      </div>
                      <CardContent className="p-5 flex flex-col flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                          {course.description}
                        </p>
                        {isEnrolled(course.id) ? (
                          <Button 
                            className="w-full" 
                            variant="default"
                            asChild
                          >
                            <Link to={user?.role === 'student' ? '/student/dashboard' : '/teacher/my-learning'}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Enrolled
                            </Link>
                          </Button>
                        ) : (
                          <Button 
                            className="w-full" 
                            variant="outline"
                            onClick={() => handleEnroll(course.id)}
                            disabled={enrollingCourseId === course.id}
                          >
                            {enrollingCourseId === course.id ? 'Enrolling...' : 'Enroll Now'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-6">
                {popularCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary font-bold text-lg flex-shrink-0">
                            #{index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground line-clamp-1">{course.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{course.level}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {course.enrolledCount} students
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Categories Section - Moved from top */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="container mx-auto px-4">
          <h3 className="text-xl font-semibold mb-6 text-center">Browse by Category</h3>
          <div className="flex items-center gap-4 overflow-x-auto pb-4 justify-center flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All Courses
            </Button>
            {mockCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.name)}
                className="whitespace-nowrap"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of students already learning on AfEdulight</p>
          <Button variant="secondary" size="lg">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Course Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCourse && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedCourse.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Course Image */}
                <div className="aspect-video bg-muted relative overflow-hidden rounded-lg">
                  {selectedCourse.thumbnail ? (
                    <img
                      src={selectedCourse.thumbnail}
                      alt={selectedCourse.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      📚
                    </div>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{selectedCourse.category}</Badge>
                  <Badge variant="outline">{selectedCourse.level}</Badge>
                  <Badge variant="outline">{selectedCourse.language.toUpperCase()}</Badge>
                  {selectedCourse.isPublished && <Badge variant="default">Published</Badge>}
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-muted-foreground">{selectedCourse.description}</p>
                </div>

                {/* Star Rating */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Rating</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <Star className="h-5 w-5 fill-gray-300 text-gray-300" />
                    </div>
                    <span className="text-lg font-semibold">4.0</span>
                    <span className="text-muted-foreground">({selectedCourse.enrolledCount} students)</span>
                  </div>
                </div>

                {/* Teacher/School Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Instructor</h3>
                    </div>
                    <p className="text-muted-foreground">{selectedCourse.teacherName}</p>
                    {selectedCourse.schoolId && (
                      <p className="text-sm text-muted-foreground mt-1">
                        School ID: {selectedCourse.schoolId}
                      </p>
                    )}
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">Category</h3>
                    </div>
                    <p className="text-muted-foreground">{selectedCourse.category || 'Not specified'}</p>
                  </div>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <BookOpen className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{selectedCourse.lessons.length}</p>
                    <p className="text-sm text-muted-foreground">Lessons</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{selectedCourse.enrolledCount}</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted/50">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">
                      {selectedCourse.lessons.reduce((sum, l) => sum + (l.duration || 0), 0)}m
                    </p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </div>

                {/* Lessons List */}
                {selectedCourse.lessons.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Course Content</h3>
                    <div className="space-y-2">
                      {selectedCourse.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{lesson.title}</p>
                              {lesson.content && (
                                <p className="text-sm text-muted-foreground line-clamp-1">{lesson.content.substring(0, 100)}</p>
                              )}
                            </div>
                          </div>
                          {lesson.duration && (
                            <Badge variant="outline">{lesson.duration}m</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  {isEnrolled(selectedCourse.id) ? (
                    <Button 
                      className="flex-1" 
                      size="lg"
                      asChild
                    >
                      <Link to={user?.role === 'student' ? '/student/dashboard' : '/teacher/my-learning'}>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Go to Course
                      </Link>
                    </Button>
                  ) : (
                    <Button 
                      className="flex-1" 
                      size="lg"
                      onClick={() => {
                        handleEnroll(selectedCourse.id);
                        setIsDialogOpen(false);
                      }}
                      disabled={enrollingCourseId === selectedCourse.id}
                    >
                      {enrollingCourseId === selectedCourse.id ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Course Payment (Demo)</DialogTitle>
          </DialogHeader>
          {courseToEnroll && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">{courseToEnroll.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="text-2xl font-bold text-primary">
                    {courseToEnroll.currency} {courseToEnroll.price}
                  </span>
                </div>
              </div>

              {courseToEnroll.paymentDetails && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Payment Methods:</h4>
                  
                  {courseToEnroll.paymentDetails.bankName && (
                    <div className="p-3 bg-muted/50 rounded-md space-y-1">
                      <p className="font-medium text-sm">Bank Transfer</p>
                      <p className="text-xs text-muted-foreground">Bank: {courseToEnroll.paymentDetails.bankName}</p>
                      <p className="text-xs text-muted-foreground">Account: {courseToEnroll.paymentDetails.accountNumber}</p>
                      <p className="text-xs text-muted-foreground">Name: {courseToEnroll.paymentDetails.accountName}</p>
                    </div>
                  )}

                  {courseToEnroll.paymentDetails.mobileMoneyNumber && (
                    <div className="p-3 bg-muted/50 rounded-md space-y-1">
                      <p className="font-medium text-sm">Mobile Money</p>
                      <p className="text-xs text-muted-foreground">Provider: {courseToEnroll.paymentDetails.mobileMoneyProvider}</p>
                      <p className="text-xs text-muted-foreground">Number: {courseToEnroll.paymentDetails.mobileMoneyNumber}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <p className="text-xs text-yellow-800 dark:text-yellow-200">
                  <strong>Demo Mode:</strong> This is a demonstration. In a real system, you would complete the payment through your preferred method, then the instructor would verify and grant access.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsPaymentDialogOpen(false);
                    setCourseToEnroll(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handlePaymentConfirm}
                >
                  Confirm Payment (Demo)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CoursesPage;
