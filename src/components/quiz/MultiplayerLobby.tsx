import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Copy, CheckCircle2, Play, Loader2, Crown, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { MultiplayerSession, SessionParticipant } from '@/types/quiz';

interface MultiplayerLobbyProps {
  session?: MultiplayerSession;
  isHost: boolean;
  onJoin?: (code: string, name: string) => void;
  onStart?: () => void;
  onLeave: () => void;
}

export const MultiplayerLobby = ({ 
  session, 
  isHost, 
  onJoin, 
  onStart, 
  onLeave 
}: MultiplayerLobbyProps) => {
  const { toast } = useToast();
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [copied, setCopied] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const copyCode = () => {
    if (session?.joinCode) {
      navigator.clipboard.writeText(session.joinCode);
      setCopied(true);
      toast({ title: 'Code copied!', description: 'Share this code with your students.' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = async () => {
    if (!joinCode.trim() || !playerName.trim()) return;
    setIsJoining(true);
    await onJoin?.(joinCode.toUpperCase(), playerName);
    setIsJoining(false);
  };

  // Join mode (student entering code)
  if (!session) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Join Live Quiz</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter the game code shared by your teacher
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
            </div>
            <div className="space-y-2">
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Your name"
                className="text-center"
              />
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleJoin}
              disabled={!joinCode.trim() || !playerName.trim() || isJoining}
            >
              {isJoining ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Join Game
                </>
              )}
            </Button>
            <Button variant="ghost" className="w-full" onClick={onLeave}>
              Cancel
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Waiting room (host or joined player)
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Info */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{session.quiz.title}</h2>
                <p className="text-muted-foreground">
                  {session.quiz.questions.length} questions • {session.quiz.totalPoints} points
                </p>
              </div>
              {isHost && (
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Crown className="h-4 w-4 mr-2" />
                  Host
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Join Code */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <p className="text-sm opacity-80 mb-2">Game Code</p>
            <div className="flex items-center justify-center gap-4">
              <span className="text-5xl font-mono font-bold tracking-[0.3em]">
                {session.joinCode}
              </span>
              <Button
                variant="secondary"
                size="icon"
                onClick={copyCode}
                className="shrink-0"
              >
                {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-sm opacity-80 mt-4">
              Share this code with students to join
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Participants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Players ({session.participants.length})
            </CardTitle>
            <Badge variant="outline" className="animate-pulse">
              <span className="w-2 h-2 rounded-full bg-success mr-2" />
              Waiting...
            </Badge>
          </CardHeader>
          <CardContent>
            {session.participants.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Waiting for players to join...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <AnimatePresence>
                  {session.participants.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {participant.studentName.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium truncate max-w-full">
                        {participant.studentName}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onLeave} className="flex-1">
          Leave Game
        </Button>
        {isHost && (
          <Button 
            onClick={onStart} 
            className="flex-1"
            disabled={session.participants.length === 0}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Quiz ({session.participants.length} players)
          </Button>
        )}
      </div>
    </div>
  );
};
