import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Bell, 
  Clock, 
  Shield, 
  Save,
  Globe,
  GraduationCap,
  Settings as SettingsIcon,
  Eye,
  Lock
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const TeacherSettings = () => {
  const { user } = useAuth();
  const { locale, setLocale } = useI18n();
  const [loading, setLoading] = useState(false);

  // Teacher Profile Data
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    specialization: '',
    yearsOfExperience: '',
    education: '',
  });

  // Course Settings
  const [courseSettings, setCourseSettings] = useState({
    allowStudentQuestions: true,
    autoPublishCourses: false,
    requireCourseApproval: true,
    defaultCourseLanguage: 'en',
    defaultCourseLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
  });

  // Quiz Settings
  const [quizSettings, setQuizSettings] = useState({
    defaultQuizDuration: 30,
    allowQuizRetakes: true,
    showCorrectAnswers: true,
    randomizeQuestions: true,
    randomizeOptions: true,
    passingScore: 60,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newStudentEnrollment: true,
    quizSubmissions: true,
    courseComments: true,
    systemUpdates: false,
    weeklyReport: true,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    showProfileToStudents: true,
    showEmailToStudents: false,
    allowStudentMessages: true,
    showOnlineStatus: true,
  });

  // Grading Settings
  const [gradingSettings, setGradingSettings] = useState({
    autoGradeQuizzes: true,
    sendGradeNotifications: true,
    allowGradeAppeals: true,
    gradeReleaseDelay: 0, // hours
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // TODO: Implement Firebase teacher profile update
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // TODO: Implement Firebase settings update
      toast.success('Settings saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Teacher Settings</h1>
          <p className="text-muted-foreground">Manage your profile and teaching preferences</p>
        </motion.div>

        {/* Accordion Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="multiple" className="space-y-4">
            {/* Profile Information */}
            <AccordionItem value="profile" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Profile Information</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Update your personal information</p>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    placeholder="teacher@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Specialization
                  </Label>
                  <Input
                    id="specialization"
                    value={profileData.specialization}
                    onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                    placeholder="e.g., Mathematics, Physics"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={profileData.yearsOfExperience}
                    onChange={(e) => setProfileData({ ...profileData, yearsOfExperience: e.target.value })}
                    placeholder="e.g., 5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    value={profileData.education}
                    onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                    placeholder="e.g., Master's in Education"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell students about yourself..."
                    rows={4}
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={loading} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Course Settings */}
            <AccordionItem value="courses" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span className="font-semibold">Course Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Configure default course preferences</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Student Questions</Label>
                    <p className="text-sm text-muted-foreground">Students can ask questions in courses</p>
                  </div>
                  <Switch
                    checked={courseSettings.allowStudentQuestions}
                    onCheckedChange={(checked) => 
                      setCourseSettings({ ...courseSettings, allowStudentQuestions: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Publish Courses</Label>
                    <p className="text-sm text-muted-foreground">Automatically publish new courses</p>
                  </div>
                  <Switch
                    checked={courseSettings.autoPublishCourses}
                    onCheckedChange={(checked) => 
                      setCourseSettings({ ...courseSettings, autoPublishCourses: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Course Approval</Label>
                    <p className="text-sm text-muted-foreground">School must approve courses before publishing</p>
                  </div>
                  <Switch
                    checked={courseSettings.requireCourseApproval}
                    onCheckedChange={(checked) => 
                      setCourseSettings({ ...courseSettings, requireCourseApproval: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Default Course Language</Label>
                  <Select
                    value={courseSettings.defaultCourseLanguage}
                    onValueChange={(value) => 
                      setCourseSettings({ ...courseSettings, defaultCourseLanguage: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                      <SelectItem value="sw">Swahili</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Course Level</Label>
                  <Select
                    value={courseSettings.defaultCourseLevel}
                    onValueChange={(value: any) => 
                      setCourseSettings({ ...courseSettings, defaultCourseLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Quiz Settings */}
            <AccordionItem value="quizzes" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span className="font-semibold">Quiz Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Configure default quiz behavior</p>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Default Quiz Duration (minutes)
                  </Label>
                  <Input
                    type="number"
                    value={quizSettings.defaultQuizDuration}
                    onChange={(e) => 
                      setQuizSettings({ ...quizSettings, defaultQuizDuration: parseInt(e.target.value) || 30 })
                    }
                    min={5}
                    max={180}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Quiz Retakes</Label>
                    <p className="text-sm text-muted-foreground">Students can retake quizzes</p>
                  </div>
                  <Switch
                    checked={quizSettings.allowQuizRetakes}
                    onCheckedChange={(checked) => 
                      setQuizSettings({ ...quizSettings, allowQuizRetakes: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Correct Answers</Label>
                    <p className="text-sm text-muted-foreground">Display correct answers after submission</p>
                  </div>
                  <Switch
                    checked={quizSettings.showCorrectAnswers}
                    onCheckedChange={(checked) => 
                      setQuizSettings({ ...quizSettings, showCorrectAnswers: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Randomize Questions</Label>
                    <p className="text-sm text-muted-foreground">Shuffle question order</p>
                  </div>
                  <Switch
                    checked={quizSettings.randomizeQuestions}
                    onCheckedChange={(checked) => 
                      setQuizSettings({ ...quizSettings, randomizeQuestions: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Randomize Options</Label>
                    <p className="text-sm text-muted-foreground">Shuffle answer options</p>
                  </div>
                  <Switch
                    checked={quizSettings.randomizeOptions}
                    onCheckedChange={(checked) => 
                      setQuizSettings({ ...quizSettings, randomizeOptions: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Default Passing Score (%)</Label>
                  <Input
                    type="number"
                    value={quizSettings.passingScore}
                    onChange={(e) => 
                      setQuizSettings({ ...quizSettings, passingScore: parseInt(e.target.value) || 60 })
                    }
                    min={0}
                    max={100}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Grading Settings */}
            <AccordionItem value="grading" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span className="font-semibold">Grading Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Configure grading preferences</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-Grade Quizzes</Label>
                    <p className="text-sm text-muted-foreground">Automatically grade quiz submissions</p>
                  </div>
                  <Switch
                    checked={gradingSettings.autoGradeQuizzes}
                    onCheckedChange={(checked) => 
                      setGradingSettings({ ...gradingSettings, autoGradeQuizzes: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send Grade Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify students when grades are released</p>
                  </div>
                  <Switch
                    checked={gradingSettings.sendGradeNotifications}
                    onCheckedChange={(checked) => 
                      setGradingSettings({ ...gradingSettings, sendGradeNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Grade Appeals</Label>
                    <p className="text-sm text-muted-foreground">Students can request grade reviews</p>
                  </div>
                  <Switch
                    checked={gradingSettings.allowGradeAppeals}
                    onCheckedChange={(checked) => 
                      setGradingSettings({ ...gradingSettings, allowGradeAppeals: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Grade Release Delay (hours)</Label>
                  <Input
                    type="number"
                    value={gradingSettings.gradeReleaseDelay}
                    onChange={(e) => 
                      setGradingSettings({ ...gradingSettings, gradeReleaseDelay: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    max={72}
                  />
                  <p className="text-xs text-muted-foreground">
                    Delay before grades are visible to students (0 = immediate)
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Notification Settings */}
            <AccordionItem value="notifications" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span className="font-semibold">Notification Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Manage notification preferences</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Student Enrollment</Label>
                    <p className="text-sm text-muted-foreground">When students enroll in your courses</p>
                  </div>
                  <Switch
                    checked={notificationSettings.newStudentEnrollment}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, newStudentEnrollment: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Quiz Submissions</Label>
                    <p className="text-sm text-muted-foreground">When students submit quizzes</p>
                  </div>
                  <Switch
                    checked={notificationSettings.quizSubmissions}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, quizSubmissions: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Course Comments</Label>
                    <p className="text-sm text-muted-foreground">When students comment on courses</p>
                  </div>
                  <Switch
                    checked={notificationSettings.courseComments}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, courseComments: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>System Updates</Label>
                    <p className="text-sm text-muted-foreground">Platform updates and announcements</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, systemUpdates: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Report</Label>
                    <p className="text-sm text-muted-foreground">Weekly summary of your teaching activity</p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReport}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, weeklyReport: checked })
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Privacy Settings */}
            <AccordionItem value="privacy" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Privacy Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Control your privacy and visibility</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Show Profile to Students
                    </Label>
                    <p className="text-sm text-muted-foreground">Students can view your profile</p>
                  </div>
                  <Switch
                    checked={privacySettings.showProfileToStudents}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({ ...privacySettings, showProfileToStudents: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Show Email to Students
                    </Label>
                    <p className="text-sm text-muted-foreground">Display email on your profile</p>
                  </div>
                  <Switch
                    checked={privacySettings.showEmailToStudents}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({ ...privacySettings, showEmailToStudents: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Allow Student Messages</Label>
                    <p className="text-sm text-muted-foreground">Students can send you direct messages</p>
                  </div>
                  <Switch
                    checked={privacySettings.allowStudentMessages}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({ ...privacySettings, allowStudentMessages: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Online Status</Label>
                    <p className="text-sm text-muted-foreground">Display when you're online</p>
                  </div>
                  <Switch
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({ ...privacySettings, showOnlineStatus: checked })
                    }
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Language Settings */}
            <AccordionItem value="language" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span className="font-semibold">Language Preferences</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Choose your preferred language</p>
                <div className="space-y-2">
                  <Label htmlFor="language">Interface Language</Label>
                  <Select value={locale} onValueChange={(value: any) => setLocale(value)}>
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
              </AccordionContent>
            </AccordionItem>

            {/* Account Information */}
            <AccordionItem value="account" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  <span className="font-semibold">Account Information</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Your account details</p>
                <div>
                  <Label className="text-sm text-muted-foreground">Account Type</Label>
                  <p className="font-medium">Teacher</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <p className="font-medium">{user?.email || 'No email set'}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <p className="font-medium text-green-600">Active</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Change Email
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-end"
        >
          <Button onClick={handleSaveSettings} disabled={loading} size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save All Settings'}
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherSettings;
