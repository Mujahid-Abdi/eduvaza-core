import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  FileQuestion, 
  Briefcase, 
  User, 
  LayoutDashboard,
  Trophy,
  Settings,
  GraduationCap,
  School,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const publicNavItems: NavItem[] = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/courses', label: 'Courses', icon: BookOpen },
  { href: '/quizzes', label: 'Quizzes', icon: FileQuestion },
  { href: '/opportunities', label: 'Jobs', icon: Briefcase },
  { href: '/auth/login', label: 'Login', icon: User },
];

const studentNavItems: NavItem[] = [
  { href: '/student', label: 'Home', icon: LayoutDashboard },
  { href: '/student/my-courses', label: 'Courses', icon: BookOpen },
  { href: '/student/quizzes', label: 'Quizzes', icon: FileQuestion },
  { href: '/student/leaderboard', label: 'Ranks', icon: Trophy },
  { href: '/student/settings', label: 'Settings', icon: Settings },
];

const teacherNavItems: NavItem[] = [
  { href: '/teacher', label: 'Home', icon: LayoutDashboard },
  { href: '/teacher/courses', label: 'Courses', icon: BookOpen },
  { href: '/teacher/quizzes', label: 'Quizzes', icon: FileQuestion },
  { href: '/teacher/ai-assistant', label: 'AI', icon: Sparkles },
  { href: '/teacher/settings', label: 'Settings', icon: Settings },
];

const schoolNavItems: NavItem[] = [
  { href: '/school', label: 'Home', icon: LayoutDashboard },
  { href: '/school/courses', label: 'Courses', icon: BookOpen },
  { href: '/school/quizzes', label: 'Quizzes', icon: FileQuestion },
  { href: '/school/ai-assistant', label: 'AI', icon: Sparkles },
  { href: '/school/settings', label: 'Settings', icon: Settings },
];

const adminNavItems: NavItem[] = [
  { href: '/admin', label: 'Home', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: GraduationCap },
  { href: '/admin/schools', label: 'Schools', icon: School },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/ai-assistant', label: 'AI', icon: Sparkles },
];

export const MobileBottomNav = () => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Determine which nav items to show based on user role and current path
  const getNavItems = (): NavItem[] => {
    // Check if we're on a dashboard route
    const path = location.pathname;
    
    if (path.startsWith('/student') && isAuthenticated && user?.role === 'student') {
      return studentNavItems;
    }
    if (path.startsWith('/teacher') && isAuthenticated && user?.role === 'teacher') {
      return teacherNavItems;
    }
    if (path.startsWith('/school') && isAuthenticated && user?.role === 'school') {
      return schoolNavItems;
    }
    if (path.startsWith('/admin') && isAuthenticated && user?.role === 'super_admin') {
      return adminNavItems;
    }
    
    // For public pages, show public nav with login/dashboard based on auth state
    if (isAuthenticated && user) {
      const dashboardPath = getDashboardPath(user.role);
      return [
        { href: '/home', label: 'Home', icon: Home },
        { href: '/courses', label: 'Courses', icon: BookOpen },
        { href: '/quizzes', label: 'Quizzes', icon: FileQuestion },
        { href: '/opportunities', label: 'Jobs', icon: Briefcase },
        { href: dashboardPath, label: 'Dashboard', icon: LayoutDashboard },
      ];
    }
    
    return publicNavItems;
  };

  const getDashboardPath = (role: string): string => {
    switch (role) {
      case 'student': return '/student';
      case 'teacher': return '/teacher';
      case 'school': return '/school';
      case 'super_admin': return '/admin';
      default: return '/home';
    }
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    const dashboardPaths = ['/student', '/teacher', '/school', '/admin'];
    
    if (dashboardPaths.includes(href)) {
      return location.pathname === href;
    }
    if (href === '/home') {
      return location.pathname === '/home';
    }
    return location.pathname.startsWith(href);
  };

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Always show nav when route changes
  useEffect(() => {
    setIsVisible(true);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 border-t border-border shadow-lg"
        >
          <div className="pb-safe">
            <div className="flex items-center justify-around h-16 px-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex flex-col items-center justify-center flex-1 h-full relative group active:scale-95 transition-transform"
                  >
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-b-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}

                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'flex items-center justify-center transition-all duration-200',
                        active
                          ? 'text-primary scale-110'
                          : 'text-muted-foreground group-hover:text-primary group-active:text-primary'
                      )}
                    >
                      {active && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                          className="absolute w-8 h-8 rounded-full bg-primary/20"
                        />
                      )}
                      <Icon className="h-5 w-5 relative z-10" strokeWidth={active ? 2.5 : 2} />
                    </motion.div>

                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      className={cn(
                        'text-[10px] mt-0.5 font-medium transition-colors duration-200 truncate max-w-[60px]',
                        active ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                      )}
                    >
                      {item.label}
                    </motion.span>

                    <motion.div
                      className="absolute inset-0 bg-primary/5 rounded-lg"
                      initial={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};