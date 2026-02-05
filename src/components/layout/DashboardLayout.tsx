import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  School,
  UserCheck,
  BarChart3,
  Layers,
  PlusCircle,
  FileQuestion,
  Zap,
  Trophy,
  MessageSquare,
  Flag,
  Download,
  Moon,
  Sun,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { UserRole } from '@/types';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  icon: ReactNode;
  label: string;
  href: string;
}

const getNavItems = (role: UserRole, t: (key: string) => string): NavItem[] => {
  const baseItems: NavItem[] = [
    { icon: <LayoutDashboard className="h-5 w-5" />, label: t('dashboard.overview'), href: '' },
  ];

  switch (role) {
    case 'super_admin':
      return [
        ...baseItems,
        { icon: <Users className="h-5 w-5" />, label: 'All Users', href: '/users' },
        { icon: <GraduationCap className="h-5 w-5" />, label: 'Students', href: '/students' },
        { icon: <UserCheck className="h-5 w-5" />, label: 'Teachers', href: '/teachers' },
        { icon: <School className="h-5 w-5" />, label: 'Schools', href: '/schools' },
        { icon: <BookOpen className="h-5 w-5" />, label: 'Courses', href: '/courses' },
        { icon: <FileQuestion className="h-5 w-5" />, label: 'Quizzes', href: '/quizzes' },
        { icon: <Flag className="h-5 w-5" />, label: 'Reports', href: '/reports' },
      ];
    case 'school':
      return [
        ...baseItems,
        { icon: <BookOpen className="h-5 w-5" />, label: 'Courses', href: '/courses' },
        { icon: <FileQuestion className="h-5 w-5" />, label: 'Quizzes', href: '/quizzes' },
        { icon: <MessageSquare className="h-5 w-5" />, label: 'Student Questions', href: '/questions' },
        { icon: <Sparkles className="h-5 w-5" />, label: 'AI Assistant', href: '/ai-assistant' },
        { icon: <BarChart3 className="h-5 w-5" />, label: 'Analytics', href: '/analytics' },
      ];
    case 'teacher':
      return [
        ...baseItems,
        { icon: <BookOpen className="h-5 w-5" />, label: t('teacher.myCourses'), href: '/courses' },
        { icon: <FileQuestion className="h-5 w-5" />, label: t('quiz.myQuizzes'), href: '/quizzes' },
        { icon: <MessageSquare className="h-5 w-5" />, label: 'Student Questions', href: '/questions' },
        { icon: <Sparkles className="h-5 w-5" />, label: 'AI Assistant', href: '/ai-assistant' },
        { icon: <BarChart3 className="h-5 w-5" />, label: t('quiz.analytics'), href: '/analytics' },
        { icon: <GraduationCap className="h-5 w-5" />, label: 'My Learning', href: '/learning' },
        { icon: <Download className="h-5 w-5" />, label: 'My Downloads', href: '/downloads' },
      ];
    case 'student':
      return [
        ...baseItems,
        { icon: <BookOpen className="h-5 w-5" />, label: t('student.myCourses'), href: '/my-courses' },
        { icon: <FileQuestion className="h-5 w-5" />, label: t('quiz.quizzes'), href: '/quizzes' },
        { icon: <Sparkles className="h-5 w-5" />, label: 'Study Helper', href: '/ai-assistant' },
        { icon: <Trophy className="h-5 w-5" />, label: t('gamification.leaderboard'), href: '/leaderboard' },
        { icon: <Layers className="h-5 w-5" />, label: 'My Downloads', href: '/downloads' },
      ];
    default:
      return baseItems;
  }
};

const getRoleBasePath = (role: UserRole): string => {
  switch (role) {
    case 'super_admin': return '/admin';
    case 'school': return '/school';
    case 'teacher': return '/teacher';
    case 'student': return '/student';
    default: return '/';
  }
};

const getRoleTitle = (role: UserRole, t: (key: string) => string): string => {
  switch (role) {
    case 'super_admin': return t('admin.title');
    case 'school': return t('school.title');
    case 'teacher': return t('teacher.title');
    case 'student': return t('student.title');
    default: return '';
  }
};

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const { resolvedTheme, toggleTheme } = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const basePath = getRoleBasePath(user.role);
  const navItems = getNavItems(user.role, t);
  const roleTitle = getRoleTitle(user.role, t);

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        className="fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground z-40 flex flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                <span className="text-lg font-bold text-sidebar-primary-foreground">E</span>
              </div>
              <span className="text-lg font-bold">EduVaza</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Role Badge */}
        {!collapsed && (
          <div className="px-4 py-3">
            <div className="bg-sidebar-accent rounded-lg px-3 py-2">
              <p className="text-xs text-sidebar-foreground/70">{t('dashboard.welcome')}</p>
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-xs text-sidebar-primary mt-1">{roleTitle}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const fullPath = `${basePath}${item.href}`;
            const isActive = item.href.startsWith('?')
              ? location.pathname === basePath && location.search === item.href
              : location.pathname === fullPath || (item.href === '' && location.pathname === basePath);

            return (
              <Link
                key={item.href}
                to={fullPath}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                {item.icon}
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-sidebar-border space-y-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            {!collapsed && (
              <span className="text-sm font-medium">
                {resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            )}
          </button>
          <Link
            to={`${basePath}/settings`}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent transition-colors"
          >
            <Settings className="h-5 w-5" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="text-sm font-medium">{t('nav.logout')}</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-200"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
