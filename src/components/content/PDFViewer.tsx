import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as pdfjsLib from 'pdfjs-dist';
import {
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Search,
  X,
  Download,
  RotateCw,
  Grid3X3,
  FileText,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// Set up PDF.js worker - use unpkg for better compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  src: string;
  title?: string;
  allowDownload?: boolean;
  allowCopy?: boolean;
  onProgress?: (currentPage: number, totalPages: number) => void;
  className?: string;
}

interface ThumbnailData {
  pageNum: number;
  dataUrl: string;
}

export const isCloudinaryRawUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.host !== 'res.cloudinary.com') return false;
    const segments = parsed.pathname.split('/').filter(Boolean);
    return segments.length >= 3 && segments[1] === 'raw' && segments[2] === 'upload';
  } catch {
    return false;
  }
};

export const formatCloudinaryAuthHint = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.host !== 'res.cloudinary.com') return url;
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (segments.length >= 3 && segments[1] === 'raw' && segments[2] === 'upload') {
      segments[2] = 'authenticated';
      parsed.pathname = `/${segments.join('/')}`;
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
};

const isCloudinaryAuthenticatedUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.host !== 'res.cloudinary.com') return false;
    const segments = parsed.pathname.split('/').filter(Boolean);
    return segments.length >= 3 && segments[1] === 'raw' && segments[2] === 'authenticated';
  } catch {
    return false;
  }
};

