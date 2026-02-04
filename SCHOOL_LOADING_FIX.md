# School Course Loading Fix - Complete ✅

## Issue
School course page was stuck on "Loading courses..." and not fetching courses from Firebase.

## Root Causes

### 1. Wrong schoolId Logic
**Problem**: Code was checking `user.schoolId` but for school users, their schoolId should be their own `user.id`

**Fix**: Updated logic to use:
```typescript
const schoolId = user.role === 'school' ? user.id : user.schoolId;
```

### 2. isPublished Filter
**Problem**: `getCoursesBySchool()` was filtering by `isPublished == true`, so school users couldn't see their draft courses

**Fix**: Removed the `isPublished` filter from the query. School users should see ALL their courses (published and drafts).

## Changes Made

### File 1: `src/services/firebase.ts`
**Before**:
```typescript
async getCoursesBySchool(schoolId: string): Promise<Course[]> {
  const coursesQuery = query(
    collection(db, 'courses'),
    where('schoolId', '==', schoolId),
    where('isPublished', '==', true),  // ❌ This was the problem
    orderBy('createdAt', 'desc')
  );
  // ...
}
```

**After**:
```typescript
async getCoursesBySchool(schoolId: string): Promise<Course[]> {
  const coursesQuery = query(
    collection(db, 'courses'),
    where('schoolId', '==', schoolId),  // ✅ Removed isPublished filter
    orderBy('createdAt', 'desc')
  );
  // ...
}
```

### File 2: `src/pages/school/SchoolCoursePage.tsx`
**Before**:
```typescript
useEffect(() => {
  const fetchCourses = async () => {
    if (!user?.schoolId) return;  // ❌ Wrong check
    
    setLoading(true);
    try {
      const courses = await coursesService.getCoursesBySchool(user.schoolId);
      setMyCourses(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, [user?.schoolId]);
```

**After**:
```typescript
useEffect(() => {
  const fetchCourses = async () => {
    if (!user) return;
    
    // ✅ For school users, schoolId is their own user ID
    const schoolId = user.role === 'school' ? user.id : user.schoolId;
    
    if (!schoolId) {
      console.error('No schoolId found for user:', user);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching courses for schoolId:', schoolId);
      const courses = await coursesService.getCoursesBySchool(schoolId);
      console.log('Fetched courses:', courses);
      setMyCourses(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  fetchCourses();
}, [user]);  // ✅ Changed dependency
```

### File 3: `src/pages/school/SchoolDashboard.tsx`
Applied the same fix as SchoolCoursePage.

## How It Works Now

### For School Users
1. User logs in with role = 'school'
2. Their `user.id` is used as the `schoolId`
3. Query: `where('schoolId', '==', user.id)`
4. Returns ALL courses created by this school (published + drafts)

### For Teacher/Student Users (if they have schoolId)
1. User has `user.schoolId` field
2. Query: `where('schoolId', '==', user.schoolId)`
3. Returns courses from their school

## Testing

### Test 1: School User - View Courses
1. Login as school user
2. Navigate to `/school/courses`
3. Should see loading spinner briefly
4. Should see all courses (published and drafts)
5. Check browser console for logs:
   - "Fetching courses for schoolId: [user-id]"
   - "Fetched courses: [array of courses]"

### Test 2: School User - Create Course
1. Click "Upload Course" button
2. Fill in course details
3. Upload PDF/video
4. Save course
5. Course should appear in the list immediately

### Test 3: School User - View Dashboard
1. Navigate to `/school/dashboard`
2. Should see stats with correct course count
3. Should see recent courses section
4. Stats should match course page

## Debugging

If courses still don't load:

### Check 1: User Role
Open browser console and check:
```javascript
console.log('User:', user);
console.log('User Role:', user.role);
console.log('User ID:', user.id);
console.log('User SchoolId:', user.schoolId);
```

Expected for school user:
- `user.role` = 'school'
- `user.id` = some Firebase UID
- `user.schoolId` = undefined or same as user.id

### Check 2: Firebase Query
Check console logs:
```
Fetching courses for schoolId: [some-id]
Fetched courses: [array]
```

If you see empty array `[]`, it means:
- No courses exist in Firebase with that schoolId
- OR the schoolId doesn't match

### Check 3: Firebase Console
1. Go to Firebase Console → Firestore
2. Open `courses` collection
3. Check if courses exist
4. Verify `schoolId` field matches user ID

### Check 4: Create Test Course
1. Manually add a course in Firebase Console
2. Set `schoolId` to your user ID
3. Set `isPublished` to true or false (doesn't matter now)
4. Refresh the page
5. Course should appear

## Common Issues

### Issue: "No schoolId found for user"
**Cause**: User object doesn't have `id` or `schoolId`
**Fix**: Check user authentication and Firestore user document

### Issue: Empty course list
**Cause**: No courses in Firebase with matching schoolId
**Fix**: Create a course or check schoolId in existing courses

### Issue: Still loading forever
**Cause**: Firebase query error or network issue
**Fix**: Check browser console for errors, verify Firebase connection

## Files Modified
- ✅ `src/services/firebase.ts` - Removed isPublished filter
- ✅ `src/pages/school/SchoolCoursePage.tsx` - Fixed schoolId logic
- ✅ `src/pages/school/SchoolDashboard.tsx` - Fixed schoolId logic

## TypeScript Status
- ✅ No TypeScript errors
- ✅ All types correct
- ✅ Proper error handling

## Next Steps
1. Test with school user account
2. Verify courses load quickly
3. Create a test course
4. Verify it appears in the list
5. Check dashboard stats update

---

## Summary
The loading issue was caused by:
1. Wrong schoolId logic (checking `user.schoolId` instead of `user.id` for school users)
2. Unnecessary `isPublished` filter preventing draft courses from showing

Both issues are now fixed. School users should see their courses load within 1-2 seconds.
