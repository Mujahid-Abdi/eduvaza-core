import { motion } from 'framer-motion';
import { Target, Users, Award, Globe, Heart, Zap, CheckCircle2 } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const AboutPage = () => {
  const { isAuthenticated, user } = useAuth();

  // Only redirect admin to dashboard, other users can see public pages
  if (isAuthenticated && user?.role === 'super_admin') {
    return <Navigate to="/admin" replace />;
  }
  const values = [
    {
      icon: <Target className="h-8 w-8" />,
      title: 'Our Mission',
      description: 'To democratize education and make quality learning accessible to everyone, everywhere.',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: 'Our Vision',
      description: 'A world where every student has access to excellent education regardless of location or background.',
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Our Values',
      description: 'Excellence, Innovation, Accessibility, and Community-driven learning for all.',
    },
  ];

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Expert Instructors',
      description: 'Learn from experienced educators and industry professionals',
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Reach',
      description: 'Access courses in multiple languages from anywhere in the world',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Quality Content',
      description: 'Curated courses designed to help you achieve your learning goals',
    },
  ];

  const stats = [
    { value: '156+', label: 'Partner Schools' },
    { value: '2,340+', label: 'Expert Teachers' },
    { value: '45,680+', label: 'Active Students' },
    { value: '892+', label: 'Quality Courses' },
  ];

  const team = [
    { name: 'Dr. Sarah Johnson', role: 'CEO & Founder', emoji: '👩‍💼' },
    { name: 'Michael Chen', role: 'CTO', emoji: '👨‍💻' },
    { name: 'Emily Rodriguez', role: 'Head of Education', emoji: '👩‍🏫' },
    { name: 'David Williams', role: 'Head of Operations', emoji: '👨‍💼' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              About EduVaza
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Empowering learners worldwide with accessible, quality education through innovative technology and passionate educators.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, EduVaza was born from a simple yet powerful idea: education should be accessible to everyone, regardless of their location or circumstances.
                </p>
                <p>
                  What started as a small initiative to connect teachers and students in underserved communities has grown into a comprehensive learning platform serving thousands of students across multiple countries.
                </p>
                <p>
                  Today, we partner with schools, educators, and institutions to deliver high-quality educational content in multiple languages, making learning truly accessible and inclusive.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Multi-language support</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Mobile-first design</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Offline access</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-9xl">
                🎓
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose EduVaza?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing the best learning experience through innovative features and dedicated support.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Meet Our Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Passionate educators and technologists working together to transform education.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="text-6xl mb-4">{member.emoji}</div>
                    <h3 className="font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Join Our Learning Community
          </h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Start your learning journey today and be part of a global community of learners.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/auth/register">Get Started Free</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;
