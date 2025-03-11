import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, User, School, GraduationCap, UserCog, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { toast } from 'sonner';
import { getRoleBasedRoute } from '@/lib/roleRedirect';
import type { UserRole } from '@/types';
import { mockSchools } from '@/services/mockData';

const roleOptions: { role: UserRole; icon: React.ReactNode; labelKey: string; description: string }[] = [
  { role: 'student', icon: <GraduationCap className="h-6 w-6" />, labelKey: 'auth.roleStudent', description: 'Learn and explore courses' },
  { role: 'teacher', icon: <User className="h-6 w-6" />, labelKey: 'auth.roleTeacher', description: 'Create and manage courses' },
  { role: 'school', icon: <School className="h-6 w-6" />, labelKey: 'auth.roleSchool', description: 'Manage your institution' },
];

const educationLevels = [
  { value: 'lower_than_highschool', label: 'Lower than High School' },
  { value: 'highschool', label: 'High School' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'masters', label: 'Masters' },
  { value: 'phd', label: 'PhD' },
  { value: 'other', label: 'Other' },
];

const schoolLevels = [
  { value: 'highschool', label: 'High School' },
  { value: 'private_college', label: 'Private College' },
  { value: 'government_university', label: 'Government University' },
  { value: 'private_university', label: 'Private University' },
  { value: 'technical_institute', label: 'Technical Institute' },
  { value: 'other', label: 'Other' },
];

const focusAreas = [
  { value: 'science', label: 'Science' },
  { value: 'technology', label: 'Technology' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'human_health', label: 'Human Health' },
  { value: 'animal_health', label: 'Animal Health / Veterinary' },
  { value: 'business', label: 'Business & Management' },
  { value: 'arts', label: 'Arts & Humanities' },
  { value: 'social_sciences', label: 'Social Sciences' },
  { value: 'education', label: 'Education' },
  { value: 'law', label: 'Law' },
  { value: 'medicine', label: 'Medicine' },
  { value: 'nursing', label: 'Nursing' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'environmental', label: 'Environmental Studies' },
  { value: 'other', label: 'Other' },
];

const majorCourses = [
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biology', label: 'Biology' },
  { value: 'computer_science', label: 'Computer Science' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'english', label: 'English Language' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'economics', label: 'Economics' },
  { value: 'business', label: 'Business Studies' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'health_sciences', label: 'Health Sciences' },
  { value: 'arts', label: 'Arts & Design' },
  { value: 'languages', label: 'Languages' },
  { value: 'social_studies', label: 'Social Studies' },
  { value: 'physical_education', label: 'Physical Education' },
  { value: 'music', label: 'Music' },
  { value: 'other', label: 'Other' },
];

