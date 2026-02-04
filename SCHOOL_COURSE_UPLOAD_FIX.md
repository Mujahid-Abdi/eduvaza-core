# School Course Upload Fix - Complete ✅

## Issue
Courses uploaded by school users appeared on the public course page but NOT on the school course page.

## Root Cause
In `CourseUploadDialog.tsx`, when creating a course, the `schoolId` field was set to:
```typescript
schoolId: user?.schoolId  // ❌ Wrong for school users
```

For school users, `user.schoolId` is undefined. The correct value should be `user.id`.

## The Fix

### File: `src/components/school/CourseUploadDialog.tsx`

**Before** (Line 353):
```typescript
schoolId: user?.schoolId,  // ❌ This was undefined for school users
```

**After**:
```typescript
schoolId: user?.role === 'school' ? user?.id : user?.schoolId,  // ✅ Correct
```

## How It Works Now

### For School Users
When a school user uploads a course:
1. `user.role` = 'school'
2. `schoolId` = `user.id` (the school's own user ID)
3. Course is saved with correct schoolId
4. Course appears in school course page

### For Teacher Users (if they upload)
When a teacher uploads a course:
1. `user.role` = 'teacher'
2. `schoolId` = `user.schoolId` (their school's ID)
3. Course is saved with their school's ID
4. Course appears in their school's course page

## Testing

### Test 1: Upload New Course
1. Login as school user
2. Go to `/school/courses`
3. Click "Upload Course"
4. Fill in all details
5. Upload PDF/video
6. Click "Save Course"
7. **Expected**: Course appears in the list immediately

### Test 2: Verify in Firebase
1. Go to Firebase Console → Firestore
2. Open `courses` collection
3. Find the newly created course
4. Check `schoolId` field
5. **Expected**: `schoolId` matches your user ID

### Test 3: Check Public Page
1. Logout or open incognito window
2. Go to `/courses` (public courses page)
3. **Expected**: Course appears here too

### Test 4: Check School Page
1. Login as school user
2. Go to `/school/courses`
3. **Expected**: Course appears in "All Courses" tab

## What About Existing Courses?

### Problem
Courses uploaded before this fix have `schoolId: undefined` in Firebase.

### Solution Options

#### Option 1: Re-upload Courses (Recommended)
1. Delete old courses from school course page
2. Upload them again
3. New courses will have correct schoolId

#### Option 2: Manual Fix in Firebase Console
1. Go to Firebase Console → Firestore
2. Open `courses` collection
3. For each course without schoolId:
   - Click on the document
   - Add field: `schoolId` = your user ID
   - Save

#### Option 3: Bulk Update Script (Advanced)
Create a script to update all courses:
```typescript
// Run this in Firebase Console or as a Cloud Function
const updateCourses = async () => {
  const coursesRef = collection(db, 'courses');
  const snapshot = await getDocs(coursesRef);
  
  snapshot.docs.forEach(async (doc) => {
    const data = doc.data();
    if (!data.schoolId && data.teacherId) {
      // Update with appropriate schoolId
      await updateDoc(doc.ref, {
        schoolId: 'YOUR_SCHOOL_USER_ID'
      });
    }
  });
};
```

## Debugging

### Check 1: Console Logs
When uploading a course, check browser console for:
```
Saving course to Firebase: {
  ...
  schoolId: "some-user-id",  // Should NOT be undefined
  ...
}
```

### Check 2: Firebase Document
After upload, check Firebase Console:
1. Firestore → courses → [new course]
2. Verify `schoolId` field exists and has a value

### Check 3: School Course Page
After upload:
1. Go to `/school/courses`
2. Course should appear immediately
3. If not, check browser console for errors

## Files Modified
- ✅ `src/components/school/CourseUploadDialog.tsx` - Fixed schoolId assignment

## TypeScript Status
- ✅ No TypeScript errors
- ✅ All types correct

## Related Fixes
This fix is related to:
- `SCHOOL_LOADING_FIX.md` - Fixed course loading logic
- Both fixes ensure school users can properly manage their courses

## Summary
The issue was a simple but critical bug: `schoolId` was set to `user.schoolId` (which is undefined for school users) instead of `user.id`. 

Now when school users upload courses:
- ✅ Course is saved with correct schoolId
- ✅ Course appears on school course page
- ✅ Course appears on public course page
- ✅ Course can be edited and deleted by school

**Action Required**: If you have existing courses that don't show up, you need to either re-upload them or manually fix the schoolId in Firebase Console.