export const PDFViewer = ({
  src,
  title = 'Document',
  allowDownload = false,
  allowCopy = true,
  onProgress,
  className,
}: PDFViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ page: number; matches: number }[]>([]);
  const [thumbnails, setThumbnails] = useState<ThumbnailData[]>([]);
  const [isRenderingPage, setIsRenderingPage] = useState(false);

  // Load PDF document
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const loadingTask = pdfjsLib.getDocument({
          url: src,
          withCredentials: isCloudinaryAuthenticatedUrl(src),
        });
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err: any) {
        console.error('Error loading PDF:', err);
        setError(err.message || 'Failed to load PDF');
      } finally {
        setIsLoading(false);
      }
    };

    loadPDF();
  }, [src]);

  // Render current page
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current || isRenderingPage) return;

    try {
      setIsRenderingPage(true);
      const page = await pdfDoc.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      const viewport = page.getViewport({ scale, rotation });
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport,
      };

      await page.render(renderContext).promise;

      // Render text layer for search/selection
      if (textLayerRef.current && allowCopy) {
        textLayerRef.current.innerHTML = '';
        textLayerRef.current.style.width = `${viewport.width}px`;
        textLayerRef.current.style.height = `${viewport.height}px`;

        const textContent = await page.getTextContent();
        const textItems = textContent.items as any[];

        textItems.forEach((item) => {
          const div = document.createElement('span');
          div.textContent = item.str;
          div.style.position = 'absolute';
          div.style.left = `${item.transform[4] * scale}px`;
          div.style.top = `${viewport.height - item.transform[5] * scale}px`;
          div.style.fontSize = `${item.transform[0] * scale}px`;
          div.style.fontFamily = item.fontName || 'sans-serif';
          div.style.color = 'transparent';
          div.style.userSelect = allowCopy ? 'text' : 'none';
          textLayerRef.current?.appendChild(div);
        });
      }

      onProgress?.(pageNum, numPages);
    } catch (err) {
      console.error('Error rendering page:', err);
    } finally {
      setIsRenderingPage(false);
    }
  }, [pdfDoc, scale, rotation, allowCopy, numPages, onProgress, isRenderingPage]);

  // Render page when dependencies change
  useEffect(() => {
    renderPage(currentPage);
  }, [currentPage, pdfDoc, scale, rotation, renderPage]);

  // Generate thumbnails lazily
  const generateThumbnails = useCallback(async () => {
    if (!pdfDoc || thumbnails.length > 0) return;

    const newThumbnails: ThumbnailData[] = [];
    const thumbnailScale = 0.2;

    for (let i = 1; i <= Math.min(numPages, 20); i++) {
      try {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: thumbnailScale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport,
        }).promise;

        newThumbnails.push({
          pageNum: i,
          dataUrl: canvas.toDataURL(),
        });
      } catch (err) {
        console.error(`Error generating thumbnail for page ${i}:`, err);
      }
    }

    setThumbnails(newThumbnails);
  }, [pdfDoc, numPages, thumbnails.length]);

  // Generate thumbnails when panel opens
  useEffect(() => {
    if (showThumbnails) {
      generateThumbnails();
    }
  }, [showThumbnails, generateThumbnails]);

  // Search functionality
  const handleSearch = useCallback(async () => {
    if (!pdfDoc || !searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const results: { page: number; matches: number }[] = [];
    const query = searchQuery.toLowerCase();

    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const text = (textContent.items as any[])
          .map((item) => item.str)
          .join(' ')
          .toLowerCase();

        const matches = (text.match(new RegExp(query, 'g')) || []).length;
        if (matches > 0) {
          results.push({ page: i, matches });
        }
      } catch (err) {
        console.error(`Error searching page ${i}:`, err);
      }
    }

    setSearchResults(results);
  }, [pdfDoc, searchQuery, numPages]);

  // Navigation handlers
  const goToPage = (pageNum: number) => {
    const validPage = Math.max(1, Math.min(pageNum, numPages));
    setCurrentPage(validPage);
  };

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const rotate = () => setRotation((r) => (r + 90) % 360);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case 'ArrowLeft':
          goToPage(currentPage - 1);
          break;
        case 'ArrowRight':
          goToPage(currentPage + 1);
          break;
        case '+':
        case '=':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            zoomIn();
          }
          break;
        case '-':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            zoomOut();
          }
          break;
        case 'f':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            setShowSearch(true);
          }
          break;
        case 'Escape':
          setShowSearch(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, numPages]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (error) {
    const showCloudinaryHint = isCloudinaryRawUrl(src);
    return (
      <div className={cn('flex items-center justify-center h-96 bg-muted rounded-lg', className)}>
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load PDF</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          {showCloudinaryHint && (
            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
              <p>
                Cloudinary raw PDFs often return 401 errors when the upload preset is not public.
                Administrators can update the Cloudinary upload preset to allow public access or
                generate authenticated URLs.
              </p>
              <p>Example authenticated delivery URL:</p>
              <p className="break-all">{formatCloudinaryAuthHint(src)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex flex-col bg-background border rounded-lg overflow-hidden',
        isFullscreen && 'fixed inset-0 z-50',
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium truncate max-w-[200px]">{title}</span>
          {!isLoading && (
            <span className="text-xs text-muted-foreground">
              ({numPages} pages)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Search */}
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => setShowSearch(!showSearch)}
            className="h-8 w-8"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Thumbnails */}
          <Button
            variant="ghost"
            size="iconSm"
            onClick={() => setShowThumbnails(!showThumbnails)}
            className="h-8 w-8"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 mx-2">
            <Button variant="ghost" size="iconSm" onClick={zoomOut} className="h-8 w-8">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="iconSm" onClick={zoomIn} className="h-8 w-8">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Rotate */}
          <Button variant="ghost" size="iconSm" onClick={rotate} className="h-8 w-8">
            <RotateCw className="h-4 w-4" />
          </Button>

          {/* Fullscreen */}
          <Button variant="ghost" size="iconSm" onClick={toggleFullscreen} className="h-8 w-8">
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          {/* Download */}
          {allowDownload && (
            <Button
              variant="ghost"
              size="iconSm"
              onClick={() => window.open(src, '_blank')}
              className="h-8 w-8"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b bg-muted/30 overflow-hidden"
          >
            <div className="p-2 flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search in document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pr-10"
                />
                <Button
                  variant="ghost"
                  size="iconSm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={handleSearch}
                >
                  <Search className="h-3 w-3" />
                </Button>
              </div>
              <Button variant="ghost" size="iconSm" onClick={() => setShowSearch(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {searchResults.length > 0 && (
              <ScrollArea className="max-h-32 px-2 pb-2">
                {searchResults.map((result) => (
                  <button
                    key={result.page}
                    onClick={() => {
                      goToPage(result.page);
                      setShowSearch(false);
                    }}
                    className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                  >
                    Page {result.page} ({result.matches} match{result.matches > 1 ? 'es' : ''})
                  </button>
                ))}
              </ScrollArea>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Thumbnails sidebar */}
        <AnimatePresence>
          {showThumbnails && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 150, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r bg-muted/20 overflow-hidden"
            >
              <ScrollArea className="h-full p-2">
                <div className="space-y-2">
                  {thumbnails.map((thumb) => (
                    <button
                      key={thumb.pageNum}
                      onClick={() => goToPage(thumb.pageNum)}
                      className={cn(
                        'w-full rounded border-2 overflow-hidden transition-colors',
                        currentPage === thumb.pageNum
                          ? 'border-primary'
                          : 'border-transparent hover:border-muted-foreground/30'
                      )}
                    >
                      <img
                        src={thumb.dataUrl}
                        alt={`Page ${thumb.pageNum}`}
                        className="w-full"
                      />
                      <span className="text-xs text-muted-foreground">{thumb.pageNum}</span>
                    </button>
                  ))}
                  {thumbnails.length === 0 && (
                    <div className="text-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-2 block">
                        Loading thumbnails...
                      </span>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PDF Canvas */}
        <div className="flex-1 overflow-auto flex items-center justify-center p-4 bg-muted/10">
          {isLoading ? (
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
              <p className="text-sm text-muted-foreground mt-4">Loading document...</p>
            </div>
          ) : (
            <div className="relative shadow-lg">
              <canvas ref={canvasRef} className="block max-w-full" />
              <div
                ref={textLayerRef}
                className="absolute top-0 left-0 pointer-events-none"
                style={{ mixBlendMode: 'multiply' }}
              />
              {isRenderingPage && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-t bg-muted/50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={numPages}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
            className="w-16 text-center h-8"
          />
          <span className="text-sm text-muted-foreground">of {numPages}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= numPages || isLoading}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Zoom slider for mobile */}
      <div className="px-4 py-2 border-t bg-muted/30 md:hidden">
        <div className="flex items-center gap-3">
          <ZoomOut className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[scale * 100]}
            onValueChange={([val]) => setScale(val / 100)}
            min={50}
            max={300}
            step={25}
            className="flex-1"
          />
          <ZoomIn className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
