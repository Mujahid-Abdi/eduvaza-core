# PDF Viewer & Video Player Troubleshooting Guide

## Overview
The PDF viewer and video player components are implemented but may have runtime issues. This guide helps identify and fix common problems without changing the system architecture.

## Common Issues & Solutions

### PDF Viewer Issues

#### Issue 1: PDF Not Loading
**Symptoms**: PDF viewer shows loading spinner indefinitely or error message

**Possible Causes**:
1. **CORS Issues**: PDF hosted on different domain without CORS headers
2. **Invalid URL**: PDF URL is incorrect or inaccessible
3. **Worker Not Loading**: PDF.js worker script not loading

**Solutions**:

```typescript
// Check 1: Verify PDF URL is accessible
console.log('PDF URL:', pdfUrl);
// Try opening URL directly in browser

// Check 2: CORS Headers
// PDF must be served with proper CORS headers:
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET

// Check 3: Worker Configuration
// In PDFViewer.tsx, the worker is set to:
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// Alternative worker sources:
// Option 1: Use CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Option 2: Use local worker (copy to public folder)
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
```

#### Issue 2: PDF Renders Blurry
**Symptoms**: PDF text appears blurry or pixelated

**Solution**:
```typescript
// Increase scale for better quality
const scale = 1.5; // Default is 1.0

// Or use device pixel ratio
const scale = window.devicePixelRatio || 1;
```

#### Issue 3: Text Selection Not Working
**Symptoms**: Cannot select/copy text from PDF

**Solution**:
```typescript
// Ensure allowCopy prop is true
<PDFViewer
  src={pdfUrl}
  allowCopy={true}  // Enable text selection
/>

// Check text layer is rendering
// In PDFViewer.tsx, verify textLayerRef is populated
```

#### Issue 4: Thumbnails Not Generating
**Symptoms**: Thumbnail sidebar shows loading spinner

**Solution**:
```typescript
// Thumbnails generate lazily when sidebar opens
// Check browser console for errors

// Reduce thumbnail count for large PDFs
const maxThumbnails = 20; // Limit to first 20 pages

// Increase thumbnail scale if too small
const thumbnailScale = 0.3; // Default is 0.2
```

### Video Player Issues

#### Issue 1: Video Not Playing
**Symptoms**: Video shows error or doesn't start

**Possible Causes**:
1. **Unsupported Format**: Browser doesn't support video codec
2. **CORS Issues**: Video hosted on different domain
3. **Invalid URL**: Video URL is incorrect

**Solutions**:

```typescript
// Check 1: Verify video format
// Supported formats: MP4 (H.264), WebM, OGG
// Best compatibility: MP4 with H.264 codec

// Check 2: Test video URL
console.log('Video URL:', videoUrl);
// Try opening URL directly in browser

// Check 3: Add multiple sources for fallback
<video>
  <source src={videoUrl} type="video/mp4" />
  <source src={videoUrlWebm} type="video/webm" />
  Your browser doesn't support video playback.
</video>

// Check 4: CORS headers required
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

#### Issue 2: Video Buffering Issues
**Symptoms**: Video constantly buffering or stuttering

**Solutions**:
```typescript
// 1. Check video file size
// Recommended: < 500MB for smooth streaming

// 2. Use adaptive streaming (HLS/DASH)
// For large videos, consider using:
// - Cloudinary video streaming
// - AWS CloudFront
// - YouTube/Vimeo embed

// 3. Preload strategy
<video preload="metadata"> // Load only metadata
<video preload="auto">     // Load entire video
<video preload="none">     // Don't preload
```

#### Issue 3: Controls Not Showing
**Symptoms**: Video controls disappear or don't appear

**Solutions**:
```typescript
// Check showControls state
const [showControls, setShowControls] = useState(true);

// Ensure mouse move triggers controls
onMouseMove={showControlsTemporarily}

// Disable auto-hide for debugging
// Comment out the timeout in showControlsTemporarily
```

#### Issue 4: Fullscreen Not Working
**Symptoms**: Fullscreen button doesn't work

**Solutions**:
```typescript
// Check browser support
if (document.fullscreenEnabled) {
  // Fullscreen is supported
}

// Try different fullscreen APIs
// Webkit (Safari)
if (element.webkitRequestFullscreen) {
  element.webkitRequestFullscreen();
}

// Mozilla (Firefox)
if (element.mozRequestFullScreen) {
  element.mozRequestFullScreen();
}
```

### Cloudinary Integration Issues

#### Issue 1: Cloudinary URLs Not Working
**Symptoms**: Videos/PDFs from Cloudinary don't load

**Solutions**:
```typescript
// Check 1: Verify Cloudinary URL format
// Correct format:
https://res.cloudinary.com/[cloud_name]/[resource_type]/upload/[public_id]

// Check 2: Ensure resource is public
// In Cloudinary dashboard, check resource permissions

// Check 3: Use secure URLs (HTTPS)
const secureUrl = cloudinaryUrl.replace('http://', 'https://');

// Check 4: Add transformation for optimization
// For videos:
https://res.cloudinary.com/[cloud]/video/upload/q_auto/[id].mp4

// For PDFs:
https://res.cloudinary.com/[cloud]/image/upload/fl_attachment/[id].pdf
```

#### Issue 2: Large File Upload Failures
**Symptoms**: Upload fails for large files

**Solutions**:
```typescript
// Check file size limits
const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
const MAX_PDF_SIZE = 10 * 1024 * 1024;    // 10MB

// Use chunked upload for large files
const uploadOptions = {
  chunk_size: 6000000, // 6MB chunks
  resource_type: 'video',
};

