# Download Tracking Implementation Guide

## Overview
This guide explains how to implement download tracking in lesson viewer pages so that downloads appear in the Student Downloads page.

## Quick Implementation

### Step 1: Import the Service
```typescript
import { coursesService } from '@/services/courses';
import { toast } from 'sonner';
```

### Step 2: Add Download Handler
```typescript
const handleDownload = async () => {
  if (!user?.id) {
    toast.error('Please login to download content');
    return;
  }

  try {
    // Track the download in Firebase
    await coursesService.trackDownload(
      user.id,                    // Current user ID
      lesson.id,                  // Lesson ID
      course.id,                  // Course ID
      lesson.title,               // Lesson title
      lesson.contentType,         // 'video' or 'document'
      lesson.videoUrl || lesson.pdfUrl, // File URL
      '25 MB'                     // File size (calculate or estimate)
    );

    // Trigger actual download
    const link = document.createElement('a');
    link.href = lesson.videoUrl || lesson.pdfUrl;
    link.download = lesson.title;
    link.click();

    toast.success('Download started and tracked!');
  } catch (error) {
    console.error('Error tracking download:', error);
    toast.error('Failed to track download');
  }
};
```

### Step 3: Add Download Button
```tsx
<Button onClick={handleDownload}>
  <Download className="h-4 w-4 mr-2" />
  Download for Offline
</Button>
```

## Complete Example: Lesson Viewer

```typescript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/content/VideoPlayer';
import { PDFViewer } from '@/components/content/PDFViewer';
import { coursesService } from '@/services/courses';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const LessonViewerPage = () => {
  const { courseId, lessonId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);

  // ... fetch course and lesson data ...

  const handleDownload = async () => {
    if (!user?.id || !lesson || !course) return;

    try {
      // Determine file size (you can calculate this or use a default)
      const fileSize = lesson.contentType === 'video' ? '50 MB' : '5 MB';

      // Track download
      await coursesService.trackDownload(
        user.id,
        lesson.id,
        course.id,
        lesson.title,
        lesson.contentType,
        lesson.videoUrl || lesson.pdfUrl,
        fileSize
      );

      // Trigger download
      const link = document.createElement('a');
      link.href = lesson.videoUrl || lesson.pdfUrl;
      link.download = `${lesson.title}.${lesson.contentType === 'video' ? 'mp4' : 'pdf'}`;
      link.click();

      toast.success('Download started!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to download');
    }
  };

  return (
    <div>
      {/* Content viewer */}
      {lesson?.contentType === 'video' ? (
        <VideoPlayer src={lesson.videoUrl} />
      ) : (
        <PDFViewer src={lesson.pdfUrl} />
      )}

      {/* Download button */}
      <Button onClick={handleDownload} className="mt-4">
        <Download className="h-4 w-4 mr-2" />
        Download for Offline
      </Button>
    </div>
  );
};
```

## Calculating File Size

### Option 1: Estimate Based on Content Type
```typescript
const estimateFileSize = (contentType: 'video' | 'document', duration?: number) => {
  if (contentType === 'video') {
    // Estimate: 1 minute = ~5 MB for standard quality
    const minutes = duration || 10;
    return `${Math.round(minutes * 5)} MB`;
  } else {
    // Documents are typically smaller
    return '2.5 MB';
  }
};
```

### Option 2: Fetch Actual File Size
```typescript
const getFileSize = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const bytes = parseInt(response.headers.get('content-length') || '0');
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return `${mb} MB`;
  } catch (error) {
    return 'Unknown';
  }
};

// Usage
const fileSize = await getFileSize(lesson.videoUrl);
```

## Firebase Security Rules

Add these rules to `firestore.rules`:

```javascript
match /downloads/{downloadId} {
  // Users can only read their own downloads
  allow read: if request.auth != null && 
              request.auth.uid == resource.data.userId;
  
  // Users can only create downloads for themselves
  allow create: if request.auth != null && 
                request.auth.uid == request.resource.data.userId;
  
  // Users can only delete their own downloads
  allow delete: if request.auth != null && 
                request.auth.uid == resource.data.userId;
  
  // No updates allowed (downloads are immutable)
  allow update: if false;
}
```

## Storage Quota Management

### Check User's Storage Usage
```typescript
const checkStorageQuota = async (userId: string): Promise<boolean> => {
  const downloads = await coursesService.getDownloads(userId);
  
  const totalMB = downloads.reduce((sum, download) => {
    const size = parseFloat(download.fileSize);
    const unit = download.fileSize.includes('GB') ? 1024 : 1;
    return sum + (size * unit);
  }, 0);

  const quotaMB = 10240; // 10 GB limit
  
  if (totalMB >= quotaMB) {
    toast.error('Storage quota exceeded. Please delete some downloads.');
    return false;
  }
  
  return true;
};

// Use before downloading
const handleDownload = async () => {
  const hasSpace = await checkStorageQuota(user.id);
  if (!hasSpace) return;
  
  // ... proceed with download ...
};
```

## Best Practices

1. **Always Track Downloads**: Call `trackDownload()` before or immediately after starting the download
2. **Provide Feedback**: Use toast notifications to inform users
3. **Handle Errors**: Wrap in try-catch and show error messages
4. **Check Authentication**: Verify user is logged in before allowing downloads
5. **Validate URLs**: Ensure file URLs are valid before downloading
6. **Respect Quotas**: Check storage limits before allowing new downloads
7. **Clean Up**: Provide easy way for users to delete old downloads

## Testing

Test the download tracking with these scenarios:

1. ✅ Download a video lesson
2. ✅ Download a PDF document
3. ✅ Check downloads appear in Student Downloads page
4. ✅ Delete a download from the downloads page
5. ✅ Try downloading without authentication
6. ✅ Verify storage calculation is accurate
7. ✅ Test with multiple downloads from same course
8. ✅ Test with downloads from different courses

## Troubleshooting

### Downloads Not Appearing
- Check user is authenticated
- Verify `trackDownload()` is called successfully
- Check Firebase console for download records
- Ensure userId matches authenticated user

### File Size Shows as "Unknown"
- Implement proper file size calculation
- Use HEAD request to fetch actual size
- Or estimate based on content type and duration

### Storage Quota Issues
- Implement quota checking before downloads
- Provide clear feedback when quota is exceeded
- Allow users to delete old downloads easily

## Summary

The download tracking system is now fully integrated. To use it:

1. Import `coursesService` in your lesson viewer
2. Call `trackDownload()` when user downloads content
3. Downloads automatically appear in Student Downloads page
4. Users can view, play, and delete their downloads

All data is stored in Firebase and properly secured with authentication rules.
