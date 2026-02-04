import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  FileText,
  Video,
  BookOpen,
  List,
  X,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PDFViewer } from '@/components/content/PDFViewer';
import { VideoPlayer } from '@/components/content/VideoPlayer';
import { AskQuestionDialog } from '@/components/student/AskQuestionDialog';
import { coursesService } from '@/services/courses';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Lesson, Course } from '@/types';

export const LessonViewerPage = () => {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const lessonIndex = parseInt(searchParams.get('lesson') || '0', 10);

  // State
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({});

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
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Course not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const currentLesson = course.lessons[lessonIndex];
  const totalLessons = course.lessons.length;
  const overallProgress = (completedLessons.length / totalLessons) * 100;

  // Navigate to lesson
  const goToLesson = (index: number) => {
    if (index >= 0 && index < totalLessons) {
      setSearchParams({ lesson: index.toString() });
    }
  };

  // Handle lesson progress
  const handleProgress = (lessonId: string, progress: number) => {
    setLessonProgress((prev) => ({
      ...prev,
      [lessonId]: progress,
    }));
  };

  // Mark lesson as complete
  const handleComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
      toast.success('Lesson completed!');
    }
  };

  // Mark current lesson complete manually
  const markAsComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      handleComplete(currentLesson.id);
    }
  };

  const getContentIcon = (type: Lesson['contentType']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r bg-card flex flex-col overflow-hidden"
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/student/courses/${courseId}`)}
                className="mb-3"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <h2 className="font-semibold text-lg truncate">{course.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={overallProgress} className="flex-1 h-2" />
                <span className="text-xs text-muted-foreground">
                  {Math.round(overallProgress)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedLessons.length} of {totalLessons} lessons completed
              </p>
            </div>

            {/* Lesson List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {course.lessons.map((lesson, index) => {
                  const isCompleted = completedLessons.includes(lesson.id);
                  const isCurrent = index === lessonIndex;
                  const progress = lessonProgress[lesson.id] || 0;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => goToLesson(index)}
                      className={cn(
                        'w-full text-left p-3 rounded-lg mb-1 transition-colors',
                        isCurrent
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-muted'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium flex-shrink-0',
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              'font-medium text-sm truncate',
                              isCurrent && 'text-primary'
                            )}
                          >
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs py-0">
                              {getContentIcon(lesson.contentType)}
                              <span className="ml-1">{lesson.contentType}</span>
                            </Badge>
                            {lesson.duration && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {lesson.duration}m
                              </span>
                            )}
                          </div>
                          {progress > 0 && !isCompleted && (
                            <Progress value={progress} className="h-1 mt-2" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <X className="h-4 w-4" /> : <List className="h-4 w-4" />}
            </Button>
            <div>
              <p className="text-sm text-muted-foreground">
                Lesson {lessonIndex + 1} of {totalLessons}
              </p>
              <h1 className="font-semibold truncate max-w-[300px] md:max-w-none">
                {currentLesson?.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Ask Question */}
            <AskQuestionDialog
              type="course"
              itemId={courseId || ''}
              itemTitle={course.title}
              teacherId={course.teacherId}
              teacherName={course.teacherName}
              schoolId={course.schoolId}
            />

            {/* Mark Complete */}
            {currentLesson && !completedLessons.includes(currentLesson.id) && (
              <Button variant="outline" size="sm" onClick={markAsComplete}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {currentLesson ? (
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              {/* Content based on type */}
              {currentLesson.contentType === 'pdf' && currentLesson.pdfUrl ? (
                <PDFViewer
                  src={currentLesson.pdfUrl}
                  title={currentLesson.title}
                  allowDownload={true}
                  onProgress={(page, total) =>
                    handleProgress(currentLesson.id, (page / total) * 100)
                  }
                  className="h-[calc(100vh-200px)]"
                />
              ) : currentLesson.contentType === 'video' && currentLesson.videoUrl ? (
                <div className="space-y-4">
                  <VideoPlayer
                    src={currentLesson.videoUrl}
                    title={currentLesson.title}
                    allowDownload={true}
                    onProgress={(time, duration) =>
                      handleProgress(currentLesson.id, (time / duration) * 100)
                    }
                    onComplete={() => handleComplete(currentLesson.id)}
                    className="aspect-video rounded-lg overflow-hidden"
                  />
                  {/* Video description/notes area */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Lesson Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {currentLesson.content || 'No additional notes for this lesson.'}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                /* Text content */
                <Card>
                  <CardContent className="p-6 prose prose-sm md:prose-base max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentLesson.content || '<p>No content available.</p>',
                      }}
                    />
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a lesson to begin</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-card">
          <Button
            variant="outline"
            onClick={() => goToLesson(lessonIndex - 1)}
            disabled={lessonIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {lessonIndex + 1} / {totalLessons}
          </div>

          <Button
            onClick={() => goToLesson(lessonIndex + 1)}
            disabled={lessonIndex === totalLessons - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LessonViewerPage;