const africanCountries = [
  { code: 'DZ', name: 'Algeria' },
  { code: 'AO', name: 'Angola' },
  { code: 'BJ', name: 'Benin' },
  { code: 'BW', name: 'Botswana' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' },
  { code: 'CM', name: 'Cameroon' },
  { code: 'CV', name: 'Cape Verde' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' },
  { code: 'KM', name: 'Comoros' },
  { code: 'CG', name: 'Congo' },
  { code: 'CD', name: 'Democratic Republic of the Congo' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
  { code: 'DJ', name: 'Djibouti' },
  { code: 'EG', name: 'Egypt' },
  { code: 'GQ', name: 'Equatorial Guinea' },
  { code: 'ER', name: 'Eritrea' },
  { code: 'ET', name: 'Ethiopia' },
  { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' },
  { code: 'GH', name: 'Ghana' },
  { code: 'GN', name: 'Guinea' },
  { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'KE', name: 'Kenya' },
  { code: 'LS', name: 'Lesotho' },
  { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' },
  { code: 'MG', name: 'Madagascar' },
  { code: 'MW', name: 'Malawi' },
  { code: 'ML', name: 'Mali' },
  { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' },
  { code: 'MA', name: 'Morocco' },
  { code: 'MZ', name: 'Mozambique' },
  { code: 'NA', name: 'Namibia' },
  { code: 'NE', name: 'Niger' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'RW', name: 'Rwanda' },
  { code: 'ST', name: 'São Tomé and Príncipe' },
  { code: 'SN', name: 'Senegal' },
  { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' },
  { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SZ', name: 'Eswatini' },
  { code: 'TZ', name: 'Tanzania' },
  { code: 'TG', name: 'Togo' },
  { code: 'TN', name: 'Tunisia' },
  { code: 'UG', name: 'Uganda' },
  { code: 'ZM', name: 'Zambia' },
  { code: 'ZW', name: 'Zimbabwe' },
];

type Step = 'role' | 'language' | 'school_level' | 'focus_areas' | 'education' | 'teacher_details' | 'details' | 'success';

export const RegisterPage = () => {
  const { t, setLocale, locale } = useI18n();
  const { register, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedEducationLevel, setSelectedEducationLevel] = useState<string>('');
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState<string>('');
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [selectedMajorCourse, setSelectedMajorCourse] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [registeredUser, setRegisteredUser] = useState<{ name: string; email: string } | null>(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    schoolName: '',
    schoolEmail: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Auto-redirect when user is registered and logged in
  useEffect(() => {
    if (user?.role && step === 'success') {
      const timer = setTimeout(() => {
        navigate(getRoleBasedRoute(user.role), { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, step, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    // After role selection, go to language selection
    setStep('language');
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    // Change system language immediately
    setLocale(language as any);
    
    // Route based on role
    if (selectedRole === 'student') {
      setStep('education');
    } else if (selectedRole === 'teacher') {
      setStep('teacher_details');
    } else if (selectedRole === 'school') {
      setStep('school_level');
    }
  };

  const handleSchoolLevelSelect = (level: string) => {
    setSelectedSchoolLevel(level);
    // If college or university, ask for focus areas
    if (level === 'private_college' || level === 'government_university' || level === 'private_university') {
      setStep('focus_areas');
    } else {
      setStep('details');
    }
  };

  const handleFocusAreaToggle = (area: string) => {
    setSelectedFocusAreas(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleFocusAreasNext = () => {
    if (selectedFocusAreas.length === 0) {
      toast.error('Please select at least one focus area');
      return;
    }
    setStep('details');
  };

  const handleEducationLevelSelect = (level: string) => {
    setSelectedEducationLevel(level);
    setStep('details');
  };

  const handleTeacherDetailsNext = () => {
    if (!selectedEducationLevel) {
      toast.error('Please select your education level');
      return;
    }
    if (!selectedMajorCourse) {
      toast.error('Please select your major course');
      return;
    }
    setStep('details');
  };

  const handleSchoolSelect = (schoolId: string) => {
    setSelectedSchool(schoolId);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    // Validate country selection
    if (!selectedCountry) {
      setError('Please select your country');
      toast.error('Please select your country');
      return;
    }

    // Validate school-specific fields
    if (selectedRole === 'school') {
      if (!formData.schoolName || !formData.schoolEmail) {
        setError('Please fill in all school information');
        toast.error('Please fill in all school information');
        return;
      }
    }

    setError('');
    
    try {
      await register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone,
        role: selectedRole,
        schoolId: selectedSchool || undefined,
      });
      
      // Set user data for success message
      setRegisteredUser({
        name: formData.name,
        email: formData.email
      });
      
      // Show success step
      setStep('success');
      
      // Show success toast
      toast.success('Registration successful! You are now logged in!', {
        duration: 4000,
      });
      
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  const approvedSchools = mockSchools.filter(s => s.status === 'approved');

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
              <span className="text-2xl font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-2xl font-bold">
              Edu<span className="text-gradient-primary">Vaza</span>
            </span>
          </Link>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('auth.createAccount')}</h1>
            <p className="mt-2 text-muted-foreground">
              {t('common.tagline')}
            </p>
          </div>

          {/* Step: Role Selection */}
          {step === 'role' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h2 className="text-lg font-semibold text-foreground">{t('auth.selectRole')}</h2>
              <div className="space-y-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.role}
                    onClick={() => handleRoleSelect(option.role)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted/50 transition-all text-left group"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {option.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{t(option.labelKey)}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step: Language Selection */}
          {step === 'language' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('role')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Select Your Language</h2>
              <p className="text-sm text-muted-foreground">Choose your preferred language. The system will automatically switch to your selected language.</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleLanguageSelect('en')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted/50 transition-all text-left"
                >
                  <div className="text-3xl">🇬🇧</div>
                  <div>
                    <p className="font-semibold text-foreground">English</p>
                    <p className="text-sm text-muted-foreground">International</p>
                  </div>
                </button>
                <button
                  onClick={() => handleLanguageSelect('fr')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted/50 transition-all text-left"
                >
                  <div className="text-3xl">🇫🇷</div>
                  <div>
                    <p className="font-semibold text-foreground">Français</p>
                    <p className="text-sm text-muted-foreground">French</p>
                  </div>
                </button>
                <button
                  onClick={() => handleLanguageSelect('ar')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted/50 transition-all text-left"
                >
                  <div className="text-3xl">🇸🇦</div>
                  <div>
                    <p className="font-semibold text-foreground">العربية</p>
                    <p className="text-sm text-muted-foreground">Arabic</p>
                  </div>
                </button>
                <button
                  onClick={() => handleLanguageSelect('sw')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted/50 transition-all text-left"
                >
                  <div className="text-3xl">🇰🇪</div>
                  <div>
                    <p className="font-semibold text-foreground">Kiswahili</p>
                    <p className="text-sm text-muted-foreground">Swahili</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step: Education Level (for students only) */}
          {step === 'education' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('language')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Select Your Education Level</h2>
              <p className="text-sm text-muted-foreground">Choose your current level of study</p>
              <div className="space-y-3">
                {educationLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleEducationLevelSelect(level.value)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted/50 transition-all text-left group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{level.label}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step: Teacher Details (education level and major course) */}
          {step === 'teacher_details' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('language')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Teacher Information</h2>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-semibold">Your Education Level *</Label>
                  <p className="text-xs text-muted-foreground mb-3">Select your highest level of education</p>
                  <div className="space-y-2">
                    {educationLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setSelectedEducationLevel(level.value)}
                        className={`w-full flex items-center gap-4 p-3 rounded-lg border-2 transition-all text-left ${
                          selectedEducationLevel === level.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50 hover:bg-muted/50'
                        }`}
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          selectedEducationLevel === level.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <GraduationCap className="h-4 w-4" />
                        </div>
                        <p className="font-medium text-foreground">{level.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Your Major Course *</Label>
                  <p className="text-xs text-muted-foreground mb-3">Select your area of expertise</p>
                  <select
                    value={selectedMajorCourse}
                    onChange={(e) => setSelectedMajorCourse(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select your major course</option>
                    {majorCourses.map((course) => (
                      <option key={course.value} value={course.value}>
                        {course.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button 
                  onClick={handleTeacherDetailsNext}
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: School Level Selection */}
          {step === 'school_level' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('language')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Select School/Organization Level</h2>
              <p className="text-sm text-muted-foreground">Choose the type of educational institution</p>
              <div className="space-y-3">
                {schoolLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => handleSchoolLevelSelect(level.value)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted/50 transition-all text-left group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <School className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{level.label}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step: Focus Areas (for colleges and universities) */}
          {step === 'focus_areas' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('school_level')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
              </div>
              <h2 className="text-lg font-semibold text-foreground">Select Focus Areas</h2>
              <p className="text-sm text-muted-foreground">Choose one or more areas your institution focuses on</p>
              
              <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                {focusAreas.map((area) => (
                  <button
                    key={area.value}
                    onClick={() => handleFocusAreaToggle(area.value)}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                      selectedFocusAreas.includes(area.value)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                      selectedFocusAreas.includes(area.value)
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {selectedFocusAreas.includes(area.value) && (
                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{area.label}</p>
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  Selected: {selectedFocusAreas.length} area{selectedFocusAreas.length !== 1 ? 's' : ''}
                </p>
                <Button 
                  onClick={handleFocusAreasNext}
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={selectedFocusAreas.length === 0}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step: Details Form */}
          {step === 'details' && (
            <motion.form
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedRole === 'school') {
                      setStep('language');
                    } else if (selectedRole === 'student') {
                      setStep('education');
                    } else {
                      setStep('teacher_details');
                    }
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
              </div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-destructive/10 border border-destructive/20 rounded-md"
                >
                  <p className="text-sm text-destructive">{error}</p>
                </motion.div>
              )}

              {/* School-specific fields */}
              {selectedRole === 'school' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School/Organization Name *</Label>
                    <div className="relative">
                      <School className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="schoolName"
                        type="text"
                        placeholder="ABC High School"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolEmail">School/Organization Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="schoolEmail"
                        type="email"
                        placeholder="info@abcschool.edu"
                        value={formData.schoolEmail}
                        onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">{selectedRole === 'school' ? 'Contact Person Name *' : t('auth.fullName')}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{selectedRole === 'school' ? 'Contact Person Email *' : t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+254 700 000 000"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <select
                  id="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                >
                  <option value="">Select your country</option>
                  {africanCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? t('common.loading') : t('auth.registerNow')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.form>
          )}

          {/* Step: Success */}
          {step === 'success' && registeredUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Welcome to EduVaza!</h2>
                <p className="text-muted-foreground">
                  Hi {registeredUser.name}, your account has been created and you are now logged in!
                </p>
                <p className="text-sm text-muted-foreground">
                  You will be redirected to your dashboard shortly.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{registeredUser.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <User className="h-4 w-4" />
                  <span>{selectedRole && t(`auth.role${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => user?.role && navigate(getRoleBasedRoute(user.role), { replace: true })} 
                  variant="hero" 
                  size="lg" 
                  className="flex-1"
                >
                  {t('auth.goToDashboard')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Redirecting automatically in 3 seconds...
              </p>
            </motion.div>
          )}

          {/* Login Link - Only show when not on success step */}
          {step !== 'success' && (
            <p className="text-center text-muted-foreground">
              {t('auth.hasAccount')}{' '}
              <Link to="/auth/login" className="text-primary font-semibold hover:underline">
                {t('nav.login')}
              </Link>
            </p>
          )}
        </motion.div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-secondary items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-md text-secondary-foreground"
        >
          <div className="mb-8 p-8 rounded-3xl bg-background/10 backdrop-blur-sm">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold mb-2">
              Join Our Community
            </h2>
            <p className="text-secondary-foreground/80">
              Connect with educators and learners from across Africa. Build skills, share knowledge, and grow together.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-background/10">
              <p className="text-2xl font-bold">🇰🇪</p>
              <p className="text-xs mt-1">Kenya</p>
            </div>
            <div className="p-4 rounded-xl bg-background/10">
              <p className="text-2xl font-bold">🇳🇬</p>
              <p className="text-xs mt-1">Nigeria</p>
            </div>
            <div className="p-4 rounded-xl bg-background/10">
              <p className="text-2xl font-bold">🇿🇦</p>
              <p className="text-xs mt-1">South Africa</p>
            </div>
            <div className="p-4 rounded-xl bg-background/10">
              <p className="text-2xl font-bold">🇬🇭</p>
              <p className="text-xs mt-1">Ghana</p>
            </div>
            <div className="p-4 rounded-xl bg-background/10">
              <p className="text-2xl font-bold">🇹🇿</p>
              <p className="text-xs mt-1">Tanzania</p>
            </div>
            <div className="p-4 rounded-xl bg-background/10">
              <p className="text-2xl font-bold">+30</p>
              <p className="text-xs mt-1">More</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
