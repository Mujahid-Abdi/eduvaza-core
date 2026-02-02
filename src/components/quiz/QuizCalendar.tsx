import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Zap,
  Users,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ScheduledQuiz } from '@/types/quiz';

interface QuizCalendarProps {
  scheduledQuizzes: ScheduledQuiz[];
  onQuizClick?: (quiz: ScheduledQuiz) => void;
  onJoinLive?: (quiz: ScheduledQuiz) => void;
}

export const QuizCalendar = ({ scheduledQuizzes, onQuizClick, onJoinLive }: QuizCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const quizzesByDate = useMemo(() => {
    const map = new Map<string, ScheduledQuiz[]>();
    scheduledQuizzes.forEach(sq => {
      const dateKey = new Date(sq.startTime).toDateString();
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(sq);
    });
    return map;
  }, [scheduledQuizzes]);

  const selectedDateQuizzes = useMemo(() => {
    if (!selectedDate) return [];
    return quizzesByDate.get(selectedDate.toDateString()) || [];
  }, [selectedDate, quizzesByDate]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const hasQuizzes = (day: number) => {
    const date = new Date(year, month, day);
    return quizzesByDate.has(date.toDateString());
  };

  const getQuizCount = (day: number) => {
    const date = new Date(year, month, day);
    return quizzesByDate.get(date.toDateString())?.length || 0;
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status: ScheduledQuiz['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-primary';
      case 'active': return 'bg-success';
      case 'completed': return 'bg-muted-foreground';
      case 'cancelled': return 'bg-destructive';
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      {/* Calendar Grid */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Quiz Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-semibold min-w-[140px] text-center">
              {monthNames[month]} {year}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Day Names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the 1st */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const hasQuiz = hasQuizzes(day);
              const quizCount = getQuizCount(day);
              const isSelected = selectedDate?.toDateString() === date.toDateString();

              return (
                <motion.button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square rounded-lg relative transition-all ${
                    isToday(day)
                      ? 'bg-primary text-primary-foreground font-bold'
                      : isSelected
                      ? 'bg-primary/20 ring-2 ring-primary'
                      : hasQuiz
                      ? 'bg-muted hover:bg-muted/80'
                      : 'hover:bg-muted/50'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm">{day}</span>
                  {hasQuiz && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {Array.from({ length: Math.min(quizCount, 3) }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${isToday(day) ? 'bg-primary-foreground' : 'bg-primary'}`}
                        />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Quizzes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate
              ? selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })
              : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {selectedDateQuizzes.length > 0 ? (
              <motion.div
                key={selectedDate?.toDateString()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {selectedDateQuizzes.map((sq, index) => (
                  <motion.div
                    key={sq.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onQuizClick?.(sq)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-1 h-full rounded-full ${getStatusColor(sq.status)}`} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{sq.quiz?.title || 'Quiz'}</h4>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTime(sq.startTime)}
                          {sq.isLive && (
                            <Badge variant="secondary" className="text-xs">
                              <Zap className="h-3 w-3 mr-1" />
                              Live
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {sq.duration} min • {sq.quiz?.questions.length} questions
                        </p>
                        {sq.status === 'active' && sq.isLive && (
                          <Button 
                            size="sm" 
                            className="mt-2 w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onJoinLive?.(sq);
                            }}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Join Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No quizzes scheduled</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};
