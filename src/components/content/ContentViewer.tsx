import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Video, Download, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PDFViewer } from './PDFViewer';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '@/lib/utils';
import type { Lesson } from '@/types';

interface ContentViewerProps {
  lesson: Lesson;
  onProgress?: (lessonId: string, progress: number) => void;
  onComplete?: (lessonId: string) => void;
  allowDownload?: boolean;
  className?: string;
}

export const ContentViewer = ({
  lesson,
  onProgress,
  onComplete,
  allowDownload = false,
  className,
}: ContentViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePDFProgress = (currentPage: number, totalPages: number) => {
    const progress = (currentPage / totalPages) * 100;
    onProgress?.(lesson.id, progress);
    
    if (currentPage === totalPages) {
      onComplete?.(lesson.id);
    }
  };

  const handleVideoProgress = (currentTime: number, duration: number) => {
    const progress = (currentTime / duration) * 100;
    onProgress?.(lesson.id, progress);
  };

  const handleVideoComplete = () => {
    onComplete?.(lesson.id);
  };

  const renderContent = () => {
    switch (lesson.contentType) {
      case 'pdf':
        return lesson.pdfUrl ? (
          <PDFViewer
            src={lesson.pdfUrl}
            title={lesson.title}
            allowDownload={allowDownload}
            onProgress={handlePDFProgress}
            className="h-[600px] md:h-[800px]"
          />
        ) : (
          <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">PDF not available</p>
            </div>
          </div>
        );

      case 'video':
        return lesson.videoUrl ? (
          <VideoPlayer
            src={lesson.videoUrl}
            title={lesson.title}
            allowDownload={allowDownload}
            onProgress={handleVideoProgress}
            onComplete={handleVideoComplete}
            className="aspect-video"
          />
        ) : (
          <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
            <div className="text-center">
              <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Video not available</p>
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <Card>
            <CardContent className="p-6 prose prose-sm md:prose-base max-w-none">
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-4', className)}
    >
      {/* Lesson header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline">
              {lesson.contentType === 'pdf' && <FileText className="h-3 w-3 mr-1" />}
              {lesson.contentType === 'video' && <Video className="h-3 w-3 mr-1" />}
              {lesson.contentType.toUpperCase()}
            </Badge>
            {lesson.duration && (
              <Badge variant="secondary">
                {lesson.duration} min
              </Badge>
            )}
          </div>
        </div>

        {allowDownload && (lesson.pdfUrl || lesson.videoUrl) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(lesson.pdfUrl || lesson.videoUrl, '_blank')}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
      </div>

      {/* Content */}
      {renderContent()}
    </motion.div>
  );
};

export default ContentViewer;
