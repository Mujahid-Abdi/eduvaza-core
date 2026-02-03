import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, Search, MapPin, BookOpen, Eye, AlertTriangle, Ban, Mail, FileQuestion, Award } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Extended mock teacher data
const mockTeachers = [
  {
    id: 'teacher-1',
    name: 'John Mwamba',
    email: 'john@example.com',
    country: 'Kenya',
    educationLevel: 'Masters Degree',
    specialization: 'Mathematics',
    coursesUploaded: 12,
    quizzesPrepared: 45,
    warnings: 0,
    rating: 4.8,
    studentsCount: 234,
    status: 'active',
  },
  {
    id: 'teacher-2',
    name: 'Fatima Osei',
    email: 'fatima@example.com',
    country: 'Ghana',
    educationLevel: 'PhD',
    specialization: 'Science',
    coursesUploaded: 18,
    quizzesPrepared: 67,
    warnings: 1,
    rating: 4.9,
    studentsCount: 456,
    status: 'active',
  },
  {
    id: 'teacher-3',
    name: 'Marie Kouassi',
    email: 'marie@example.com',
    country: 'Ivory Coast',
    educationLevel: 'Masters Degree',
    specialization: 'Languages',
    coursesUploaded: 8,
    quizzesPrepared: 32,
    warnings: 0,
    rating: 4.7,
    studentsCount: 312,
    status: 'active',
  },
  {
    id: 'teacher-4',
    name: 'Kwame Asante',
    email: 'kwame@example.com',
    country: 'Ghana',
    educationLevel: 'Bachelors Degree',
    specialization: 'Arts',
    coursesUploaded: 5,
    quizzesPrepared: 18,
    warnings: 2,
    rating: 4.3,
    studentsCount: 98,
    status: 'active',
  },
  {
    id: 'teacher-5',
    name: 'Juma Mwinyi',
    email: 'juma@example.com',
    country: 'Tanzania',
    educationLevel: 'Masters Degree',
    specialization: 'Languages',
    coursesUploaded: 10,
    quizzesPrepared: 38,
    warnings: 0,
    rating: 4.6,
    studentsCount: 276,
    status: 'active',
  },
];

export const ManageTeachers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [educationFilter, setEducationFilter] = useState('all');
  const [warningFilter, setWarningFilter] = useState('all');

  const filteredTeachers = mockTeachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === 'all' || teacher.country === countryFilter;
    const matchesEducation = educationFilter === 'all' || teacher.educationLevel === educationFilter;
    const matchesWarning = warningFilter === 'all' || 
                          (warningFilter === 'with-warnings' && teacher.warnings > 0) ||
                          (warningFilter === 'no-warnings' && teacher.warnings === 0);
    return matchesSearch && matchesCountry && matchesEducation && matchesWarning;
  });

  const handleWarnTeacher = (name: string) => {
    toast.warning(`Warning sent to ${name}`);
  };

  const handleSuspendTeacher = (name: string) => {
    toast.error(`${name} has been suspended`);
  };

  const handleViewDetails = (name: string) => {
    toast.info(`Viewing details for ${name}`);
  };

  const countries = ['all', ...Array.from(new Set(mockTeachers.map(t => t.country)))];
  const educationLevels = ['all', ...Array.from(new Set(mockTeachers.map(t => t.educationLevel)))];

  const stats = {
    total: mockTeachers.length,
    totalCourses: mockTeachers.reduce((acc, t) => acc + t.coursesUploaded, 0),
    totalQuizzes: mockTeachers.reduce((acc, t) => acc + t.quizzesPrepared, 0),
    withWarnings: mockTeachers.filter(t => t.warnings > 0).length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8" />
            Manage Teachers
          </h1>
          <p className="text-muted-foreground mt-2">View and manage all teachers in the system</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-4"
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.totalCourses}</div>
              <p className="text-sm text-muted-foreground">Courses Uploaded</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.totalQuizzes}</div>
              <p className="text-sm text-muted-foreground">Quizzes Prepared</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600">{stats.withWarnings}</div>
              <p className="text-sm text-muted-foreground">With Warnings</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country === 'all' ? 'All Countries' : country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={educationFilter} onValueChange={setEducationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Education level" />
                </SelectTrigger>
                <SelectContent>
                  {educationLevels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level === 'all' ? 'All Levels' : level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={warningFilter} onValueChange={setWarningFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Warning status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  <SelectItem value="with-warnings">With Warnings</SelectItem>
                  <SelectItem value="no-warnings">No Warnings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Teachers List */}
        <Card>
          <CardHeader>
            <CardTitle>Teachers ({filteredTeachers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                      {teacher.name[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{teacher.name}</p>
                        {teacher.warnings > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {teacher.warnings} warning{teacher.warnings > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {teacher.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {teacher.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          {teacher.educationLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline">{teacher.specialization}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {teacher.coursesUploaded} courses
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <FileQuestion className="h-3 w-3" />
                          {teacher.quizzesPrepared} quizzes
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ⭐ {teacher.rating} rating
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {teacher.studentsCount} students
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(teacher.name)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleWarnTeacher(teacher.name)}>
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSuspendTeacher(teacher.name)}>
                      <Ban className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ManageTeachers;
