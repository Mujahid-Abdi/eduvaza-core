import { motion } from 'framer-motion';
import { Lock, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { Badge } from '@/types/quiz';

interface BadgeReference extends Omit<Badge, 'earnedAt'> {}

interface BadgeDisplayProps {
  earnedBadges: Badge[];
  allBadges?: BadgeReference[];
  title?: string;
}

// All available badges for reference
const allAvailableBadges: Omit<Badge, 'earnedAt'>[] = [
  // Quiz badges
  { id: 'badge-1', name: 'First Quiz', description: 'Complete your first quiz', icon: '🎯', color: '#FF6B35', category: 'quiz' },
  { id: 'badge-2', name: 'Perfect Score', description: 'Score 100% on any quiz', icon: '⭐', color: '#FFD700', category: 'quiz' },
  { id: 'badge-quiz-10', name: 'Quiz Taker', description: 'Complete 10 quizzes', icon: '📝', color: '#6B35FF', category: 'quiz' },
  { id: 'badge-quiz-50', name: 'Quiz Master', description: 'Complete 50 quizzes', icon: '🏆', color: '#35B5FF', category: 'quiz' },
  { id: 'badge-speed', name: 'Speed Demon', description: 'Answer 10 questions in under 5 seconds each', icon: '⚡', color: '#FF35B5', category: 'quiz' },
  
  // Streak badges
  { id: 'badge-3', name: 'Week Streak', description: 'Learn for 7 days in a row', icon: '🔥', color: '#FF4500', category: 'streak' },
  { id: 'badge-streak-14', name: 'Two Week Warrior', description: 'Maintain a 14-day streak', icon: '💪', color: '#FF6B35', category: 'streak' },
  { id: 'badge-streak-30', name: 'Month Champion', description: 'Maintain a 30-day streak', icon: '🌟', color: '#FFD700', category: 'streak' },
  
  // Learning badges
  { id: 'badge-4', name: 'Quick Learner', description: 'Complete 5 courses', icon: '📚', color: '#6B35FF', category: 'learning' },
  { id: 'badge-lesson-10', name: 'Lesson Lover', description: 'Complete 10 lessons', icon: '📖', color: '#35B5FF', category: 'learning' },
  { id: 'badge-lesson-50', name: 'Knowledge Seeker', description: 'Complete 50 lessons', icon: '🎓', color: '#35FF6B', category: 'learning' },
  
  // Social badges
  { id: 'badge-5', name: 'Team Player', description: 'Participate in 10 group activities', icon: '🤝', color: '#35B5FF', category: 'social' },
  { id: 'badge-podium', name: 'Podium Finisher', description: 'Finish in top 3 of a quiz', icon: '🥇', color: '#FFD700', category: 'social' },
  { id: 'badge-winner', name: 'Quiz Champion', description: 'Win a quiz competition', icon: '👑', color: '#FF6B35', category: 'social' },
  
  // Special badges
  { id: 'badge-6', name: 'Early Bird', description: 'Join a quiz before it starts', icon: '🐦', color: '#35FF6B', category: 'special' },
  { id: 'badge-night', name: 'Night Owl', description: 'Complete a quiz after 10 PM', icon: '🦉', color: '#6B35FF', category: 'special' },
  { id: 'badge-first', name: 'Pioneer', description: 'Be among the first 100 users', icon: '🚀', color: '#FF35B5', category: 'special' },
];

export const BadgeDisplay = ({ 
  earnedBadges, 
  allBadges = allAvailableBadges,
  title = "Badges" 
}: BadgeDisplayProps) => {
  const earnedBadgeIds = new Set(earnedBadges.map(b => b.id));
  
  const categories = ['all', 'quiz', 'streak', 'learning', 'social', 'special'] as const;
  
  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'quiz': return '📝';
      case 'streak': return '🔥';
      case 'learning': return '📚';
      case 'social': return '🤝';
      case 'special': return '✨';
      default: return '🏅';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
          <UIBadge variant="secondary">
            {earnedBadges.length}/{allBadges.length}
          </UIBadge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid grid-cols-6 mb-4">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="text-xs capitalize">
                {cat === 'all' ? '🏅 All' : `${getCategoryEmoji(cat)}`}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allBadges
                  .filter(b => category === 'all' || b.category === category)
                  .map((badge, index) => {
                    const isEarned = earnedBadgeIds.has(badge.id);
                    const earnedBadge = earnedBadges.find(b => b.id === badge.id);
                    
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative p-4 rounded-xl text-center transition-all ${
                          isEarned 
                            ? 'bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/30' 
                            : 'bg-muted/50 border-2 border-transparent opacity-60 grayscale'
                        }`}
                      >
                        {isEarned && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success flex items-center justify-center"
                          >
                            <Check className="h-3 w-3 text-success-foreground" />
                          </motion.div>
                        )}
                        {!isEarned && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-muted-foreground flex items-center justify-center">
                            <Lock className="h-3 w-3 text-muted" />
                          </div>
                        )}
                        <motion.span
                          className="text-3xl block mb-2"
                          animate={isEarned ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.3 }}
                        >
                          {badge.icon}
                        </motion.span>
                        <p className="font-medium text-sm">{badge.name}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {badge.description}
                        </p>
                        {earnedBadge && (
                          <p className="text-xs text-primary mt-2">
                            Earned {new Date(earnedBadge.earnedAt).toLocaleDateString()}
                          </p>
                        )}
                      </motion.div>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
