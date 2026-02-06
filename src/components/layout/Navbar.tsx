import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import type { Language } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
];

export const Navbar = () => {
  const { t, locale, setLocale } = useI18n();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/home', label: t('nav.home') },
    { href: '/courses', label: t('nav.courses') },
    { href: '/quizzes', label: 'Quizzes' },
    { href: '/opportunities', label: 'Opportunities' },
    { href: '/about', label: t('nav.about') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const getDashboardPath = () => {
    if (!user) return '/auth/login';
    switch (user.role) {
      case 'super_admin': return '/admin';
      case 'school': return '/school';
      case 'teacher': return '/teacher';
      case 'student': return '/student';
      default: return '/';
    }
  };

  const currentLanguage = languages.find(l => l.code === locale);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/afedulight-logo.jpg" alt="AfEdulight" className="h-10 w-10" />
          <span className="text-xl font-bold text-foreground">
            Af<span className="text-[#c9a961]">Edu</span><span className="text-[#6b8cbb]">light</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span>{currentLanguage?.flag}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLocale(lang.code)}
                  className={locale === lang.code ? 'bg-accent' : ''}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to={getDashboardPath()}>{t('nav.dashboard')}</Link>
              </Button>
              <Button variant="outline" onClick={logout}>
                {t('nav.logout')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth/login">{t('nav.login')}</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/auth/register">{t('nav.register')}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border md:hidden"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={locale === lang.code ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setLocale(lang.code)}
                >
                  {lang.flag} {lang.name}
                </Button>
              ))}
            </div>
            <div className="flex gap-2 pt-4">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to={getDashboardPath()}>{t('nav.dashboard')}</Link>
                  </Button>
                  <Button variant="ghost" onClick={logout}>
                    {t('nav.logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/auth/login">{t('nav.login')}</Link>
                  </Button>
                  <Button variant="hero" className="flex-1" asChild>
                    <Link to="/auth/register">{t('nav.register')}</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
