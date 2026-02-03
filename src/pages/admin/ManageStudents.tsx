import { motion } from 'framer-motion';
import { useState } from 'react';
import { GraduationCap, Search, MapPin, BookOpen, Eye, AlertTriangle, Ban, Mail, Award } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Extended mock student data with country and education level
const mockStudents = [
  {
    id: 'student-1',
    name: 'Amara Diallo',
    email: 'amara@example.com',
    country: 'Kenya',
    educationLevel: 'High School',
    grade: 'Grade 10',
    enrolledCourses: 5,
    completedCourses: 2,
    averageScore: 85,
    status: 'active',
  },
  {
    id: 'student-2',
    name: 'Kwame Mensah',
    email: 'kwame@example.com',
    country: 'Ghana',
    educationLevel: 'University',
    grade: 'Year 2',
    enrolledCourses: 8,
    completedCourses: 5,
    averageScore: 92,
    status: 'active',
  },
  {
    id: 'student-3',
    name: 'Fatima Hassan',
    email: 'fatima@example.com',
    country: 'Nigeria',
    educationLevel: 'High School',
    grade: 'Grade 12',
    enrolledCourses: 6,
    completedCourses: 4,
    averageScore: 88,
    status: 'active',
  },
  {
    id: 'student-4',
    name: 'Thabo Ndlovu',
    email: 'thabo@example.com',
    country: 'South Africa',
    educationLevel: 'Middle School',
    grade: 'Grade 8',
    enrolledCourses: 4,
    completedCourses: 1,
    averageScore: 76,
    status: 'active',
  },
  {
    id: 'student-5',
    name: 'Zainab Ahmed',
    email: 'zainab@example.com',
    country: 'Tanzania',
    educationLevel: 'University',
    grade: 'Year 1',
    enrolledCourses: 7,
    completedCourses: 3,
    averageScore: 90,
    status: 'active',
  },
];

export const ManageStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [educationFilter, setEducationFilter] = useState('all');

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCountry = countryFilter === 'all' || student.country === countryFilter;
    const matchesEducation = educationFilter === 'all' || student.educationLevel === educationFilter;
    return matchesSearch && matchesCountry && matchesEducation;
  });

  const handleWarnStudent = (name: string) => {
    toast.warning(`Warning sent to ${name}`);
  };

  const handleSuspendStudent = (name: string) => {
    toast.error(`${name} has been suspended`);
  };

  const handleViewDetails = (name: string) => {
    toast.info(`Viewing details for ${name}`);
  };

  const countries = ['all', ...Array.from(new Set(mockStudents.map(s => s.country)))];
  const educationLevels = ['all', ...Array.from(new Set(mockStudents.map(s => s.educationLevel)))];

  const stats = {
    total: mockStudents.length,
    active: mockStudents.filter(s => s.status === 'active').length,
    avgScore: Math.round(mockStudents.reduce((acc, s) => acc + s.averageScore, 0) / mockStudents.length),
    totalEnrolled: mockStudents.reduce((acc, s) => acc + s.enrolledCourses, 0),
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
            <GraduationCap className="h-8 w-8" />
            Manage Students
          </h1>
          <p className="text-muted-foreground mt-2">View and manage all students in the system</p>
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
              <p className="text-sm text-muted-foreground">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.avgScore}%</div>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600">{stats.totalEnrolled}</div>
              <p className="text-sm text-muted-foreground">Total Enrollments</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-full md:w-48">
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
                <SelectTrigger className="w-full md:w-48">
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
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-lg font-bold">
                      {student.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{student.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {student.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {student.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {student.educationLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline">{student.grade}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {student.enrolledCourses} courses enrolled
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {student.completedCourses} completed
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <Award className="h-3 w-3 text-yellow-500" />
                          {student.averageScore}% avg
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(student.name)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleWarnStudent(student.name)}>
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSuspendStudent(student.name)}>
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

export default ManageStudents;
