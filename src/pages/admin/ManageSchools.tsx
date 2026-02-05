import { motion } from 'framer-motion';
import { useState } from 'react';
import { School, Search, MapPin, Users, Eye, CheckCircle, XCircle, Ban, Mail, Phone } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockSchools } from '@/services/mockData';
import { toast } from 'sonner';

export const ManageSchools = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const filteredSchools = mockSchools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || school.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || school.address.includes(countryFilter);
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const handleApproveSchool = (name: string) => {
    toast.success(`${name} has been approved`);
  };

  const handleRejectSchool = (name: string) => {
    toast.error(`${name} has been rejected`);
  };

  const handleSuspendSchool = (name: string) => {
    toast.error(`${name} has been suspended`);
  };

  const handleViewDetails = (name: string) => {
    toast.info(`Viewing details for ${name}`);
  };

  const countries = ['all', 'Kenya', 'Nigeria', 'South Africa', 'Ghana', 'Tanzania'];

  const stats = {
    total: mockSchools.length,
    approved: mockSchools.filter(s => s.status === 'approved').length,
    pending: mockSchools.filter(s => s.status === 'pending').length,
    suspended: mockSchools.filter(s => s.status === 'suspended').length,
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
            <School className="h-8 w-8" />
            Manage Schools
          </h1>
          <p className="text-muted-foreground mt-2">View and manage all schools in the system</p>
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
              <p className="text-sm text-muted-foreground">Total Schools</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-sm text-muted-foreground">Approved</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
              <p className="text-sm text-muted-foreground">Suspended</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Schools</CardTitle>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
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
            </div>
          </CardContent>
        </Card>

        {/* Schools List */}
        <Card>
          <CardHeader>
            <CardTitle>Schools ({filteredSchools.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-base sm:text-lg font-bold shrink-0 ${
                      school.status === 'approved' ? 'bg-green-100 text-green-600' :
                      school.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {school.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{school.name}</p>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1 truncate max-w-[150px] sm:max-w-none">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{school.email}</span>
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Phone className="h-3 w-3 shrink-0" />
                          {school.phone}
                        </span>
                        <span className="flex items-center gap-1 truncate max-w-[100px] sm:max-w-none">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{school.address}</span>
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {school.teacherCount} teachers
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {school.studentCount} students
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-center flex-wrap">
                    <Badge variant={
                      school.status === 'approved' ? 'default' :
                      school.status === 'pending' ? 'secondary' :
                      'destructive'
                    } className="text-xs">
                      {school.status}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(school.name)} className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {school.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleApproveSchool(school.name)} className="h-8 w-8 p-0">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRejectSchool(school.name)} className="h-8 w-8 p-0">
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      {school.status === 'approved' && (
                        <Button variant="ghost" size="sm" onClick={() => handleSuspendSchool(school.name)} className="h-8 w-8 p-0">
                          <Ban className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
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

export default ManageSchools;
