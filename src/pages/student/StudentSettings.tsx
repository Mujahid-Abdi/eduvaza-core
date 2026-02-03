import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Globe, 
  Save, 
  Lock, 
  Bell, 
  Eye, 
  Trophy,
  Target,
  Volume2,
  Palette,
  Shield,
  Download,
  Trash2
} from 'lucide-react';

export const StudentSettings = () => {
  const { user } = useAuth();
  const { locale, setLocale } = useI18n();
  const [loading, setLoading] = useState(false);

  // Student Profile Data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    grade: '',
    school: '',
    avatar: '',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    quizReminders: true,
    newQuizAlerts: true,
    leaderboardUpdates: false,
    achievementAlerts: true,
    weeklyProgress: true,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    showProfileInLeaderboard: true,
    showScoresToOthers: true,
    allowTeacherMessages: true,
    shareProgressWithParents: false,
  });

  // Quiz Preferences
  const [quizPreferences, setQuizPreferences] = useState({
    autoSubmitOnTimeEnd: true,
    showCorrectAnswers: true,
    soundEffects: true,
    vibrationFeedback: true,
    darkModeQuiz: false,
    fontSize: 'medium',
  });

  // Leaderboard Preferences
  const [leaderboardPreferences, setLeaderboardPreferences] = useState({
    defaultTimeFilter: 'all' as 'week' | 'month' | 'all',
    showRankNotifications: true,
    highlightTopRanks: true,
    compareWithClassmates: true,
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Save profile data to Firebase
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Notification settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Privacy settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuizPreferences = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Quiz preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLeaderboardPreferences = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success('Leaderboard preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    toast.info('Preparing your data for download...');
    // Implement data export
  };

  const handleDeleteAccount = () => {
    toast.error('Please contact your teacher or school administrator to delete your account');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </motion.div>

        {/* Settings Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="single" collapsible defaultValue="profile" className="space-y-4">
            {/* Profile Settings */}
            <AccordionItem value="profile" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Profile Information</p>
                    <p className="text-sm text-muted-foreground">Update your personal details</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="grade">Grade/Class</Label>
                    <Input
                      id="grade"
                      value={profileData.grade}
                      onChange={(e) => setProfileData({ ...profileData, grade: e.target.value })}
                      placeholder="e.g., Grade 10"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select value={locale} onValueChange={setLocale}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="sw">Kiswahili</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Leaderboard Preferences */}
            <AccordionItem value="leaderboard" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Leaderboard Preferences</p>
                    <p className="text-sm text-muted-foreground">Customize your leaderboard experience</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="defaultFilter">Default Time Filter</Label>
                    <Select 
                      value={leaderboardPreferences.defaultTimeFilter} 
                      onValueChange={(value: any) => 
                        setLeaderboardPreferences({ ...leaderboardPreferences, defaultTimeFilter: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="all">All Time</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Choose which time period to show by default when viewing leaderboards
                    </p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Rank Change Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your rank changes
                      </p>
                    </div>
                    <Switch
                      checked={leaderboardPreferences.showRankNotifications}
                      onCheckedChange={(checked) =>
                        setLeaderboardPreferences({ ...leaderboardPreferences, showRankNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Highlight Top Ranks</Label>
                      <p className="text-sm text-muted-foreground">
                        Show special badges for top 3 positions
                      </p>
                    </div>
                    <Switch
                      checked={leaderboardPreferences.highlightTopRanks}
                      onCheckedChange={(checked) =>
                        setLeaderboardPreferences({ ...leaderboardPreferences, highlightTopRanks: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compare with Classmates</Label>
                      <p className="text-sm text-muted-foreground">
                        Show how you rank among your classmates
                      </p>
                    </div>
                    <Switch
                      checked={leaderboardPreferences.compareWithClassmates}
                      onCheckedChange={(checked) =>
                        setLeaderboardPreferences({ ...leaderboardPreferences, compareWithClassmates: checked })
                      }
                    />
                  </div>

                  <Button onClick={handleSaveLeaderboardPreferences} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Quiz Preferences */}
            <AccordionItem value="quiz" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Quiz Preferences</p>
                    <p className="text-sm text-muted-foreground">Customize your quiz-taking experience</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select 
                      value={quizPreferences.fontSize} 
                      onValueChange={(value) => 
                        setQuizPreferences({ ...quizPreferences, fontSize: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-submit on Time End</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically submit quiz when time runs out
                      </p>
                    </div>
                    <Switch
                      checked={quizPreferences.autoSubmitOnTimeEnd}
                      onCheckedChange={(checked) =>
                        setQuizPreferences({ ...quizPreferences, autoSubmitOnTimeEnd: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Correct Answers</Label>
                      <p className="text-sm text-muted-foreground">
                        Display correct answers after quiz completion
                      </p>
                    </div>
                    <Switch
                      checked={quizPreferences.showCorrectAnswers}
                      onCheckedChange={(checked) =>
                        setQuizPreferences({ ...quizPreferences, showCorrectAnswers: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      <div>
                        <Label>Sound Effects</Label>
                        <p className="text-sm text-muted-foreground">
                          Play sounds for correct/incorrect answers
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={quizPreferences.soundEffects}
                      onCheckedChange={(checked) =>
                        setQuizPreferences({ ...quizPreferences, soundEffects: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Vibration Feedback</Label>
                      <p className="text-sm text-muted-foreground">
                        Vibrate on answer submission (mobile)
                      </p>
                    </div>
                    <Switch
                      checked={quizPreferences.vibrationFeedback}
                      onCheckedChange={(checked) =>
                        setQuizPreferences({ ...quizPreferences, vibrationFeedback: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <div>
                        <Label>Dark Mode for Quizzes</Label>
                        <p className="text-sm text-muted-foreground">
                          Use dark theme during quiz sessions
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={quizPreferences.darkModeQuiz}
                      onCheckedChange={(checked) =>
                        setQuizPreferences({ ...quizPreferences, darkModeQuiz: checked })
                      }
                    />
                  </div>

                  <Button onClick={handleSaveQuizPreferences} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Notifications */}
            <AccordionItem value="notifications" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Notifications</p>
                    <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Quiz Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about upcoming quizzes
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.quizReminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, quizReminders: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>New Quiz Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify when new quizzes are available
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.newQuizAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, newQuizAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Leaderboard Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about leaderboard changes
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.leaderboardUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, leaderboardUpdates: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Achievement Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Celebrate when you earn badges and achievements
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.achievementAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, achievementAlerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Weekly Progress Report</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive a summary of your weekly performance
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.weeklyProgress}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, weeklyProgress: checked })
                      }
                    />
                  </div>

                  <Button onClick={handleSaveNotifications} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notifications
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Privacy Settings */}
            <AccordionItem value="privacy" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Privacy & Visibility</p>
                    <p className="text-sm text-muted-foreground">Control who can see your information</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Profile in Leaderboard</Label>
                      <p className="text-sm text-muted-foreground">
                        Display your name and avatar in leaderboards
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.showProfileInLeaderboard}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({ ...privacySettings, showProfileInLeaderboard: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Show Scores to Others</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow other students to see your quiz scores
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.showScoresToOthers}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({ ...privacySettings, showScoresToOthers: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Teacher Messages</Label>
                      <p className="text-sm text-muted-foreground">
                        Let teachers send you direct messages
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.allowTeacherMessages}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({ ...privacySettings, allowTeacherMessages: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Share Progress with Parents</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow parents to view your quiz results
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.shareProgressWithParents}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({ ...privacySettings, shareProgressWithParents: checked })
                      }
                    />
                  </div>

                  <Button onClick={handleSavePrivacy} disabled={loading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Security */}
            <AccordionItem value="security" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Security</p>
                    <p className="text-sm text-muted-foreground">Manage your account security</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Change Password</CardTitle>
                      <CardDescription>Update your account password</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Active Sessions</CardTitle>
                      <CardDescription>Manage devices where you're logged in</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Active Sessions
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Data & Account */}
            <AccordionItem value="data" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold">Data & Account</p>
                    <p className="text-sm text-muted-foreground">Export or delete your data</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Export Your Data</CardTitle>
                      <CardDescription>
                        Download a copy of your quiz results, progress, and achievements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" onClick={handleExportData} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-base text-destructive">Delete Account</CardTitle>
                      <CardDescription>
                        Permanently delete your account and all associated data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount} 
                        className="w-full"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentSettings;
