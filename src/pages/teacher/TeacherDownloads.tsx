import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Video, FileText, Trash2, Play, Eye, Search, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface DownloadedItem {
  id: string;
  title: string;
  type: 'video' | 'document';
  courseName: string;
  size: string;
  downloadedAt: Date;
  duration?: string;
  thumbnail?: string;
  fileUrl: string;
}

// Mock downloaded items for teachers
const mockDownloads: DownloadedItem[] = [
  {
    id: 'dl-1',
    title: 'Introduction to Algebra',
    type: 'video',
    courseName: 'Mathematics Grade 10',
    size: '245 MB',
    downloadedAt: new Date(Date.now() - 86400000),
    duration: '15:30',
    fileUrl: '/downloads/algebra-intro.mp4',
  },
  {
    id: 'dl-2',
    title: 'Algebra Practice Problems',
    type: 'document',
    courseName: 'Mathematics Grade 10',
    size: '2.5 MB',
    downloadedAt: new Date(Date.now() - 172800000),
    fileUrl: '/downloads/algebra-practice.pdf',
  },
  {
    id: 'dl-3',
    title: 'Ecosystem Basics',
    type: 'video',
    courseName: 'Science - Biology',
    size: '180 MB',
    downloadedAt: new Date(Date.now() - 259200000),
    duration: '12:45',
    fileUrl: '/downloads/ecosystem.mp4',
  },
  {
    id: 'dl-4',
    title: 'Cell Structure Diagram',
    type: 'document',
    courseName: 'Science - Biology',
    size: '5.8 MB',
    downloadedAt: new Date(Date.now() - 345600000),
    fileUrl: '/downloads/cell-structure.pdf',
  },
  {
    id: 'dl-5',
    title: 'Photosynthesis Process',
    type: 'video',
    courseName: 'Science - Biology',
    size: '320 MB',
    downloadedAt: new Date(Date.now() - 432000000),
    duration: '20:15',
    fileUrl: '/downloads/photosynthesis.mp4',
  },
];

export const TeacherDownloads = () => {
  const { t } = useI18n();
  const { user } = useAuth();
  const [downloads, setDownloads] = useState<DownloadedItem[]>(mockDownloads);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'video' | 'document'>('all');

  // Filter downloads
  const filteredDownloads = downloads.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.courseName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate total storage used
  const totalStorage = downloads.reduce((total, item) => {
    const size = parseFloat(item.size);
    const unit = item.size.includes('GB') ? 1024 : 1;
    return total + (size * unit);
  }, 0);

  const handleDelete = (id: string) => {
    setDownloads(downloads.filter(item => item.id !== id));
    toast.success('Download deleted successfully');
  };

  const handleOpen = (item: DownloadedItem) => {
    // In a real app, this would open the file
    toast.info(`Opening ${item.title}...`);
  };

  const getFileIcon = (type: 'video' | 'document') => {
    return type === 'video' ? (
      <Video className="h-5 w-5 text-blue-500" />
    ) : (
      <FileText className="h-5 w-5 text-green-500" />
    );
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
            <Download className="h-8 w-8 text-primary" />
            My Downloads
          </h1>
          <p className="text-muted-foreground">
            Access your downloaded videos and documents for offline teaching
          </p>
        </motion.div>

        {/* Storage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">Storage Used</p>
                  <p className="text-2xl font-bold">{totalStorage.toFixed(1)} MB</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold">{downloads.length}</p>
                </div>
              </div>
              <Progress value={(totalStorage / 10240) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {(10240 - totalStorage).toFixed(1)} MB available of 10 GB
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search downloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="video">Videos Only</SelectItem>
              <SelectItem value="document">Documents Only</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Downloads List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {filteredDownloads.length > 0 ? (
            <div className="grid gap-4">
              {filteredDownloads.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-lg ${
                        item.type === 'video' ? 'bg-blue-500/10' : 'bg-green-500/10'
                      }`}>
                        {getFileIcon(item.type)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                        <p className="text-sm text-muted-foreground truncate">{item.courseName}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {item.size}
                          </Badge>
                          {item.duration && (
                            <Badge variant="outline" className="text-xs">
                              {item.duration}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {new Date(item.downloadedAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpen(item)}
                        >
                          {item.type === 'video' ? (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Download className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Downloads Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterType !== 'all'
                    ? 'Try adjusting your search or filter'
                    : 'Start downloading videos and documents for offline access'}
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Offline Teaching Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Download content when connected to Wi-Fi to save mobile data</li>
                <li>• Videos are available in different quality settings to save storage</li>
                <li>• Downloaded content is automatically removed after 30 days</li>
                <li>• You can download up to 10 GB of content for offline access</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDownloads;
