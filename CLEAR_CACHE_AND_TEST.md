# Clear Cache and Test Quiz System 🔄

## Issue: Mock Quizzes Still Showing

If you're still seeing mock quizzes, it's likely a **browser cache** or **service worker** issue.

---

## 🔄 Step 1: Clear Everything

### A. Clear Browser Cache (IMPORTANT!)

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select:
   - ✅ Cached images and files
   - ✅ Cookies and other site data
3. Time range: **All time**
4. Click **"Clear data"**

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Select:
   - ✅ Cache
   - ✅ Cookies
3. Time range: **Everything**
4. Click **"Clear Now"**

### B. Unregister Service Workers

1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Service Workers** in left sidebar
4. Click **"Unregister"** for all service workers
5. Close DevTools

### C. Hard Refresh

After clearing cache:
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`
- Or: `Ctrl + F5`

---

## 🔄 Step 2: Restart Dev Server

1. Stop the server: `Ctrl + C`
2. Clear terminal
3. Restart: `npm run dev`
4. Wait for "ready" message

---

## 🔍 Step 3: Verify in Browser Console

1. Open the page: `http://localhost:8080/school/quizzes`
2. Open DevTools (F12)
3. Go to **Console** tab
4. Look for these messages:

### ✅ Good (Using Firebase):
```
🔍 Fetching school quizzes for user: abc123...
✅ Fetched 0 school quizzes: []
```
or
```
🔍 Fetching school quizzes for user: abc123...
✅ Fetched 2 school quizzes: [{...}, {...}]
```

### ❌ Bad (Still cached):
- No console messages
- Old mock quiz data showing
- No Firebase requests in Network tab

---

## 🔍 Step 4: Check Network Tab

1. Open DevTools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for requests to:
   - `firestore.googleapis.com`
   - `firebase.googleapis.com`

### ✅ Good:
- You see Firebase/Firestore requests
- Status: 200 OK

### ❌ Bad:
- No Firebase requests
- All requests from cache (disk cache)

---

## 🧪 Step 5: Test Quiz Creation

### On School Dashboard:

1. Go to: `http://localhost:8080/school/quizzes`
2. Click **"Create Quiz"**
3. Fill in:
   ```
   Title: "School Test Quiz"
   Description: "Testing from school dashboard"
   Quiz Type: Practice Quiz
   Language: English
   Difficulty: Medium
   ```
4. Add one question (any type)
5. Toggle **"Publish Quiz"** to **ON**
6. Click **"Save Quiz"**

### Expected Results:

**Console should show:**
```
Quiz created with ID: abc123xyz
✅ Fetched 1 school quizzes: [{title: "School Test Quiz", ...}]
```

**Page should show:**
- Success toast: "Quiz created successfully!"
- Quiz appears in the list immediately
- Badge shows "Published"

**Firestore should have:**
- Go to Firebase Console → Firestore
- Collection: `quizzes`
- Document with title: "School Test Quiz"

---

## 🔍 Step 6: Check Public Page

1. Go to: `http://localhost:8080/quizzes`
2. Open Console (F12)
3. Look for:
   ```
   🔍 Fetching published quizzes from Firebase...
   ✅ Fetched 1 published quizzes
   ```
4. Your "School Test Quiz" should appear

---

## 🐛 Still Seeing Mock Quizzes?

### Check 1: Verify No Mock Imports

Open these files and search for `mockQuizzes`:
- `src/pages/school/SchoolQuizPage.tsx`
- `src/pages/QuizzesPage.tsx`

**Should NOT find:**
```typescript
import { mockQuizzes } from '@/services/mockQuizData';
const quizzes = mockQuizzes;
```

### Check 2: Verify Service Worker is Gone

1. DevTools → Application → Service Workers
2. Should show: "No service workers"
3. If any exist, unregister them

### Check 3: Try Incognito/Private Mode

1. Open incognito window
2. Go to: `http://localhost:8080/school/quizzes`
3. Login
4. Check if mock quizzes still appear

If they DON'T appear in incognito:
- ✅ Code is correct
- ❌ Your regular browser has cached data

**Solution:** Clear cache again, more thoroughly

### Check 4: Check Firestore Console

1. Go to: https://console.firebase.google.com/project/eduvaza-cfbec/firestore
2. Look for collection: `quizzes`
3. Check what documents exist

**If you see mock quizzes in Firestore:**
- Someone created them manually
- Delete them from Firestore console

**If Firestore is empty:**
- No quizzes created yet
- Create one to test

---

## 🔄 Nuclear Option: Complete Reset

If nothing works:

### 1. Clear Everything
```bash
# Stop server
Ctrl + C

# Clear node modules cache
npm cache clean --force

# Reinstall
npm install
```

### 2. Clear Browser Completely
- Close ALL browser windows
- Reopen browser
- Clear cache again
- Open DevTools BEFORE loading page

### 3. Restart Server
```bash
npm run dev
```

### 4. Test in Fresh Incognito Window
- Open incognito
- Go to app
- Login
- Test quiz creation

---

## ✅ Success Checklist

After clearing cache, you should see:

- [ ] Console shows Firebase fetch messages
- [ ] Network tab shows Firestore requests
- [ ] No mock quizzes appear
- [ ] Empty state shows "No quizzes yet"
- [ ] Created quizzes appear immediately
- [ ] Published quizzes show on public page
- [ ] Firestore console shows quiz documents

---

## 📊 Debug Commands

Run these in browser console:

```javascript
// Check if quizzes state is empty
console.log('Current quizzes:', quizzes);

// Check if using Firebase
console.log('Firebase Project:', import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Check user
console.log('Current user:', user);

// Force refresh quizzes
window.location.reload();
```

---

## 🆘 Still Not Working?

1. **Take a screenshot** of:
   - Browser console
   - Network tab
   - The page showing mock quizzes

2. **Check Firestore** console:
   - Are there quiz documents?
   - What do they contain?

3. **Verify** `.env` file:
   - Firebase credentials correct?
   - No typos?

4. **Check** user authentication:
   - Are you logged in?
   - What's your user ID?
   - What's your role?

---

**Most Common Fix:** Clear browser cache + unregister service workers + hard refresh! 🔄
