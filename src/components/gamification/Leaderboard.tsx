import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, School } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { LeaderboardEntry } from '@/types/quiz';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  type?: 'global' | 'school' | 'course';
  showSchoolFilter?: boolean;
}

export const Leaderboard = ({ 
  entries, 
  currentUserId,
  type = 'global',
  showSchoolFilter = true 
}: LeaderboardProps) => {
  const [filter, setFilter] = useState<'all' | 'school'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all');

  const filteredEntries = entries.slice(0, 10);
  const currentUserEntry = entries.find(e => e.userId === currentUserId);
  const currentUserRank = currentUserEntry?.rank || 0;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" />
            Leaderboard
          </CardTitle>
          {showSchoolFilter && (
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                Global
              </Button>
              <Button
                variant={filter === 'school' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('school')}
              >
                <School className="h-4 w-4 mr-1" />
                My School
              </Button>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="week" onClick={() => setTimeRange('week')}>This Week</TabsTrigger>
            <TabsTrigger value="month" onClick={() => setTimeRange('month')}>This Month</TabsTrigger>
            <TabsTrigger value="all" onClick={() => setTimeRange('all')}>All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-8">
          {filteredEntries.slice(0, 3).map((entry, index) => {
            const positions = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
            const actualIndex = positions[index];
            const rankEntry = filteredEntries[actualIndex];
            if (!rankEntry) return null;

            const heights = ['h-24', 'h-32', 'h-20'];
            const height = heights[actualIndex];

            return (
              <motion.div
                key={rankEntry.userId}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: actualIndex * 0.1 }}
                className="flex flex-col items-center"
              >
                <Avatar className="h-14 w-14 mb-2 ring-2 ring-offset-2 ring-primary">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {rankEntry.userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate max-w-20">{rankEntry.userName}</span>
                <span className="text-xs text-muted-foreground">{rankEntry.points.toLocaleString()} pts</span>
                <div className={`${height} w-20 mt-2 rounded-t-lg flex items-start justify-center pt-2 ${
                  actualIndex === 0 ? 'bg-yellow-500' : 
                  actualIndex === 1 ? 'bg-gray-400' : 'bg-amber-600'
                }`}>
                  {getRankIcon(actualIndex + 1)}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Rest of the leaderboard */}
        <div className="space-y-2">
          {filteredEntries.slice(3).map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;
            
            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 3) * 0.05 }}
                className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
                  isCurrentUser 
                    ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="w-8 text-center font-bold text-muted-foreground">
                  {entry.rank}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                    {entry.userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                      {entry.userName}
                    </span>
                    {isCurrentUser && <Badge variant="secondary">You</Badge>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Level {entry.level}</span>
                    <span>•</span>
                    <span>{entry.badges} badges</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-foreground">{entry.points.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground ml-1">pts</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Current user position if not in top 10 */}
        {currentUserEntry && currentUserRank > 10 && (
          <>
            <div className="text-center text-muted-foreground py-2">• • •</div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-3 rounded-lg bg-primary/10 border border-primary/30"
            >
              <div className="w-8 text-center font-bold text-primary">
                {currentUserRank}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {currentUserEntry.userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-primary">{currentUserEntry.userName}</span>
                  <Badge variant="secondary">You</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span>Keep going! You're doing great.</span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-foreground">{currentUserEntry.points.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground ml-1">pts</span>
              </div>
            </motion.div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
