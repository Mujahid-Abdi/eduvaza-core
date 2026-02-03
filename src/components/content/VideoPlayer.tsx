import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  Loader2,
  AlertCircle,
  Download,
  PictureInPicture,
  Subtitles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  allowDownload?: boolean;
  autoPlay?: boolean;
  onProgress?: (currentTime: number, duration: number) => void;
  onComplete?: () => void;
  startTime?: number;
  className?: string;
  subtitles?: {
    src: string;
    label: string;
    srclang: string;
    default?: boolean;
  }[];
}

interface PlaybackRate {
  label: string;
  value: number;
}

const playbackRates: PlaybackRate[] = [
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: 'Normal', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
];

const qualityOptions = ['Auto', '1080p', '720p', '480p', '360p'];

export const VideoPlayer = ({
  src,
  poster,
  title,
  allowDownload = false,
  autoPlay = false,
  onProgress,
  onComplete,
  startTime = 0,
  className,
  subtitles = [],
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [isPiP, setIsPiP] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Format time to MM:SS or HH:MM:SS
  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  // Handle volume change
  const handleVolumeChange = useCallback((value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0];
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + seconds));
  }, [duration]);

  // Seek to position
  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, newTime));
  }, [duration]);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Toggle Picture-in-Picture
  const togglePiP = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  }, []);

  // Change playback rate
  const handlePlaybackRateChange = useCallback((rate: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  // Show/hide controls
  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      if (startTime > 0) {
        video.currentTime = startTime;
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onProgress?.(video.currentTime, video.duration);
    };

    const handleProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => setError('Failed to load video');

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [onProgress, onComplete, startTime]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'ArrowUp':
          handleVolumeChange([Math.min(1, volume + 0.1)]);
          break;
        case 'ArrowDown':
          handleVolumeChange([Math.max(0, volume - 0.1)]);
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skip, toggleMute, toggleFullscreen, handleVolumeChange, volume]);

  // PiP change listener
  useEffect(() => {
    const handlePiPChange = () => {
      setIsPiP(!!document.pictureInPictureElement);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('enterpictureinpicture', handlePiPChange);
      video.addEventListener('leavepictureinpicture', handlePiPChange);
    }

    return () => {
      if (video) {
        video.removeEventListener('enterpictureinpicture', handlePiPChange);
        video.removeEventListener('leavepictureinpicture', handlePiPChange);
      }
    };
  }, []);

  if (error) {
    return (
      <div className={cn('flex items-center justify-center h-64 bg-muted rounded-lg', className)}>
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Video Error</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden group',
        isFullscreen && 'fixed inset-0 z-50 rounded-none',
        className
      )}
      onMouseMove={showControlsTemporarily}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        playsInline
      >
        {subtitles.map((sub, index) => (
          <track
            key={index}
            kind="subtitles"
            src={sub.src}
            srcLang={sub.srclang}
            label={sub.label}
            default={sub.default}
          />
        ))}
      </video>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <Loader2 className="h-12 w-12 animate-spin text-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center play button */}
      <AnimatePresence>
        {!isPlaying && !isLoading && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg hover:bg-primary transition-colors">
              <Play className="h-10 w-10 text-primary-foreground ml-1" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Title */}
      <AnimatePresence>
        {showControls && title && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent"
          >
            <h3 className="text-white font-semibold truncate">{title}</h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4"
          >
            {/* Progress bar */}
            <div
              ref={progressRef}
              onClick={handleSeek}
              className="w-full h-1 bg-white/30 rounded-full cursor-pointer mb-4 relative group/progress"
            >
              {/* Buffered */}
              <div
                className="absolute top-0 left-0 h-full bg-white/50 rounded-full"
                style={{ width: `${(buffered / duration) * 100}%` }}
              />
              {/* Progress */}
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              {/* Scrubber */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"
                style={{ left: `calc(${(currentTime / duration) * 100}% - 6px)` }}
              />
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between gap-4">
              {/* Left controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={togglePlay}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => skip(-10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={() => skip(10)}
                  className="text-white hover:bg-white/20"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                {/* Volume */}
                <div className="flex items-center gap-2 group/volume">
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  <div className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      max={1}
                      step={0.1}
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Time */}
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2">
                {/* Subtitles */}
                {subtitles.length > 0 && (
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => setShowSubtitles(!showSubtitles)}
                    className={cn(
                      'text-white hover:bg-white/20',
                      showSubtitles && 'bg-white/20'
                    )}
                  >
                    <Subtitles className="h-4 w-4" />
                  </Button>
                )}

                {/* Settings */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      className="text-white hover:bg-white/20"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                    {playbackRates.map((rate) => (
                      <DropdownMenuItem
                        key={rate.value}
                        onClick={() => handlePlaybackRateChange(rate.value)}
                        className={cn(playbackRate === rate.value && 'bg-accent')}
                      >
                        {rate.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Quality</DropdownMenuLabel>
                    {qualityOptions.map((q) => (
                      <DropdownMenuItem
                        key={q}
                        onClick={() => setQuality(q)}
                        className={cn(quality === q && 'bg-accent')}
                      >
                        {q}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* PiP */}
                {document.pictureInPictureEnabled && (
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={togglePiP}
                    className={cn(
                      'text-white hover:bg-white/20',
                      isPiP && 'bg-white/20'
                    )}
                  >
                    <PictureInPicture className="h-4 w-4" />
                  </Button>
                )}

                {/* Download */}
                {allowDownload && (
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => window.open(src, '_blank')}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}

                {/* Fullscreen */}
                <Button
                  variant="ghost"
                  size="iconSm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? (
                    <Minimize className="h-4 w-4" />
                  ) : (
                    <Maximize className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoPlayer;
