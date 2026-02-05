# Quiz System Testing Guide

## Quick Test Steps

### 1. Clear Cache First! 🔄
Before testing, clear your browser cache:
- **Chrome/Edge**: `Ctrl+Shift+Delete` → Clear cached images and files
- **Or**: Hard refresh with `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### 2. Test Teacher Quiz Creation

1. **Login as Teacher**
   - Go to login page
   - Login with teacher credentials
   - You should be redirected to teacher dashboard

2. **Navigate to Quiz Page**
   - Click on "Quizzes" in the sidebar
   - You should see the quiz management page

3. **Create a New Quiz**
   - Click "Create Quiz" button
   - Fill in quiz details:
     - Title: "Test Quiz 1"
     - Description: "This is a test quiz"
     - Add at least 2 questions
     - Set difficulty (easy/medium/hard)
     - Toggle "Publish Quiz" ON
   - Click "Save Quiz"

4. **Verify Quiz Creation**
   - Check browser console for:
     ```
     🔍 Attempting to save quiz
     ✅ User authenticated: [user-id]
     📝 Creating quiz with data: [quiz-data]
     ✅ Quiz created with ID: [quiz-id]
     ```
   - You should see success toast: "Quiz created successfully!"
   - Quiz should appear in "All Quizzes" tab
   - Quiz should appear in "Published" tab

### 3. Test School Admin Quiz Creation

1. **Login as School Admin**
   - Logout from teacher account
   - Login with school admin credentials

2. **Create Quiz**
   - Navigate to School Dashboard → Quizzes
   - Click "Create Quiz"
   - Fill in quiz details
   - Toggle "Publish Quiz" ON
   - Save quiz

3. **Verify**
   - Quiz appears in school's quiz list
   - Check console for success messages

### 4. Test Admin Quiz Management

1. **Login as Admin**
   - Login with admin credentials
   - Navigate to Admin Dashboard

2. **View All Quizzes**
   - Go to "Manage Quizzes" page
   - You should see ALL quizzes (from all teachers and schools)
   - Both published and draft quizzes should be visible

3. **Create Admin Quiz**
   - Click "Create Quiz"
   - Fill in details
   - Save quiz

4. **Delete Quiz** (Optional)
   - Click delete button on any quiz
   - Confirm deletion
   - Quiz should be removed from list

### 5. Test Public Quiz Page

1. **Logout** (or open incognito window)

2. **Visit Public Quiz Page**
   - Go to `/quizzes` page
   - You should see ONLY published quizzes
   - Draft quizzes should NOT appear

3. **Test Filters**
   - Try difficulty filter (Easy/Medium/Hard)
   - Try language filter (English/French/Swahili/Arabic)
   - Try search (type quiz title)
   - Verify results update correctly

4. **Verify Quiz Display**
   - Each quiz card should show:
     - Title
     - Description
     - Number of questions
     - Total points
     - Difficulty badge
     - Language badge
     - Teacher name

### 6. Test Data Persistence

1. **Create a quiz as teacher**
2. **Logout**
3. **Login again**
4. **Verify quiz still exists**
5. **Check public page** - published quiz should be visible

## Console Logs to Look For

### ✅ Success Logs
```
🔍 Fetching teacher quizzes for user: [user-id]
✅ Fetched X teacher quizzes: [quiz-array]
🔍 Attempting to save quiz
✅ User authenticated: [user-id]
📝 Creating quiz with data: [quiz-data]
✅ Quiz created with ID: [quiz-id]
```

### ❌ Error Logs to Watch For
```
❌ No user ID available
❌ Error fetching quizzes: [error]
❌ Error saving quiz: [error]
⚠️ No user ID, skipping quiz fetch
```

## Expected Behavior

### Teacher/School Quiz Page
- ✅ Shows only quizzes created by that teacher/school
- ✅ "All Quizzes" tab shows all their quizzes
- ✅ "Published" tab shows only published quizzes
- ✅ "Drafts" tab shows only draft quizzes
- ✅ Loading spinner appears while fetching
- ✅ Empty state shows if no quizzes exist

### Admin Quiz Page
- ✅ Shows ALL quizzes from all users
- ✅ Can see both published and draft quizzes
- ✅ Can delete any quiz
- ✅ Stats cards show correct totals

### Public Quiz Page
- ✅ Shows ONLY published quizzes
- ✅ Draft quizzes are hidden
- ✅ Filters work correctly
- ✅ Search works correctly
- ✅ Shows quizzes from all teachers/schools

## Troubleshooting

### Problem: "User not authenticated" error

**Check:**
1. Are you logged in?
2. Check browser console for auth logs
3. Verify Firebase Authentication is enabled
4. Check `.env` file has correct Firebase credentials

**Solution:**
- Wait a few seconds for authentication to complete
- Refresh the page
- Clear cache and login again

### Problem: Quizzes not appearing

**Check:**
1. Browser console for errors
2. Network tab for Firebase requests
3. Firestore indexes are created
4. User has correct role

**Solution:**
- Check Firebase Console → Firestore → Indexes
- Verify security rules allow read/write
- Check user role in Firebase Authentication

### Problem: "Permission denied" error

**Check:**
1. Firestore security rules
2. User authentication status
3. User role

**Solution:**
- Update Firestore security rules to allow authenticated users
- Verify user is logged in
- Check user has correct role (teacher/school/admin)

### Problem: Old mock data still showing

**Solution:**
1. Clear browser cache completely
2. Hard refresh: `Ctrl+Shift+R`
3. Close and reopen browser
4. Check if you're looking at the right page

## Firebase Console Verification

### Check Firestore Data
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Look for `quizzes` collection
4. Verify your created quizzes are there
5. Check quiz fields:
   - `teacherId` should match your user ID
   - `isPublished` should be true/false
   - `createdAt` should be recent timestamp

### Check Authentication
1. Go to Firebase Console
2. Navigate to Authentication
3. Verify your user exists
4. Check user's custom claims (if any)

## Success Criteria

After testing, you should be able to:

- ✅ Create quizzes as teacher
- ✅ Create quizzes as school admin
- ✅ Create quizzes as admin
- ✅ See your quizzes in your dashboard
- ✅ See published quizzes on public page
- ✅ NOT see draft quizzes on public page
- ✅ Admin can see all quizzes
- ✅ Filters and search work
- ✅ Data persists after logout/login
- ✅ No mock data appears
- ✅ No console errors

## Common Issues

### Issue: Quiz created but not appearing
- **Cause**: Page not refreshing after creation
- **Fix**: The code already refreshes the list, but try manual refresh

### Issue: Published quiz not on public page
- **Cause**: `isPublished` might be false
- **Fix**: Check Firestore, verify `isPublished: true`

### Issue: Can't create quiz
- **Cause**: Authentication not complete
- **Fix**: Wait for auth to load, check console logs

## Next Steps After Testing

If all tests pass:
1. ✅ Quiz system is working correctly
2. ✅ Mock data has been removed
3. ✅ Firebase integration is complete
4. 🎉 Ready for production use!

If tests fail:
1. Check console logs for specific errors
2. Verify Firebase configuration
3. Check Firestore security rules
4. Review the troubleshooting section above

---

**Need Help?**
- Check browser console for detailed error messages
- Review `QUIZ_MOCK_DATA_REMOVAL_COMPLETE.md` for technical details
- Verify Firebase setup in `FIREBASE_SETUP_QUICK.md`
