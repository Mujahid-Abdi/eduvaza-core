import { motion } from 'framer-motion';
import { useState } from 'react';
import { Flag, Search, Eye, AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Mock reported content
const mockReports = [
  {
    id: 'report-1',
    courseId: 'course-1',
    courseName: 'Mathematics 101',
    reportedBy: 'student-1',
    reporterName: 'Amara Diallo',
    reporterRole: 'student',
    reason: 'Inappropriate content in lesson 3',
    uploadedBy: 'teacher-1',
    uploaderName: 'John Mwamba',
    uploaderRole: 'teacher',
    schoolId: 'sch-1',
    schoolName: 'Green Valley School',
    date: new Date('2024-01-15'),
    status: 'pending',
    category: 'content',
  },
  {
    id: 'report-2',
    courseId: 'course-2',
    courseName: 'Physics Basics',
    reportedBy: 'teacher-2',
    reporterName: 'Sarah Johnson',
    reporterRole: 'teacher',
    reason: 'Outdated information, needs update',
    uploadedBy: 'school-1',
    uploaderName: 'Green Valley School',
    uploaderRole: 'school',
    schoolId: 'sch-1',
    schoolName: 'Green Valley School',
    date: new Date('2024-01-20'),
    status: 'pending',
    category: 'quality',
  },
  {
    id: 'report-3',
    courseId: 'course-3',
    courseName: 'Chemistry Advanced',
    reportedBy: 'student-2',
    reporterName: 'Kwame Mensah',
    reporterRole: 'student',
    reason: 'Plagiarized content from another source',
    uploadedBy: 'teacher-3',
    uploaderName: 'Marie Kouassi',
    uploaderRole: 'teacher',
    schoolId: 'sch-2',
    schoolName: 'Lagos Academy',
    date: new Date('2024-01-25'),
    status: 'pending',
    category: 'plagiarism',
  },
];

export const ManageReports = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewCourse = (courseName: string) => {
    toast.info(`Viewing ${courseName}`);
  };

  const handleWarnUploader = (uploaderName: string) => {
    toast.warning(`Warning sent to ${uploaderName}`);
  };

  const handleDeleteCourse = (courseName: string) => {
    toast.success(`${courseName} has been deleted`);
  };

  const handleResolveReport = (reportId: string) => {
    toast.success('Report has been resolved');
  };

  const stats = {
    total: mockReports.length,
    pending: mockReports.filter(r => r.status === 'pending').length,
    resolved: mockReports.filter(r => r.status === 'resolved').length,
    byStudents: mockReports.filter(r => r.reporterRole === 'student').length,
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
            <Flag className="h-8 w-8 text-destructive" />
            Manage Reports
          </h1>
          <p className="text-muted-foreground mt-2">Review and handle reported content</p>
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
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <p className="text-sm text-muted-foreground">Resolved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600">{stats.byStudents}</div>
              <p className="text-sm text-muted-foreground">By Students</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="content">Content Issue</SelectItem>
                  <SelectItem value="quality">Quality Issue</SelectItem>
                  <SelectItem value="plagiarism">Plagiarism</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>Reports ({filteredReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-xl border-2 border-destructive/20 bg-destructive/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-lg">{report.courseName}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reported by: {report.reporterName} ({report.reporterRole}) on {report.date.toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="destructive">{report.status}</Badge>
                  </div>

                  <div className="bg-background p-3 rounded-lg mb-3">
                    <p className="text-sm font-medium mb-1">Reason:</p>
                    <p className="text-sm text-muted-foreground">{report.reason}</p>
                    <Badge variant="outline" className="mt-2">{report.category}</Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Uploaded By:</p>
                      <p className="font-medium">{report.uploaderName}</p>
                      <Badge variant="outline" className="mt-1">{report.uploaderRole}</Badge>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">School:</p>
                      <p className="font-medium">{report.schoolName}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewCourse(report.courseName)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Course
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleWarnUploader(report.uploaderName)}>
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Warn {report.uploaderRole}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteCourse(report.courseName)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Course
                    </Button>
                    <Button variant="default" size="sm" onClick={() => handleResolveReport(report.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
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

export default ManageReports;
