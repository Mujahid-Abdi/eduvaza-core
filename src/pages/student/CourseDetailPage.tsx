import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Users, Globe, Award, Mail, Phone, MapPin, Play, CheckCircle2, Loader2 } from 'lucide-react';
import { StudentLayout } from '@/components/layout/StudentLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { coursesService } from '@/services/courses';
import { toast } from 'sonner';
import type { Course } from '@/types';

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch course from Firebase
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const fetchedCourse = await coursesService.getCourseById(courseId);
        setCourse(fetchedCourse || null);
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </StudentLayout>
    );
  }
  
  if (!course) {
    return (
      <StudentLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Course not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </StudentLayout>
    );
  }

  // Mock enrollment data
  const isEnrolled = true;
  const progress = 45;
  const completedLessons = Math.floor(course.lessons.length * 0.45);

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
          <div className="relative p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-48 h-48 rounded-xl bg-muted overflow-hidden flex-shrink-0">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">📚</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge variant="outline">{course.level}</Badge>
                  <Badge>{course.language.toUpperCase()}</Badge>
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-3">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledCount} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{course.lessons.length} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{course.lessons.reduce((sum, l) => sum + (l.duration || 0), 0)} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>{course.language}</span>
                  </div>
                </div>
                {isEnrolled && (
                  <div className="mt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Progress value={progress} className="flex-1 h-3" />
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {completedLessons} of {course.lessons.length} lessons completed
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>About This Course</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Course Description</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      This comprehensive course is designed to provide you with in-depth knowledge and practical skills. 
                      Through a series of carefully structured lessons, you'll gain hands-on experience and learn from 
                      real-world examples. Whether you're a beginner or looking to advance your skills, this course 
                      offers valuable insights and techniques that you can apply immediately.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3">What You'll Learn</h3>
                    <ul className="space-y-2">
                      {[
                        'Master fundamental concepts and principles',
                        'Apply practical techniques in real-world scenarios',
                        'Develop problem-solving and critical thinking skills',
                        'Build confidence through hands-on exercises',
                        'Gain industry-relevant knowledge and best practices',
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Course Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Award className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Level</p>
                          <p className="text-sm text-muted-foreground capitalize">{course.level}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Category</p>
                          <p className="text-sm text-muted-foreground">{course.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Globe className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Language</p>
                          <p className="text-sm text-muted-foreground uppercase">{course.language}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Users className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Enrolled</p>
                          <p className="text-sm text-muted-foreground">{course.enrolledCount} students</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {course.curriculum && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="font-semibold text-lg mb-3">Curriculum</h3>
                        <p className="text-muted-foreground">{course.curriculum}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Lessons Tab */}
            <TabsContent value="lessons" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Course Lessons</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        onClick={() => navigate(`/student/courses/${courseId}/learn?lesson=${index}`)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary font-semibold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground">{lesson.title}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {lesson.contentType}
                            </Badge>
                            {lesson.duration && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.duration} min
                              </span>
                            )}
                          </div>
                        </div>
                        {isEnrolled && index < completedLessons ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Play className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Start Learning Button */}
                  {isEnrolled && (
                    <Button 
                      className="w-full mt-6" 
                      size="lg"
                      onClick={() => navigate(`/student/courses/${courseId}/learn?lesson=${completedLessons}`)}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {completedLessons > 0 ? 'Continue Learning' : 'Start Learning'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Instructor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
                      👨‍🏫
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{course.teacherName}</h3>
                      <p className="text-sm text-muted-foreground">Course Instructor</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Get in Touch</h3>
                    <p className="text-muted-foreground">
                      Have questions about the course? Need clarification on any topic? Feel free to reach out!
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">instructor@afedulight.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Phone className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">Office Hours</p>
                          <p className="text-sm text-muted-foreground">Mon-Fri, 9:00 AM - 5:00 PM</p>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full mt-4">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold text-lg mb-3">Response Time</h3>
                    <p className="text-muted-foreground">
                      I typically respond to messages within 24-48 hours. For urgent matters, please mark your 
                      message as high priority.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </StudentLayout>
  );
};

export default CourseDetailPage;
