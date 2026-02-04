import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface QuizCreateDialogProps {
  onQuizCreated?: () => void;
}

export const QuizCreateDialog = ({ onQuizCreated }: QuizCreateDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    quizType: 'scheduled' as 'scheduled' | 'practice',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    duration: 60, // minutes
  });

  // Mock courses - will be fetched from Firebase (only school's courses)
  const myCourses = [
    { id: 'course1', title: 'Mathematics 101' },
    { id: 'course2', title: 'Physics Basics' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate dates only for scheduled quizzes
      if (formData.quizType === 'scheduled') {
        const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
        const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

        if (endDateTime <= startDateTime) {
          toast.error('End time must be after start time');
          setLoading(false);
          return;
        }
      }

      // TODO: Implement Firebase quiz creation
      // const quizData = {
      //   title: formData.title,
      //   courseId: formData.courseId,
      //   quizType: formData.quizType,
      //   schoolId: user?.id,
      //   createdBy: user?.id,
      //   ...(formData.quizType === 'scheduled' ? {
      //     startTime: new Date(`${formData.startDate}T${formData.startTime}`),
      //     endTime: new Date(`${formData.endDate}T${formData.endTime}`),
      //   } : {
      //     postedAt: new Date(),
      //   }),
      //   duration: formData.duration,
      //   questions: [],
      //   participants: [],
      //   createdAt: new Date(),
      // };
      // await firebaseService.createQuiz(quizData);

      toast.success('Quiz created successfully!');
      setOpen(false);
      setFormData({
        title: '',
        courseId: '',
        quizType: 'scheduled',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        duration: 60,
      });
      onQuizCreated?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Quiz</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Math Quiz 1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Select Course *</Label>
            <Select
              value={formData.courseId}
              onValueChange={(value) => setFormData({ ...formData, courseId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {myCourses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Only your uploaded courses are available
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quizType">Quiz Type *</Label>
            <Select
              value={formData.quizType}
              onValueChange={(value: 'scheduled' | 'practice') => setFormData({ ...formData, quizType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select quiz type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Scheduled (Multiplayer)</span>
                    <span className="text-xs text-muted-foreground">Time-based quiz with start/end times</span>
                  </div>
                </SelectItem>
                <SelectItem value="practice">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Practice (Anytime)</span>
                    <span className="text-xs text-muted-foreground">Students can take anytime for self-assessment</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.quizType === 'scheduled' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {formData.quizType === 'practice' && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Practice quizzes are available anytime for students to test their knowledge. No start or end date required.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
