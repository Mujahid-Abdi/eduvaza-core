# Course Upload Feature - Implementation Guide

## Overview
Schools can now upload courses with multiple parts/lessons, each containing either a video or document file with proper size validation.

## Features Implemented

### 1. Multi-Part Course Upload (Optional) ✅
- Schools can upload courses with or without parts/lessons
- **Parts are completely optional** - courses can be uploaded without any parts
- If parts are added:
  - Each part is automatically numbered (Part 1, Part 2, etc.)
  - Parts can be added or removed dynamically
  - Automatic renumbering when parts are removed
- If no parts are added:
  - Course is uploaded with just the basic information
  - Parts can be added later through the edit dialog

### 2. File Upload with Validation ✅

#### Video Files
- **Supported Formats**: MP4, WebM, OGG, QuickTime (MOV)
- **Maximum Size**: 500MB
- **Validation**: File type and size checked before upload
- **Icon**: Video icon displayed for video content

#### Document Files
- **Supported Formats**: PDF, DOC, DOCX
- **Maximum Size**: 10MB
- **Validation**: File type and size checked before upload
- **Icon**: Document icon displayed for document content

### 3. Course Part Structure
Each course part includes:
- **Part Number**: Automatically assigned and displayed
- **Title**: Required field for part name
- **Description**: Optional field for part details
- **Content Type**: Dropdown to select Video or Document
- **File Upload**: File input with type-specific validation
- **File Info**: Shows selected file name and size

### 4. Upload Progress Tracking ✅
- Visual progress bar for each file upload
- Percentage display during upload
- Loading state with spinner
- Disabled form during upload

### 5. Form Validation ✅
Validates:
- All required course information (title, description, category, teacher)
- **Parts are optional** - courses can be uploaded without parts
- If parts are added:
  - Each part must have a title
  - Each part must have a file uploaded
  - File size limits enforced
  - File type restrictions enforced

## User Interface

### Course Upload Dialog
```
┌─────────────────────────────────────────┐
│ Upload New Course                       │
├─────────────────────────────────────────┤
│ Course Title *                          │
│ [Input field]                           │
│                                         │
│ Description *                           │
│ [Textarea]                              │
│                                         │
│ Category * | Level *                    │
│ [Input]    | [Dropdown]                 │
│                                         │
│ Assign to Registered Teacher *          │
│ [Dropdown with teacher list]            │
│                                         │
│ Language                                │
│ [Dropdown: EN/FR/AR/SW]                 │
│                                         │
├─────────────────────────────────────────┤
│ Course Parts/Lessons (Optional) [+ Add] │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ No parts added. You can upload the  │ │
│ │ course without parts or click       │ │
│ │ "Add Part" to add lessons.          │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ OR (if parts are added):                │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Part 1                      [Delete]│ │
│ │ Part Title *                        │ │
│ │ [Input]                             │ │
│ │ Part Description                    │ │
│ │ [Textarea]                          │ │
│ │ Content Type *                      │ │
│ │ [Video (Max 500MB) ▼]               │ │
│ │ Upload Video *                      │ │
│ │ [File input]                        │ │
│ │ Selected: video.mp4 (245.5 MB)     │ │
│ │ [Progress bar: 75%]                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Part 2                      [Delete]│ │
│ │ ...                                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│              [Cancel] [Upload Course]   │
└─────────────────────────────────────────┘
```

## File Size Limits

| Content Type | Maximum Size | Formats Accepted |
|--------------|--------------|------------------|
| Video        | 500 MB       | MP4, WebM, OGG, MOV |
| Document     | 10 MB        | PDF, DOC, DOCX |

## Validation Messages

### Success Messages
- ✅ "File selected: [filename]"
- ✅ "Course uploaded successfully!"

### Error Messages
- ❌ "File size exceeds [limit]. Please select a smaller file."
- ❌ "Please select a valid [type] file"
- ❌ "Please fill in all required course information"
- ❌ "Please provide a title for Part [number]" (only if parts are added)
- ❌ "Please upload a file for Part [number]" (only if parts are added)

## Code Structure

### Components
1. **CourseUploadDialog.tsx** - Main upload dialog
2. **CourseEditDialog.tsx** - Edit existing courses with parts

### Key Functions

#### `addCoursePart()`
Creates a new course part with auto-incremented part number

#### `removeCoursePart(id)`
Removes a part and renumbers remaining parts

#### `updateCoursePart(id, updates)`
Updates specific fields of a course part

#### `handleFileSelect(partId, file, contentType)`
Validates and attaches file to a course part

