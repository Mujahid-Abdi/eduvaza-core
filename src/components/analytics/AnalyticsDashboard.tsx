import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Clock, 
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import type { QuizAnalytics, StudentAnalytics, QuestionAnalytics } from '@/types/quiz';

interface AnalyticsDashboardProps {
  quizAnalytics?: QuizAnalytics;
  studentAnalytics?: StudentAnalytics;
}

export const AnalyticsDashboard = ({ quizAnalytics, studentAnalytics }: AnalyticsDashboardProps) => {
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--warning))'];

  // Stats for quiz analytics
  const quizStats = quizAnalytics ? [
    { 
      label: 'Total Attempts', 
      value: quizAnalytics.totalAttempts, 
      icon: Users, 
      color: 'text-primary',
      bg: 'bg-primary/10' 
    },
    { 
      label: 'Average Score', 
      value: `${quizAnalytics.averageScore}%`, 
      icon: Target, 
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      trend: quizAnalytics.averageScore >= 70 ? 'up' : 'down' 
    },
    { 
      label: 'Pass Rate', 
      value: `${quizAnalytics.passRate}%`, 
      icon: CheckCircle2, 
      color: 'text-success',
      bg: 'bg-success/10' 
    },
    { 
      label: 'Avg. Time', 
      value: `${Math.floor(quizAnalytics.averageTime / 60)}m`, 
      icon: Clock, 
      color: 'text-warning',
      bg: 'bg-warning/10' 
    },
  ] : [];

  // Student progress data
  const progressData = studentAnalytics?.progressOverTime.map(p => ({
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: p.score,
    quiz: p.quizTitle,
  })) || [];

  // Question difficulty chart data
  const questionData = quizAnalytics?.questionStats.map((q, i) => ({
    question: `Q${i + 1}`,
    correctRate: q.correctRate,
    avgTime: q.averageTime,
  })) || [];

  // Pie chart data for pass/fail
  const passFailData = quizAnalytics ? [
    { name: 'Passed', value: quizAnalytics.passRate },
    { name: 'Failed', value: 100 - quizAnalytics.passRate },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Quiz Analytics */}
      {quizAnalytics && (
        <>
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 md:grid-cols-4"
          >
            {quizStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                          {stat.trend && (
                            stat.trend === 'up' 
                              ? <TrendingUp className="h-4 w-4 text-success" />
                              : <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Question Performance */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Question Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={questionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="question" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar 
                        dataKey="correctRate" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]}
                        name="Correct %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pass/Fail Distribution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Pass/Fail Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={passFailData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {passFailData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'} 
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold">{quizAnalytics.passRate}%</span>
                    <span className="text-sm text-muted-foreground">Pass Rate</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}

      {/* Student Analytics */}
      {studentAnalytics && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 md:grid-cols-4"
          >
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Quizzes Completed</p>
                <p className="text-3xl font-bold mt-1">{studentAnalytics.completedQuizzes}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  of {studentAnalytics.totalQuizzes} total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-3xl font-bold mt-1">{studentAnalytics.averageScore}%</p>
                <Progress value={studentAnalytics.averageScore} className="mt-2 h-1.5" />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Strong Subjects</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {studentAnalytics.strongCategories.map(cat => (
                    <Badge key={cat} variant="default" className="text-xs">{cat}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Needs Improvement</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {studentAnalytics.weakCategories.map(cat => (
                    <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success" />
                  Progress Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
};
