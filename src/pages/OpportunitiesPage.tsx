import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, GraduationCap, School, BookOpen, Sparkles } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { opportunitiesService } from '@/services/opportunities';
import { Opportunity } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const OpportunitiesPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await opportunitiesService.getActiveOpportunities();
      setOpportunities(data);
    } catch (error) {
      console.error('Error loading opportunities:', error);
      toast.error('Failed to load opportunities');
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLearnMore = (opportunity: Opportunity) => {
    if (!isAuthenticated) {
      toast.error('Please login to access opportunities');
      navigate('/auth/login');
      return;
    }
    // Open external link
    window.open(opportunity.link, '_blank', 'noopener,noreferrer');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'scholarship':
        return <GraduationCap className="h-5 w-5" />;
      case 'university':
        return <School className="h-5 w-5" />;
      case 'free_course':
        return <BookOpen className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'scholarship':
        return 'Scholarship';
      case 'university':
        return 'University';
      case 'free_course':
        return 'Free Course';
      default:
        return 'Other';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scholarship':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'university':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'free_course':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      default:
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
    }
  };

  const filteredOpportunities = filter === 'all' 
    ? opportunities 
    : opportunities.filter(opp => opp.category === filter);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Global Opportunities</h1>
          <p className="text-muted-foreground">
            Discover scholarships, universities, and free courses
          </p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All Opportunities
          </Button>
          <Button
            variant={filter === 'scholarship' ? 'default' : 'outline'}
            onClick={() => setFilter('scholarship')}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Scholarships
          </Button>
          <Button
            variant={filter === 'university' ? 'default' : 'outline'}
            onClick={() => setFilter('university')}
          >
            <School className="h-4 w-4 mr-2" />
            Universities
          </Button>
          <Button
            variant={filter === 'free_course' ? 'default' : 'outline'}
            onClick={() => setFilter('free_course')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Free Courses
          </Button>
          <Button
            variant={filter === 'other' ? 'default' : 'outline'}
            onClick={() => setFilter('other')}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Other
          </Button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted" />
                <CardHeader>
                  <div className="h-6 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Opportunities Grid */}
        {!loading && filteredOpportunities.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Cover Image */}
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={opportunity.coverImage}
                    alt={opportunity.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={getCategoryColor(opportunity.category)}>
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(opportunity.category)}
                        {getCategoryLabel(opportunity.category)}
                      </span>
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2">{opportunity.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {opportunity.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <Button 
                    className="w-full" 
                    variant="default"
                    onClick={() => handleLearnMore(opportunity)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredOpportunities.length === 0 && (
          <div className="text-center py-16">
            <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Opportunities Found</h3>
            <p className="text-muted-foreground">
              {filter === 'all' 
                ? 'No opportunities are currently available. Check back soon!'
                : `No ${getCategoryLabel(filter).toLowerCase()} opportunities available at the moment.`}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OpportunitiesPage;
