# Course Upload Dialog Improvements - Complete

## Overview
Enhanced the course upload dialog with teacher selection for school users and improved spacing for better UX.

## Changes Made

### 1. Teacher Selection for School Users
**File:** `src/components/school/CourseUploadDialog.tsx`

#### Added Features:
- **Teacher Dropdown**: School users can now select a teacher by name and email
- **Teacher List**: Fetches teachers from the school using `usersService.getTeachersBySchool()`
- **Teacher Preview**: Shows selected teacher's name and email after selection
- **Validation**: Requires teacher selection before course upload

#### Implementation:
```typescript
// Added state for teachers
const [teachers, setTeachers] = useState<User[]>([]);
const [selectedTeacher, setSelectedTeacher] = useState<User | null>(null);

// Fetch teachers when dialog opens (for school users)
useEffect(() => {
  const fetchTeachers = async () => {
    if (open && user?.role === 'school' && user?.schoolId) {
      const schoolTeachers = await usersService.getTeachersBySchool(user.schoolId);
      setTeachers(schoolTeachers);
    }
  };
  fetchTeachers();
}, [open, user?.role, user?.schoolId]);
```

#### UI Changes:
**For School Users:**
```tsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a teacher for this course" />
  </SelectTrigger>
  <SelectContent>
    {teachers.map((teacher) => (
      <SelectItem key={teacher.id} value={teacher.id}>
        <div className="flex flex-col">
          <span className="font-medium">{teacher.name}</span>
          <span className="text-xs text-muted-foreground">{teacher.email}</span>
        </div>
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

**For Teacher Users:**
- Automatically assigns current user as teacher
- Shows current user's name and email
- No dropdown needed

### 2. Fixed Spacing Issues

#### Cover Image Section:
**Before:**
```tsx
<Input type="file" />
{formData.coverImageFile && <Preview />}
{loading && <Progress />}
<p>Recommended: 1280x720px, Max 5MB</p>  // Overlapped with input
```

**After:**
```tsx
<Input type="file" />
<p className="text-xs text-muted-foreground mt-2">
  Recommended: 1280x720px, Max 5MB (JPG, PNG, WEBP)
</p>
{formData.coverImageFile && <Preview />}
{loading && <Progress />}
```

#### Video Upload Section:
**Before:**
```tsx
<Input type="file" />
{formData.videoFile && <Preview />}
{loading && <Progress />}
<p>Max 500MB • Formats: MP4, WebM, OGG, MOV</p>  // Overlapped
```

**After:**
```tsx
<Input type="file" />
<p className="text-xs text-muted-foreground mt-2">
  Max 500MB • Formats: MP4, WebM, OGG, MOV
</p>
{formData.videoFile && <Preview />}
{loading && <Progress />}
```

#### PDF Upload Section:
**Before:**
```tsx
<Input type="file" />
{formData.pdfFile && <Preview />}
{loading && <Progress />}
<p>Max 10MB • Format: PDF only</p>  // Overlapped
```

**After:**
```tsx
<Input type="file" />
<p className="text-xs text-muted-foreground mt-2">
  Max 10MB • Format: PDF only
</p>
{formData.pdfFile && <Preview />}
{loading && <Progress />}
```

### 3. Course Data Assignment

Updated course data to use selected teacher for school users:

```typescript
const courseData: Omit<Course, 'id'> = {
  // ... other fields
  teacherId: user?.role === 'school' 
    ? (selectedTeacher?.id || '') 
    : (user?.id || ''),
  teacherName: user?.role === 'school' 
    ? (selectedTeacher?.name || 'Unknown Teacher') 
    : (user?.name || 'Unknown Teacher'),
  schoolId: user?.schoolId,
  // ... other fields
};
```

### 4. Form Validation

Added validation for teacher selection:

```typescript
const validateForm = () => {
  // ... other validations
  
  // Validate teacher selection for school users
  if (user?.role === 'school' && !selectedTeacher) {
    toast.error('Please select a teacher for this course');
    return false;
  }
  
  // ... other validations
};
```

### 5. Form Reset

Updated form reset to clear teacher selection:

```typescript
setFormData({ /* reset all fields */ });
setCourseParts([]);
setSelectedTeacher(null);  // Clear teacher selection
onCourseCreated?.();
```

## Visual Improvements

### Before:
```
[File Input]
[Preview/Progress immediately below]
Recommended text overlapping with preview
```

### After:
```
[File Input]

