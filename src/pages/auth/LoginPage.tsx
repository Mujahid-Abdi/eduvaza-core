import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';

export const LoginPage = () => {
  const { t } = useI18n();
  const { login, loginWithPhone, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeSent) {
      // Simulate sending code
      setCodeSent(true);
      return;
    }
    await loginWithPhone(phone, code);
    navigate('/');
  };

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
            <h1 className="text-3xl font-bold text-foreground">{t('auth.welcomeBack')}</h1>
            <p className="mt-2 text-muted-foreground">
              {t('common.tagline')}
            </p>
          </div>

          {/* Login Tabs */}
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="gap-2">
                <Mail className="h-4 w-4" />
                {t('auth.loginWithEmail')}
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2">
                <Phone className="h-4 w-4" />
                {t('auth.loginWithPhone')}
              </TabsTrigger>
            </TabsList>

            {/* Email Login */}
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex justify-end">
                  <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    {t('auth.forgotPassword')}
                  </Link>
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? t('common.loading') : t('nav.login')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            {/* Phone Login */}
            <TabsContent value="phone">
              <form onSubmit={handlePhoneLogin} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('auth.phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      required
                      disabled={codeSent}
                    />
                  </div>
                </div>

                {codeSent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    <Label htmlFor="code">{t('auth.verificationCode')}</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="000000"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setCodeSent(false)}
                      className="text-sm text-primary hover:underline"
                    >
                      {t('auth.resendCode')}
                    </button>
                  </motion.div>
                )}

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? t('common.loading') : codeSent ? t('nav.login') : t('auth.sendCode')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Register Link */}
          <p className="text-center text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link to="/auth/register" className="text-primary font-semibold hover:underline">
              {t('auth.registerNow')}
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Panel - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center max-w-md"
        >
          <div className="mb-8 p-8 rounded-3xl bg-background/50 backdrop-blur-sm">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Start Learning Today
            </h2>
            <p className="text-muted-foreground">
              Join thousands of students and teachers across Africa building the future of education together.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">4,000+</p>
              <p className="text-sm text-muted-foreground">Schools</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">45,000+</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">890+</p>
              <p className="text-sm text-muted-foreground">Courses</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
