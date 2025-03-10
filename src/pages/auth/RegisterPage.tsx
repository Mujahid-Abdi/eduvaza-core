import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight, User, School, GraduationCap, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import type { UserRole } from '@/types';
import { mockSchools } from '@/services/mockData';

const roleOptions: { role: UserRole; icon: React.ReactNode; labelKey: string; description: string }[] = [
  { role: 'student', icon: <GraduationCap className="h-6 w-6" />, labelKey: 'auth.roleStudent', description: 'Learn and explore courses' },
  { role: 'teacher', icon: <User className="h-6 w-6" />, labelKey: 'auth.roleTeacher', description: 'Create and manage courses' },
  { role: 'school', icon: <School className="h-6 w-6" />, labelKey: 'auth.roleSchool', description: 'Manage your institution' },
];

type Step = 'role' | 'school' | 'details';

export const RegisterPage = () => {
  const { t } = useI18n();
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'student' || role === 'teacher') {
      setStep('school');
    } else {
      setStep('details');
    }
  };

  const handleSchoolSelect = (schoolId: string) => {
    setSelectedSchool(schoolId);
    setStep('details');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    
    await register({
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      role: selectedRole,
      schoolId: selectedSchool || undefined,
    });
    navigate('/');
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

          {/* Step: School Selection */}
          {step === 'school' && (
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
              <h2 className="text-lg font-semibold text-foreground">{t('auth.selectSchool')}</h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {approvedSchools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => handleSchoolSelect(school.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-muted/50 transition-all text-left"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground text-lg font-bold">
                      {school.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{school.name}</p>
                      <p className="text-sm text-muted-foreground">{school.address}</p>
                    </div>
                  </button>
                ))}
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
                  onClick={() => setStep(selectedRole === 'school' ? 'role' : 'school')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Back
                </button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{t('auth.fullName')}</Label>
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
                <Label htmlFor="email">{t('auth.email')}</Label>
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10"
                  />
                </div>
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

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? t('common.loading') : t('auth.registerNow')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.form>
          )}

          {/* Login Link */}
          <p className="text-center text-muted-foreground">
            {t('auth.hasAccount')}{' '}
            <Link to="/auth/login" className="text-primary font-semibold hover:underline">
              {t('nav.login')}
            </Link>
          </p>
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
