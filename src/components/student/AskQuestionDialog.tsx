import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { submitQuestion } from '@/services/studentQuestions';
import { useAuth } from '@/contexts/AuthContext';

interface AskQuestionDialogProps {
  type: 'course' | 'quiz';
  itemId: string;
  itemTitle: string;
  teacherId: string;
  teacherName: string;
  schoolId?: string;
}

export const AskQuestionDialog = ({
  type,
  itemId,
  itemTitle,
  teacherId,
  teacherName,
  schoolId,
}: AskQuestionDialogProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast.error('Please enter your question');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to ask questions');
      return;
    }

    setLoading(true);
    try {
      await submitQuestion({
        studentId: user.uid,
        studentName: user.name || 'Anonymous',
        teacherId,
        teacherName,
        schoolId,
        type,
        itemId,
        itemTitle,
        question: question.trim(),
      });

      toast.success('Question submitted successfully! Your teacher will respond soon.');
      setQuestion('');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Ask Question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium mb-1">
              {type === 'course' ? 'Course' : 'Quiz'}: {itemTitle}
            </p>
            <p className="text-xs text-muted-foreground">
              Teacher: {teacherName}
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Question</label>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here... Be specific to get the best answer!"
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Your teacher will be notified and will respond as soon as possible.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !question.trim()}>
            {loading ? 'Submitting...' : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit Question
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
