# Troubleshooting Guide - New Pages Not Displaying

## Quick Checklist

### 1. Are you logged in?
The new pages require authentication. Make sure you're logged in with the appropriate role:
- **Student pages** require student role
- **Teacher pages** require teacher role

### 2. Test URLs

#### For Students (login as student first):
```
http://localhost:8081/student/quiz-explore
http://localhost:8081/student/course/course-1
http://localhost:8081/student/course/course-2
```

#### For Teachers (login as teacher first):
```
http://localhost:8081/teacher/course/course-1
http://localhost:8081/teacher/courses
```

### 3. Check Browser Console
Open browser DevTools (F12) and check for:
- Red error messages in Console tab
- Failed network requests in Network tab
- React component errors

### 4. Verify Login Credentials

**Student Login:**
- Email: `student@eduvaza.com`
- Password: (your configured password)

**Teacher Login:**
- Email: `teacher@eduvaza.com`
- Password: (your configured password)

### 5. Clear Browser Cache
Sometimes cached files cause issues:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### 6. Check if Server is Running
```bash
npm run dev
```
Should show: `Local: http://localhost:8081/`

## Common Issues

### Issue 1: "Page Not Found" or Blank Page
**Solution:**
- Make sure you're logged in with the correct role
- Check the URL is correct
- Verify the route exists in App.tsx

### Issue 2: "Cannot read property of undefined"
**Solution:**
- The course ID might not exist in mock data
- Try using `course-1`, `course-2`, or `course-3`

### Issue 3: Navigation Not Working
**Solution:**
- Check if you clicked the course card on the dashboard
- Verify the Link component is properly imported
- Check browser console for routing errors

### Issue 4: Styles Not Loading
**Solution:**
- Restart the dev server
- Clear browser cache
- Check if Tailwind CSS is working on other pages

## Testing Steps

### Test Student Pages:

1. **Login as Student**
   ```
   Go to: http://localhost:8081/auth/login
   Use student credentials
   ```

2. **Go to Student Dashboard**
   ```
   Should redirect to: http://localhost:8081/student
   ```

3. **Click "Explore Quizzes" Button**
   ```
   Should navigate to: http://localhost:8081/student/quiz-explore
   ```

4. **Click on a Course Card**
   ```
   Should navigate to: http://localhost:8081/student/course/course-1
   ```

5. **Test Course Detail Tabs**
   - Click "About" tab - should show course description
   - Click "Lessons" tab - should show lesson list
   - Click "Contact" tab - should show instructor info

### Test Teacher Pages:

1. **Login as Teacher**
   ```
   Go to: http://localhost:8081/auth/login
   Use teacher credentials
   ```

2. **Go to Teacher Courses**
   ```
   Navigate to: http://localhost:8081/teacher/courses
   ```

3. **Click on a Course Card**
   ```
   Should navigate to: http://localhost:8081/teacher/course/1
   ```

4. **Test Course Detail Tabs**
   - Click "Overview" tab
   - Click "Lessons" tab
   - Click "Students" tab
   - Click "Analytics" tab

## Debugging Commands

### Check for TypeScript Errors
```bash
npx tsc --noEmit
```

### Check for Build Errors
```bash
npm run build
```

### View All Routes
Check `src/App.tsx` lines 48-72 for all defined routes

## Still Not Working?

### Check These Files:
1. `src/App.tsx` - Routes configuration
2. `src/pages/student/StudentDashboard.tsx` - Link implementation
3. `src/pages/student/CourseDetailPage.tsx` - Course detail page
4. `src/pages/student/QuizExplorePage.tsx` - Quiz explore page
5. `src/pages/teacher/TeacherCourseDetailPage.tsx` - Teacher course detail

### Verify Imports:
All pages should import:
- `DashboardLayout` from `@/components/layout/DashboardLayout`
- `useParams` and `useNavigate` from `react-router-dom`
- Mock data from `@/services/mockData`

### Check Mock Data:
Verify mock courses exist:
```typescript
// In browser console (after logging in):
import { mockCourses } from '@/services/mockData';
console.log(mockCourses);
```

## Expected Behavior

### Student Dashboard:
- Should see "Explore Quizzes" button (new)
- Course cards should be clickable (updated)
- Clicking course card navigates to detail page

### Course Detail Page:
- Shows course header with thumbnail
- Has 3 tabs: About, Lessons, Contact
- Back button returns to previous page
- All tabs should load content

### Quiz Explore Page:
- Shows search bar
- Displays featured quizzes
- Has tabs: All Quizzes, Popular, Recent
- Quiz cards are clickable

### Teacher Course Detail:
- Shows course management interface
- Has 4 tabs: Overview, Lessons, Students, Analytics
- Edit/Delete buttons visible
- Back button works

## Contact for Help

If pages still aren't displaying:
1. Check browser console for specific error messages
2. Verify you're on the correct URL
3. Ensure you're logged in with the right role
4. Try a different browser
5. Restart the development server
