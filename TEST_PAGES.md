# Testing New Pages - Step by Step

## Prerequisites
1. Development server must be running: `npm run dev`
2. Browser open to: `http://localhost:8081`

## Test Scenario 1: Student Course Detail Page

### Step 1: Login as Student
1. Go to `http://localhost:8081/auth/login`
2. Enter student credentials
3. Should redirect to student dashboard

### Step 2: Navigate to Course Detail
**Option A: Click Course Card**
1. On student dashboard, find "My Courses" section
2. Click on any course card (e.g., "Mathematics 101")
3. Should navigate to `/student/course/course-1`

**Option B: Direct URL**
1. Manually navigate to: `http://localhost:8081/student/course/course-1`
2. Page should load immediately

### Step 3: Verify Course Detail Page
**Expected to see:**
- ✅ Course header with title and thumbnail
- ✅ Three tabs: About, Lessons, Contact
- ✅ Course badges (category, level, language)
- ✅ Enrollment statistics
- ✅ Progress bar (if enrolled)
- ✅ Back button at top

**Test Each Tab:**
1. **About Tab** (default):
   - Course description
   - "What You'll Learn" section with checkmarks
   - Course details cards (Level, Category, Language, Enrolled)
   
2. **Lessons Tab**:
   - List of lessons numbered 1, 2, 3...
   - Each lesson shows type badge (text/pdf/video)
   - Duration displayed
   - Checkmarks on completed lessons
   
3. **Contact Tab**:
   - Instructor name and avatar
   - Email address
   - Phone number
   - Office hours
   - "Send Message" button

## Test Scenario 2: Quiz Exploration Page

### Step 1: From Student Dashboard
1. Look for "Explore Quizzes" button (next to "Browse Courses")
2. Click the button
3. Should navigate to `/student/quiz-explore`

### Step 2: Direct Navigation
1. Go to: `http://localhost:8081/student/quiz-explore`

### Step 3: Verify Quiz Explore Page
**Expected to see:**
- ✅ Page title: "Explore Quizzes"
- ✅ Search bar with filter button
- ✅ "Featured Quizzes" section with 3 cards
- ✅ Tabs: All Quizzes, Popular, Recent
- ✅ Quick stats at bottom (Total Quizzes, Avg. Duration, Total Points)

**Test Features:**
1. **Search Bar**: Type to filter quizzes
2. **Featured Section**: Should show 3 quizzes with "Featured" badge
3. **All Quizzes Tab**: Grid of quiz cards
4. **Popular Tab**: Ranked list with #1, #2, #3...
5. **Recent Tab**: Recently added quizzes
6. **Quiz Cards**: Hover to see play button overlay

## Test Scenario 3: Teacher Course Detail Page

### Step 1: Login as Teacher
1. Go to `http://localhost:8081/auth/login`
2. Enter teacher credentials
3. Should redirect to teacher dashboard

### Step 2: Navigate to Courses
1. Go to `/teacher/courses`
2. Should see list of your courses

### Step 3: Click Course Card
1. Click on any course card
2. Should navigate to `/teacher/course/1` (or course ID)

### Step 4: Verify Teacher Course Detail
**Expected to see:**
- ✅ Course header with edit/delete buttons
- ✅ Four tabs: Overview, Lessons, Students, Analytics
- ✅ Course status badge (Published/Draft)
- ✅ Action buttons: Edit Course, Preview, Delete

**Test Each Tab:**
1. **Overview Tab**:
   - Course description
   - Course details cards
   
2. **Lessons Tab**:
   - "Add Lesson" button
   - List of lessons with edit/delete buttons
   
3. **Students Tab**:
   - Enrolled students count
   - Student list placeholder
   
4. **Analytics Tab**:
   - Three stat cards (Completion Rate, Avg. Progress, Active Students)
   - Analytics placeholder

## Common Test Results

### ✅ SUCCESS - Page Loads Correctly
- All content visible
- Tabs switch properly
- Navigation works
- No console errors

### ❌ BLANK PAGE
**Possible causes:**
1. Not logged in → Go to login page
2. Wrong role → Login with correct role (student/teacher)
3. JavaScript error → Check browser console (F12)

### ❌ 404 NOT FOUND
**Possible causes:**
1. Wrong URL → Check spelling
2. Route not configured → Verify App.tsx
3. Server not running → Run `npm run dev`

### ❌ LOADING FOREVER
**Possible causes:**
1. API call hanging → Check network tab
2. Infinite loop → Check browser console
3. Missing data → Verify mock data exists

## Quick Verification Checklist

### For Each Page, Verify:
- [ ] Page title displays
- [ ] Layout renders (header, sidebar, content)
- [ ] No console errors (F12 → Console tab)
- [ ] No 404 errors (F12 → Network tab)
- [ ] Tabs switch correctly
- [ ] Back button works
- [ ] Links are clickable
- [ ] Hover effects work
- [ ] Mobile responsive (resize browser)

## Browser Console Commands

### Check if pages are loaded:
```javascript
// Open browser console (F12) and run:
console.log('Current URL:', window.location.href);
console.log('React version:', React.version);
```

### Check for routing:
```javascript
// Should show current route
console.log('Current path:', window.location.pathname);
```

### Check authentication:
```javascript
// Should show user info if logged in
// (This depends on your auth implementation)
```

## Screenshots to Take

If pages aren't working, take screenshots of:
1. Browser URL bar
2. Full page view
3. Browser console (F12 → Console)
4. Network tab showing requests
5. React DevTools (if installed)

## Next Steps

If all tests pass: ✅ **Implementation successful!**

If tests fail:
1. Note which specific test failed
2. Check browser console for errors
3. Verify you're logged in with correct role
4. Try clearing browser cache
5. Restart dev server
6. Check TROUBLESHOOTING.md for solutions
