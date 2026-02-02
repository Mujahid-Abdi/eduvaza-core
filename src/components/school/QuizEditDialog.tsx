import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface QuizEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: {
    id: string;
    title: string;
    course: string;
    startTime: string;
    endTime: string;
  };
  onQuizUpdated?: () => void;
}

export const QuizEditDialog = ({ open, onOpenChange, quiz, onQuizUpdated }: QuizEditDialogProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Parse existing date/time
  const parseDateTime = (dateTimeStr: string) => {
    const [date, time] = dateTimeStr.split(' ');
    return { date, time };
  };

  const startDateTime = parseDateTime(quiz.startTime);
  const endDateTime = parseDateTime(quiz.endTime);

  const [formData, setFormData] = useState({
    title: quiz.title,
    courseId: quiz.course,
    startDate: startDateTime.date,
    startTime: startDateTime.time,
    endDate: endDateTime.date,
    endTime: endDateTime.time,
  });

  useEffect(() => {
    const start = parseDateTime(quiz.startTime);
    const end = parseDateTime(quiz.endTime);
    setFormData({
      title: quiz.title,
      courseId: quiz.course,
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
    });
  }, [quiz]);

  // Mock courses - will be fetched from Firebase (only school's courses)
  const myCourses = [
    { id: 'course1', title: 'Mathematics 101' },
    { id: 'course2', title: 'Physics Basics' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      if (endDateTime <= startDateTime) {
        toast.error('End time must be after start time');
        setLoading(false);
        return;
      }

      // TODO: Implement Firebase quiz update
      // await quizService.updateQuiz(quiz.id, {
      //   title: formData.title,
      //   courseId: formData.courseId,
      //   startTime: startDateTime,
      //   endTime: endDateTime,
      // });

      toast.success('Quiz updated successfully!');
      onOpenChange(false);
      onQuizUpdated?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
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
          </div>

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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Quiz'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
