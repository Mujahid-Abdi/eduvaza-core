import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Medal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuizLeaderboardDialogProps {
  quizId: string;
  quizTitle: string;
}

export const QuizLeaderboardDialog = ({ quizId, quizTitle }: QuizLeaderboardDialogProps) => {
  // Mock data - will be fetched from Firebase
  const topStudents = [
    { rank: 1, name: 'Alice Johnson', score: 98, country: 'Kenya', flag: '🇰🇪' },
    { rank: 2, name: 'Bob Smith', score: 95, country: 'Nigeria', flag: '🇳🇬' },
    { rank: 3, name: 'Carol Williams', score: 92, country: 'South Africa', flag: '🇿🇦' },
    { rank: 4, name: 'David Brown', score: 90, country: 'Ghana', flag: '🇬🇭' },
    { rank: 5, name: 'Emma Davis', score: 88, country: 'Tanzania', flag: '🇹🇿' },
    { rank: 6, name: 'Frank Miller', score: 85, country: 'Kenya', flag: '🇰🇪' },
    { rank: 7, name: 'Grace Wilson', score: 83, country: 'Uganda', flag: '🇺🇬' },
    { rank: 8, name: 'Henry Moore', score: 82, country: 'Rwanda', flag: '🇷🇼' },
    { rank: 9, name: 'Ivy Taylor', score: 80, country: 'Ethiopia', flag: '🇪🇹' },
    { rank: 10, name: 'Jack Anderson', score: 78, country: 'Nigeria', flag: '🇳🇬' },
    { rank: 11, name: 'Kate Thomas', score: 76, country: 'Kenya', flag: '🇰🇪' },
    { rank: 12, name: 'Liam Jackson', score: 75, country: 'South Africa', flag: '🇿🇦' },
    { rank: 13, name: 'Mia White', score: 73, country: 'Ghana', flag: '🇬🇭' },
    { rank: 14, name: 'Noah Harris', score: 72, country: 'Tanzania', flag: '🇹🇿' },
    { rank: 15, name: 'Olivia Martin', score: 70, country: 'Kenya', flag: '🇰🇪' },
    { rank: 16, name: 'Peter Thompson', score: 68, country: 'Uganda', flag: '🇺🇬' },
    { rank: 17, name: 'Quinn Garcia', score: 67, country: 'Rwanda', flag: '🇷🇼' },
    { rank: 18, name: 'Rachel Martinez', score: 65, country: 'Ethiopia', flag: '🇪🇹' },
    { rank: 19, name: 'Sam Robinson', score: 63, country: 'Nigeria', flag: '🇳🇬' },
    { rank: 20, name: 'Tina Clark', score: 62, country: 'Kenya', flag: '🇰🇪' },
  ];

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/10 border-yellow-500/20';
    if (rank === 2) return 'bg-gray-400/10 border-gray-400/20';
    if (rank === 3) return 'bg-amber-600/10 border-amber-600/20';
    return 'bg-muted/50';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0">
          View Top 20 Students
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 20 Students - {quizTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-2">
          {topStudents.map((student) => (
            <Card key={student.rank} className={getRankColor(student.rank)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-background border-2">
                      {getMedalIcon(student.rank) || (
                        <span className="font-bold text-sm">{student.rank}</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="text-lg">{student.flag}</span>
                        {student.country}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{student.score}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Showing top 20 students by score
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