#### `validateForm()`
Comprehensive validation before submission

#### `handleSubmit()`
Processes form submission and file uploads

## Data Structure

### Course Part Interface
```typescript
interface CoursePart {
  id: string;                    // Unique identifier
  partNumber: number;            // Display number (1, 2, 3...)
  title: string;                 // Part title
  description: string;           // Part description
  contentType: 'video' | 'document';  // Type of content
  file: File | null;             // Selected file
  fileUrl?: string;              // Uploaded file URL (from Cloudinary)
  uploadProgress: number;        // Upload progress (0-100)
}
```

### Course Data Structure
```typescript
{
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'en' | 'fr' | 'ar' | 'sw';
  assignedTeacher: string;
  schoolId: string;
  createdBy: string;
  createdAt: Date;
  enrolledCount: number;
  isPublished: boolean;
  parts: CoursePart[];
}
```

## Firebase Integration (TODO)

### Upload Process
1. Create course document in Firestore
2. For each course part:
   - Upload file to Cloudinary
   - Get file URL
   - Update progress
3. Save all file URLs to course document
4. Mark course as published

### Cloudinary Upload
```typescript
// Example upload to Cloudinary
const uploadToCloudinary = async (file: File, partNumber: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'eduvaza_uploads');
  formData.append('folder', `courses/${courseId}/part-${partNumber}`);
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  
  return response.json();
};
```

## Testing Checklist

- [ ] Upload course WITHOUT any parts (basic course info only)
- [ ] Upload course with single video part (< 500MB)
- [ ] Upload course with single document part (< 10MB)
- [ ] Upload course with multiple parts (mixed video/document)
- [ ] Test video file size validation (> 500MB should fail)
- [ ] Test document file size validation (> 10MB should fail)
- [ ] Test invalid file type rejection
- [ ] Test adding multiple parts
- [ ] Test removing parts (verify renumbering)
- [ ] Test form validation (missing required fields)
- [ ] Test upload progress display
- [ ] Edit course and add parts to a course that had none
- [ ] Edit course and remove all parts
- [ ] Test replacing files in edit mode
- [ ] Test with different file formats (MP4, PDF, DOCX, etc.)

## User Workflow

### Creating a New Course (Without Parts)
1. Click "Upload Course" button
2. Fill in course information (title, description, category, level, teacher)
3. Select language
4. Click "Upload Course" (without adding any parts)
5. Success message displayed

### Creating a New Course (With Parts)
1. Click "Upload Course" button
2. Fill in course information (title, description, category, level, teacher)
3. Click "Add Part" to create first course part
4. Enter part title and description
5. Select content type (Video or Document)
6. Choose file from computer
7. System validates file size and type
8. Repeat steps 3-7 for additional parts
9. Click "Upload Course"
10. System uploads all files with progress indication
11. Success message displayed

### Editing an Existing Course
1. Click "Edit" button on course card
2. Modify course information as needed
3. Add new parts or remove existing parts
4. Replace files if needed (optional)
5. Click "Update Course"
6. Changes saved with confirmation

## Best Practices

### For Schools
- Course parts are optional - you can upload a course without any parts
- If adding parts, keep video files under 500MB for faster uploads
- Use compressed video formats (MP4 recommended)
- Keep documents under 10MB
- Use PDF format for documents when possible
- Provide clear, descriptive titles for each part
- Number parts logically (Introduction, Lesson 1, Lesson 2, etc.)
- You can always add parts later by editing the course

### For Developers
- Always validate file size before upload
- Show upload progress for better UX
- Handle upload errors gracefully
- Store file URLs securely in Firestore
- Use Cloudinary folders to organize course files
- Implement retry logic for failed uploads
- Clean up orphaned files if course creation fails

## Future Enhancements

1. **Drag and Drop**: Allow reordering course parts
2. **Bulk Upload**: Upload multiple files at once
3. **Video Preview**: Show video thumbnail before upload
4. **Document Preview**: Preview PDF before upload
5. **Resume Upload**: Resume interrupted uploads
6. **Compression**: Auto-compress large videos
7. **Transcoding**: Convert videos to optimal format
8. **Subtitles**: Support for video subtitles/captions
9. **Quiz Integration**: Add quizzes to course parts
10. **Analytics**: Track which parts students complete

## Notes

- All file uploads use Cloudinary (not Firebase Storage)
- Mock data is used until Firebase integration is complete
- Upload progress simulation is implemented for testing
- File validation happens client-side before upload
- Server-side validation should also be implemented
- Consider implementing chunked uploads for large files
