# Quiz System Troubleshooting Guide 🔧

## Issue: Mock Quizzes Still Showing

If you're seeing mock quizzes instead of real Firebase data, follow this guide.

---

## ✅ Verification Checklist

### 1. Check Firebase Configuration

Open browser console (F12) and look for:
```
🔥 Firebase User Data: Object
🔥 User Role: teacher
```

If you see Firebase errors instead, your `.env` is not configured correctly.

### 2. Check Quiz Service

Open browser console and look for:
```
Fetched quizzes: []
```
or
```
Fetched quizzes: [Array of quiz objects]
```

This confirms the page is calling Firebase, not using mock data.

### 3. Verify No Mock Imports

Check that these files DON'T import `mockQuizzes`:

**❌ Bad (using mock data):**
```typescript
import { mockQuizzes } from '@/services/mockQuizData';
const quizzes = mockQuizzes; // Wrong!
```

**✅ Good (using Firebase):**
```typescript
import { quizService } from '@/services/quizzes';
const quizzes = await quizService.getQuizzes(); // Correct!
```

---

## 🔍 How to Check Each Page

### Public Quiz Page (`/quizzes`)

1. Open: `http://localhost:8080/quizzes`
2. Open browser console (F12)
3. Look for: `Fetched quizzes: []` or `Fetched quizzes: [...]`
4. If you see an empty array `[]`, that's correct! (No quizzes created yet)
5. If you see mock data, the page is not using Firebase

**Expected Behavior:**
- Empty state: "No quizzes found" message
- Loading state: Spinner while fetching
- With data: Real quizzes from Firebase

### Teacher Quiz Page (`/teacher/quizzes`)

1. Login as teacher
2. Go to: `http://localhost:8080/teacher/quizzes`
3. Open browser console
4. Look for: `Fetched quizzes: []`
5. Should show: "No quizzes yet. Create your first quiz!"

**Expected Behavior:**
- Empty state with "Create Quiz" button
- No mock quizzes visible
- Tabs work (All, Published, Drafts)

### School Quiz Page (`/school/quizzes`)

1. Login as school admin
2. Go to: `http://localhost:8080/school/quizzes`
3. Check console for Firebase calls
4. Should show empty state

### Admin Quiz Page (`/admin/manage-quizzes`)

1. Login as super admin
2. Go to: `http://localhost:8080/admin/manage-quizzes`
3. Should show all quizzes from all users
4. Empty if no quizzes exist

---

## 🐛 Common Issues & Fixes

### Issue 1: Still Seeing Mock Quizzes

**Symptoms:**
- "Algebra Basics Quiz" appears
- "Science: Ecosystems" appears
- Quizzes you didn't create

**Fix:**
1. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
2. Clear browser cache
3. Check browser console for `mockQuizzes` references
4. Verify files are using `quizService.getQuizzes()`

### Issue 2: Empty Page, No Loading State

**Symptoms:**
- Blank page
- No spinner
- No error messages

**Fix:**
1. Check browser console for errors
2. Verify Firebase is initialized
3. Check network tab for Firestore requests
4. Ensure `loading` state is working

### Issue 3: Firebase Errors

**Symptoms:**
```
FirebaseError: Missing or insufficient permissions
```

**Fix:**
1. Check Firestore rules (see below)
2. Verify user is authenticated
3. Check user has correct role

### Issue 4: Quizzes Not Saving

**Symptoms:**
- "Quiz created successfully!" toast appears
- But quiz doesn't show in list
- Console shows errors

**Fix:**
1. Check Firestore rules allow writes
2. Verify user is authenticated
3. Check browser console for errors
4. Verify `teacherId` is being set correctly

---

## 🔥 Firestore Rules Check

Go to Firebase Console → Firestore Database → Rules

**Correct Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to published quizzes
    match /quizzes/{quizId} {
      allow read: if resource.data.isPublished == true || 
                     request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to manage their data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**Test Rules:**
1. Go to Firestore → Rules tab
2. Click "Rules Playground"
3. Test read/write operations
4. Verify permissions work

---

## 🧪 Testing Steps

### Step 1: Verify Empty State
1. Clear all quizzes from Firestore (if any exist)
2. Refresh page
3. Should see: "No quizzes found" or "No quizzes yet"
4. Should NOT see mock quizzes

### Step 2: Create First Quiz
1. Login as teacher
2. Go to Teacher → Quizzes
3. Click "Create Quiz"
4. Fill in details:
   - Title: "Test Quiz"
   - Description: "Testing Firebase"
   - Add 1 question
   - Toggle "Publish Quiz" ON
5. Save
6. Should see success toast
7. Quiz should appear in list

### Step 3: Verify on Public Page
1. Go to `/quizzes`
2. Should see "Test Quiz"
3. Should NOT see mock quizzes
4. Filter should work

### Step 4: Check Firestore
1. Go to Firebase Console
2. Firestore Database
3. Look for `quizzes` collection
4. Should see your "Test Quiz" document
5. Verify fields are correct

---

## 📊 Console Debugging

Add these console logs to verify:

**In QuizzesPage.tsx:**
```typescript
useEffect(() => {
  const fetchQuizzes = async () => {
    console.log('🔍 Fetching quizzes from Firebase...');
    const fetchedQuizzes = await quizService.getQuizzes();
    console.log('✅ Fetched quizzes:', fetchedQuizzes);
    setQuizzes(fetchedQuizzes);
  };
  fetchQuizzes();
}, []);
```

**Expected Console Output:**
```
🔍 Fetching quizzes from Firebase...
✅ Fetched quizzes: []
```
or
```
🔍 Fetching quizzes from Firebase...
✅ Fetched quizzes: [{id: "abc123", title: "Test Quiz", ...}]
```

---

## 🔄 Force Refresh Everything

If nothing works:

1. **Clear Browser Cache:**
   - Chrome: `Ctrl + Shift + Delete`
   - Select "Cached images and files"
   - Click "Clear data"

2. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Hard Refresh Page:**
   - `Ctrl + Shift + R` (Windows)
   - `Cmd + Shift + R` (Mac)

4. **Check Service Worker:**
   - Open DevTools → Application → Service Workers
   - Click "Unregister" if any exist
   - Refresh page

---

## ✅ Success Indicators

You'll know it's working when:

- [ ] No mock quizzes appear
- [ ] Empty state shows when no quizzes exist
- [ ] Console shows Firebase fetch calls
- [ ] Created quizzes appear immediately
- [ ] Published quizzes show on public page
- [ ] Draft quizzes hidden from public
- [ ] Firestore shows quiz documents
- [ ] No console errors

---

## 🆘 Still Having Issues?

1. Check all files are saved
2. Verify `.env` has correct Firebase credentials
3. Check Firestore rules are published
4. Verify user is authenticated
5. Check browser console for errors
6. Look at Network tab for failed requests
7. Check Firestore console for data

---

## 📝 Quick Verification Script

Run this in browser console:

```javascript
// Check if using Firebase
console.log('Firebase Config:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Check quiz service
import { quizService } from './src/services/quizzes';
const quizzes = await quizService.getQuizzes();
console.log('Quizzes from Firebase:', quizzes);
```

---

**Remember:** Mock data should NEVER appear if Firebase is properly configured! 🎯
