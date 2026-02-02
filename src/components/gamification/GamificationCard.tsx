import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Star, 
  Target, 
  Zap,
  ChevronRight,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { GamificationProfile, Badge, Achievement } from '@/types/quiz';

interface GamificationCardProps {
  profile: GamificationProfile;
  onViewLeaderboard?: () => void;
  onViewAchievements?: () => void;
  compact?: boolean;
}

export const GamificationCard = ({ 
  profile, 
  onViewLeaderboard, 
  onViewAchievements,
  compact = false 
}: GamificationCardProps) => {
  const xpProgress = (profile.xp / profile.xpToNextLevel) * 100;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border"
      >
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary">{profile.level}</span>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-warning flex items-center justify-center"
          >
            <Star className="h-3 w-3 text-warning-foreground" fill="currentColor" />
          </motion.div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground">{profile.levelName}</p>
          <div className="flex items-center gap-2 mt-1">
            <Progress value={xpProgress} className="flex-1 h-2" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {profile.xp}/{profile.xpToNextLevel} XP
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-destructive" />
            <span className="font-bold">{profile.streaks.current}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-warning" />
            <span className="font-bold">{profile.totalPoints.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header with Level */}
      <div className="bg-gradient-to-br from-primary via-primary to-secondary p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Current Level</p>
            <div className="flex items-center gap-3 mt-1">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                className="text-4xl font-bold"
              >
                {profile.level}
              </motion.span>
              <div>
                <p className="font-semibold">{profile.levelName}</p>
                <p className="text-sm opacity-80">Rank #{profile.rank}</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <Trophy className="h-16 w-16 opacity-20" />
          </motion.div>
        </div>
        
        {/* XP Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Progress to Level {profile.level + 1}</span>
            <span>{profile.xp} / {profile.xpToNextLevel} XP</span>
          </div>
          <div className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-primary-foreground rounded-full"
            />
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-lg bg-warning/10"
          >
            <Trophy className="h-6 w-6 mx-auto text-warning mb-1" />
            <p className="text-xl font-bold">{profile.totalPoints.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-lg bg-destructive/10"
          >
            <Flame className="h-6 w-6 mx-auto text-destructive mb-1" />
            <p className="text-xl font-bold">{profile.streaks.current}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 rounded-lg bg-primary/10"
          >
            <Award className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-xl font-bold">{profile.badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </motion.div>
        </div>

        {/* Badges */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Recent Badges</h4>
            <Button variant="ghost" size="sm" onClick={onViewAchievements}>
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.badges.slice(0, 4).map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted"
                title={badge.description}
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.name}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements Progress */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold">Active Achievements</h4>
          </div>
          <div className="space-y-3">
            {profile.achievements.slice(0, 2).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress 
                      value={(achievement.progress / achievement.target) * 100} 
                      className="flex-1 h-1.5" 
                    />
                    <span className="text-xs text-muted-foreground">
                      {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leaderboard Link */}
        <Button variant="outline" className="w-full" onClick={onViewLeaderboard}>
          <Trophy className="h-4 w-4 mr-2" />
          View Leaderboard
          <UIBadge variant="secondary" className="ml-auto">
            #{profile.rank}
          </UIBadge>
        </Button>
      </CardContent>
    </Card>
  );
};
