import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, FileQuestion, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export const MobileBottomNav = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navItems = [
    {
      href: '/',
      label: 'Home',
      icon: Home,
    },
    {
      href: '/courses',
      label: 'Courses',
      icon: BookOpen,
    },
    {
      href: '/quizzes',
      label: 'Quizzes',
      icon: FileQuestion,
    },
    {
      href: '/opportunities',
      label: 'Opportunities',
      icon: Briefcase,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show nav when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      } 
      // Hide nav when scrolling down (but not at the very top)
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
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
          {/* Safe area padding for devices with notches */}
          <div className="pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex flex-col items-center justify-center flex-1 h-full relative group active:scale-95 transition-transform"
                  >
                    {/* Active indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-b-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* Icon with ripple effect */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-center transition-all duration-200 ${
                        active
                          ? 'text-primary scale-110'
                          : 'text-muted-foreground group-hover:text-primary group-active:text-primary'
                      }`}
                    >
                      {active && (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.5 }}
                          animate={{ scale: 1.5, opacity: 0 }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                          className="absolute w-10 h-10 rounded-full bg-primary/20"
                        />
                      )}
                      <Icon className="h-6 w-6 relative z-10" strokeWidth={active ? 2.5 : 2} />
                    </motion.div>

                    {/* Label */}
                    <motion.span
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                      className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                        active ? 'text-primary' : 'text-muted-foreground group-hover:text-primary group-active:text-primary'
                      }`}
                    >
                      {item.label}
                    </motion.span>

                    {/* Tap feedback */}
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
