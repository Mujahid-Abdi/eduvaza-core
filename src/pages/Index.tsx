import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, GraduationCap } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/contexts/I18nContext';
import { mockCategories, mockCourses } from '@/services/mockData';
import { AIChatbotButton } from '@/components/shared';

const Index = () => {
  const { t } = useI18n();

  const featuredCourses = mockCourses.slice(0, 6);

  return (
    <MainLayout>
      <AIChatbotButton />
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-12 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-full bg-primary/10 text-primary text-xs lg:text-sm font-medium mb-4 lg:mb-6">
                ✨ Start Learning Today
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-foreground leading-tight mb-4 lg:mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground mb-6 lg:mb-8 max-w-lg mx-auto lg:mx-0">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start">
                <Button variant="hero" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/auth/register">
                    {t('hero.getStarted')} <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5" />
                  </Link>
                </Button>
                <Button variant="heroOutline" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/courses">{t('hero.exploreCategories')}</Link>
                </Button>
              </div>
              <p className="mt-6 lg:mt-8 text-xs lg:text-sm text-muted-foreground">{t('hero.trustedBy')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex justify-center"
            >
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full bg-primary/30 flex items-center justify-center text-8xl">
                    📚
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 p-4 bg-background rounded-2xl shadow-lg animate-float">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="font-bold">45K+ Students</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 p-4 bg-background rounded-2xl shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-secondary" />
                    <span className="font-bold">890+ Courses</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold text-foreground mb-3 lg:mb-4">{t('courses.title')}</h2>
            <p className="text-sm lg:text-base text-muted-foreground max-w-2xl mx-auto">{t('courses.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {mockCategories.map((cat, i) => (
              <motion.div 
                key={cat.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="p-3 lg:p-6 rounded-xl lg:rounded-2xl border border-border hover:border-primary hover:shadow-lg transition-all text-center cursor-pointer group"
              >
                <div className="text-2xl lg:text-4xl mb-2 lg:mb-3">{cat.icon}</div>
                <h3 className="font-medium lg:font-semibold text-xs lg:text-base text-foreground line-clamp-1">{cat.name}</h3>
                <p className="text-[10px] lg:text-sm text-muted-foreground hidden sm:block">{cat.courseCount} courses</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 lg:mb-12">
            <h2 className="text-xl lg:text-3xl font-bold text-foreground">Featured Courses</h2>
            <Button variant="outline" size="sm" asChild>
              <Link to="/courses">{t('common.viewAll')}</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {featuredCourses.map((course, i) => (
              <motion.div 
                key={course.id} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl lg:rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-muted">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl lg:text-4xl">📚</div>
                  )}
                </div>
                <div className="p-4 lg:p-5">
                  <span className="text-[10px] lg:text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 lg:py-1 rounded">{course.category}</span>
                  <h3 className="font-semibold text-sm lg:text-base text-foreground mt-2 lg:mt-3 line-clamp-2">{course.title}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground mt-1 lg:mt-2">{course.teacherName}</p>
                  <div className="flex items-center justify-between mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-border text-xs lg:text-sm text-muted-foreground">
                    <span>{course.lessons.length} lessons</span>
                    <span>{course.enrolledCount} enrolled</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 lg:py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-center">
            {[
              { value: '156+', label: 'Schools' },
              { value: '2,340+', label: 'Teachers' },
              { value: '45,680+', label: 'Students' },
              { value: '892+', label: 'Courses' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl sm:text-3xl lg:text-5xl font-bold">{stat.value}</p>
                <p className="text-primary-foreground/80 text-sm lg:text-base mt-1 lg:mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;