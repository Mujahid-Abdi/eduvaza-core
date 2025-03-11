import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, FileText, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDFViewer } from './PDFViewer';
import { VideoPlayer } from './VideoPlayer';
import { cn } from '@/lib/utils';

interface DownloadViewerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: 'video' | 'document';
  src: string;
}

export const DownloadViewer = ({
  isOpen,
  onClose,
  title,
  type,
  src,
}: DownloadViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-3">
            {type === 'video' ? (
              <Video className="h-5 w-5 text-blue-500" />
            ) : (
              <FileText className="h-5 w-5 text-green-500" />
            )}
            <h2 className="font-semibold truncate">{title}</h2>
          </div>
          <Button variant="ghost" size="iconSm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-60px)] overflow-hidden">
          {type === 'video' ? (
            <VideoPlayer
              src={src}
              title={title}
              allowDownload={true}
              className="h-full"
            />
          ) : (
            <PDFViewer
              src={src}
              title={title}
              allowDownload={true}
              className="h-full"
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DownloadViewer;
