import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Zap, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Quiz, ScheduledQuiz } from '@/types/quiz';
import type { Class } from '@/types';

interface QuizSchedulerProps {
  quiz: Quiz;
  classes: Class[];
  onSchedule: (data: Partial<ScheduledQuiz>) => void;
  onCancel: () => void;
}

export const QuizScheduler = ({ quiz, classes, onSchedule, onCancel }: QuizSchedulerProps) => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState(quiz.timeLimit || 15);
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>();

  const handleSchedule = () => {
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    onSchedule({
      quizId: quiz.id,
      classId: selectedClass || undefined,
      startTime: startDateTime,
      endTime: endDateTime,
      duration,
      isLive: false,
      maxParticipants,
    });
  };

  const isValid = date && startTime && endTime && new Date(`${date}T${startTime}`) < new Date(`${date}T${endTime}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Schedule Quiz
          </CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge>{quiz.title}</Badge>
            <Badge variant="outline">{quiz.questions.length} questions</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Class Selection */}
          <div className="space-y-2">
            <Label>Assign to Class (Optional)</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class or leave open" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students (Open Access)</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} ({cls.studentCount} students)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 15)}
                min={5}
                max={180}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          {/* Summary */}
          {isValid && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg border border-primary/20 bg-primary/5"
            >
              <h4 className="font-medium mb-2">Schedule Summary</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(`${date}T${startTime}`).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {startTime} - {endTime} ({duration} min quiz)
                </p>
                {selectedClass && (
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {classes.find(c => c.id === selectedClass)?.name || 'All Students'}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSchedule} 
              disabled={!isValid}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              Schedule Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
