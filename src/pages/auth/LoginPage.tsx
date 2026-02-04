import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { toast } from 'sonner';
import { getRoleBasedRoute } from '@/lib/roleRedirect';

export const LoginPage = () => {
  const { t } = useI18n();
  const { login, loginWithPhone, sendPhoneCode, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [error, setError] = useState('');

  // Redirect when user logs in
  useEffect(() => {
    if (user?.role) {
      navigate(getRoleBasedRoute(user.role), { replace: true });
    }
  }, [user, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      toast.success('Login successful!');
      // User state is updated by AuthContext, navigate immediately
      // The login function already sets the user, so we can navigate right away
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (!codeSent) {
        await sendPhoneCode(phone);
        setCodeSent(true);
        toast.success('Verification code sent!');
        return;
      }
      
      await loginWithPhone(phone, code);
      toast.success('Login successful!');
      // User state is updated by AuthContext, navigate immediately
    } catch (error: any) {
      setError(error.message);
      toast.error(error.message);
    }
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

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md"
              >
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}

            {/* Email Login */}
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-with-icon"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-with-icon-both"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none z-10" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+254 700 000 000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-with-icon"
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

                {/* reCAPTCHA container for Firebase phone auth */}
                <div id="recaptcha-container"></div>

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