Recommended: 1280x720px, Max 5MB (JPG, PNG, WEBP)

[Preview if file selected]
[Progress if uploading]
```

## User Experience Flow

### For School Users:
1. Open course upload dialog
2. Fill in course details (title, description, category, etc.)
3. **Select teacher from dropdown** (shows name and email)
4. Upload cover image (with clear spacing)
5. Upload video/PDF (with clear spacing)
6. Submit course
7. Course is assigned to selected teacher

### For Teacher Users:
1. Open course upload dialog
2. Fill in course details
3. See own name/email (auto-assigned)
4. Upload cover image (with clear spacing)
5. Upload video/PDF (with clear spacing)
6. Submit course
7. Course is assigned to self

## Benefits

### Teacher Selection:
✅ School admins can assign courses to specific teachers
✅ Clear display of teacher name and email
✅ Validation ensures teacher is selected
✅ Proper attribution in course data

### Spacing Improvements:
✅ No more overlapping text
✅ Clear visual hierarchy
✅ Better readability
✅ Consistent spacing throughout
✅ Recommendation text appears before file preview
✅ Added `mt-2` margin for proper spacing

## Testing Checklist

### Teacher Selection (School Users):
- [ ] Login as school user
- [ ] Open course upload dialog
- [ ] Verify teacher dropdown appears
- [ ] Verify dropdown shows teachers with name and email
- [ ] Select a teacher
- [ ] Verify selected teacher preview appears
- [ ] Try to submit without selecting teacher → Should show error
- [ ] Select teacher and submit → Should succeed
- [ ] Verify course is assigned to selected teacher in Firebase

### Auto-Assignment (Teacher Users):
- [ ] Login as teacher user
- [ ] Open course upload dialog
- [ ] Verify own name/email is displayed
- [ ] Verify no dropdown appears
- [ ] Submit course
- [ ] Verify course is assigned to self in Firebase

### Spacing (All Users):
- [ ] Open course upload dialog
- [ ] Check cover image section
  - [ ] Verify recommendation text has space above it
  - [ ] Verify recommendation text doesn't overlap with input
  - [ ] Upload file and verify preview appears below recommendation
- [ ] Check video upload section
  - [ ] Verify format text has space above it
  - [ ] Verify text doesn't overlap with input
  - [ ] Upload file and verify preview appears below format text
- [ ] Check PDF upload section
  - [ ] Verify format text has space above it
  - [ ] Verify text doesn't overlap with input
  - [ ] Upload file and verify preview appears below format text

## Dependencies

### Services Used:
- `usersService.getTeachersBySchool(schoolId)` - Fetches teachers for dropdown
- `coursesService.createCourse(data)` - Creates course with assigned teacher
- `cloudinaryService` - Handles file uploads

### Types:
- `User` - For teacher data
- `Course` - For course data structure

## Summary

✅ **Teacher Selection** - School users can now assign courses to specific teachers by name and email
✅ **Spacing Fixed** - All recommendation messages now have proper vertical spacing (mt-2) and appear before file previews
✅ **Validation** - Ensures teacher is selected before course upload (for school users)
✅ **Auto-Assignment** - Teacher users are automatically assigned to their own courses
✅ **Better UX** - Clear visual hierarchy and no overlapping text
✅ **Consistent** - Same spacing pattern across all file upload sections

The course upload dialog now provides a better user experience with clear teacher assignment and proper spacing throughout the form.