// Increase timeout
const uploadOptions = {
  timeout: 120000, // 2 minutes
};
```

## Testing Checklist

### PDF Viewer Testing
```bash
# 1. Test with sample PDF
- [ ] Upload a small PDF (< 1MB)
- [ ] Verify PDF loads and displays
- [ ] Test page navigation (next/previous)
- [ ] Test zoom in/out
- [ ] Test rotation
- [ ] Test fullscreen
- [ ] Test text selection (if enabled)
- [ ] Test search functionality
- [ ] Test thumbnail generation
- [ ] Test download (if enabled)

# 2. Test with large PDF
- [ ] Upload a large PDF (> 10MB)
- [ ] Verify loading performance
- [ ] Check memory usage
- [ ] Test thumbnail generation

# 3. Test edge cases
- [ ] Test with password-protected PDF
- [ ] Test with corrupted PDF
- [ ] Test with invalid URL
- [ ] Test with CORS-blocked PDF
```

### Video Player Testing
```bash
# 1. Test with sample video
- [ ] Upload a small video (< 50MB)
- [ ] Verify video loads and plays
- [ ] Test play/pause
- [ ] Test volume control
- [ ] Test mute/unmute
- [ ] Test seek/scrub
- [ ] Test fullscreen
- [ ] Test Picture-in-Picture
- [ ] Test playback speed
- [ ] Test keyboard shortcuts
- [ ] Test download (if enabled)

# 2. Test with large video
- [ ] Upload a large video (> 100MB)
- [ ] Verify buffering behavior
- [ ] Check playback smoothness
- [ ] Test on slow connection

# 3. Test different formats
- [ ] Test MP4 video
- [ ] Test WebM video
- [ ] Test with subtitles
- [ ] Test with different resolutions
```

## Browser Console Debugging

### Enable Detailed Logging
```typescript
// In PDFViewer.tsx
useEffect(() => {
  console.log('PDF Loading:', src);
  console.log('PDF.js version:', pdfjsLib.version);
  console.log('Worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc);
}, [src]);

// In VideoPlayer.tsx
useEffect(() => {
  console.log('Video Loading:', src);
  console.log('Video element:', videoRef.current);
  console.log('Can play type:', videoRef.current?.canPlayType('video/mp4'));
}, [src]);
```

### Common Console Errors

#### Error: "Failed to load PDF"
```
Solution: Check PDF URL and CORS headers
```

#### Error: "Setting up fake worker failed"
```
Solution: Worker script not loading
Fix: Update worker source URL
```

#### Error: "The media could not be loaded"
```
Solution: Video format not supported or CORS issue
Fix: Check video codec and CORS headers
```

#### Error: "Uncaught (in promise) DOMException"
```
Solution: Fullscreen/PiP not allowed
Fix: User interaction required before fullscreen
```

## Performance Optimization

### PDF Viewer Optimization
```typescript
// 1. Lazy load pages
// Only render current page, not all pages

// 2. Reduce thumbnail quality
const thumbnailScale = 0.15; // Lower quality, faster generation

// 3. Limit thumbnail count
const maxThumbnails = 10; // Only first 10 pages

// 4. Debounce rendering
// Add delay before re-rendering on zoom/rotate

// 5. Use web workers for text extraction
// Offload text processing to worker thread
```

### Video Player Optimization
```typescript
// 1. Use appropriate preload strategy
<video preload="metadata" /> // Best for most cases

// 2. Implement adaptive bitrate streaming
// Use HLS or DASH for large videos

// 3. Lazy load video
// Don't load video until user clicks play

// 4. Optimize video encoding
// Use H.264 codec with appropriate bitrate

// 5. Add poster image
<video poster={thumbnailUrl} />
```

## Environment Variables

Ensure these are set in `.env`:

```bash
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

# Optional: CDN URLs
VITE_PDF_WORKER_URL=https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js
```

## Quick Fixes

### Fix 1: PDF Worker Not Loading
```typescript
// In PDFViewer.tsx, line 30
// Change from:
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

// To:
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
```

### Fix 2: Video CORS Error
```typescript
// Add crossOrigin attribute
<video
  ref={videoRef}
  src={src}
  crossOrigin="anonymous"  // Add this
  poster={poster}
/>
```

### Fix 3: PDF Text Layer Not Rendering
```typescript
// Ensure text layer div exists
<div
  ref={textLayerRef}
  className="absolute top-0 left-0 pointer-events-auto" // Change from none
  style={{ mixBlendMode: 'multiply' }}
/>
```

### Fix 4: Video Controls Disappearing Too Fast
```typescript
// Increase timeout duration
controlsTimeoutRef.current = setTimeout(() => {
  setShowControls(false);
}, 5000); // Change from 3000 to 5000
```

## Support & Resources

### PDF.js Documentation
- https://mozilla.github.io/pdf.js/
- https://github.com/mozilla/pdf.js

### HTML5 Video API
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

### Cloudinary Documentation
- https://cloudinary.com/documentation
- https://cloudinary.com/documentation/video_manipulation_and_delivery

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Console error messages
3. Network tab showing failed requests
4. File type and size
5. URL being accessed
6. Steps to reproduce

## Conclusion

The PDF viewer and video player are fully implemented with:
- ✅ PDF rendering with PDF.js
- ✅ Video playback with HTML5
- ✅ Custom controls
- ✅ Fullscreen support
- ✅ Keyboard shortcuts
- ✅ Progress tracking
- ✅ Download support

Most issues are related to:
- CORS configuration
- File format compatibility
- Network/CDN issues
- Browser compatibility

Follow this guide to identify and fix specific issues without changing the system architecture.
