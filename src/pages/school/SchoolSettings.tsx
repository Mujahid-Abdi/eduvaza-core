import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { FontSizeControl } from '@/components/settings/FontSizeControl';
import { toast } from 'sonner';
import { Building2, Mail, Phone, MapPin, Globe, Save, Lock, Bell } from 'lucide-react';

export const SchoolSettings = () => {
  const { user } = useAuth();
  const { locale, setLocale } = useI18n();
  const [loading, setLoading] = useState(false);

  // Mock school data - will be fetched from Firebase
  const [schoolData, setSchoolData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    website: '',
    description: '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // TODO: Implement Firebase school profile update
      // await schoolsService.updateSchool(user?.id, schoolData);
      
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
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your school profile and preferences</p>
        </motion.div>

        {/* Accordion Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Accordion type="multiple" className="space-y-4">
            {/* School Profile */}
            <AccordionItem value="profile" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span className="font-semibold">School Profile</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Update your school information</p>
                <div className="space-y-2">
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    value={schoolData.name}
                    onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                    placeholder="Enter school name"
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
                    value={schoolData.email}
                    onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
                    placeholder="school@example.com"
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
                    value={schoolData.phone}
                    onChange={(e) => setSchoolData({ ...schoolData, phone: e.target.value })}
                    placeholder="+1234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={schoolData.website}
                    onChange={(e) => setSchoolData({ ...schoolData, website: e.target.value })}
                    placeholder="https://www.yourschool.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  <Textarea
                    id="address"
                    value={schoolData.address}
                    onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                    placeholder="Enter school address"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={schoolData.description}
                    onChange={(e) => setSchoolData({ ...schoolData, description: e.target.value })}
                    placeholder="Brief description about your school"
                    rows={4}
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

                <Separator />

                <FontSizeControl />
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
                  <p className="font-medium">School Administrator</p>
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
                <div className="space-y-2 pt-2">
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

            {/* Notifications */}
            <AccordionItem value="notifications" className="border rounded-lg px-6">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span className="font-semibold">Notification Preferences</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">Manage how you receive notifications</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Quiz Reminders</p>
                    <p className="text-sm text-muted-foreground">Get notified about upcoming quizzes</p>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end"
        >
          <Button onClick={handleSave} disabled={loading} size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SchoolSettings;
