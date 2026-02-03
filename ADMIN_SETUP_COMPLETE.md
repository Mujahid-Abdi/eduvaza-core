# Admin Setup - Complete Guide

## ✅ What's Been Fixed

### 1. Mock Authentication Works
- Admin can login with mock credentials
- Perfect for development and testing
- No Firebase setup required

### 2. Real Firebase Authentication Ready
- Auth service supports real Firebase
- Just need to create admin user in Firebase
- Switch with one environment variable

### 3. Auto-Redirect to Dashboard
- **Authenticated users** → Automatically go to their dashboard
- **Non-authenticated users** → See public pages
- **Admin** → Goes directly to `/admin` (not public pages)

---

## 🚀 Quick Start

### Option A: Mock Mode (Development)

**Already configured and working!**

1. **Login:**
   ```
   http://localhost:8081/auth/login
   ```

2. **Credentials:**
   - Email: `admin@eduvaza.com`
   - Password: `password` (any 6+ characters)

3. **Result:**
   - Redirects to `/admin`
   - Admin dashboard loads
   - Console shows: "🔧 DEV MODE: Using mock authentication"

### Option B: Real Firebase (Production)

1. **Create Admin User in Firebase:**
   
   **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/eduvaza-cfbec
   ```

   **Enable Authentication:**
   - Click "Authentication" → "Sign-in method"
   - Enable "Email/Password"
   - Save

   **Add Admin User:**
   - Go to "Authentication" → "Users"
   - Click "Add user"
   - Email: `admin@eduvaza.com`
   - Password: `Admin@123` (or your choice)
   - Click "Add user"
   - **Copy the UID** (you'll need it)

   **Set Admin Role in Firestore:**
   - Go to "Firestore Database"
   - Click "Start collection" (if first time)
   - Collection ID: `users`
   - Document ID: [paste the UID you copied]
   - Add these fields:
     ```
     id: [paste UID]
     email: admin@eduvaza.com
     name: Super Admin
     role: super_admin
     isActive: true
     createdAt: [click "timestamp" and select "now"]
     ```
   - Click "Save"

2. **Disable Mock Auth:**
   
   Edit `.env` file:
   ```env
   VITE_USE_MOCK_AUTH=false
   ```

3. **Restart Server:**
   ```bash
   npm run dev
   ```

4. **Login:**
   - Email: `admin@eduvaza.com`
   - Password: `Admin@123`
   - Should redirect to `/admin`

---

## 🔄 How Auto-Redirect Works

### For All Users:

**When visiting public pages (/, /courses, /about, /contact):**

| User Status | What Happens |
|-------------|--------------|
| **Not logged in** | Shows public page normally |
| **Logged in as Admin** | Redirects to `/admin` |
| **Logged in as School** | Redirects to `/school` |
| **Logged in as Teacher** | Redirects to `/teacher` |
| **Logged in as Student** | Redirects to `/student` |

**When visiting /quizzes:**
- Shows quiz page for everyone (logged in or not)
- Useful for all user types

### Example Flow:

1. **Admin logs in** → Redirects to `/admin`
2. **Admin tries to visit `/`** → Redirects back to `/admin`
3. **Admin tries to visit `/courses`** → Redirects back to `/admin`
4. **Admin can visit `/quizzes`** → Shows quiz page (useful for admins too)

---

## 🎯 Test Scenarios

### Scenario 1: Admin Login (Mock Mode)

```bash
# 1. Make sure mock auth is enabled
cat .env | grep MOCK
# Should show: VITE_USE_MOCK_AUTH=true

# 2. Go to login
http://localhost:8081/auth/login

# 3. Enter credentials
Email: admin@eduvaza.com
Password: password

# 4. Expected result
✅ Redirects to /admin
✅ Shows admin dashboard
✅ Console: "🔧 DEV MODE: Using mock authentication"
```

### Scenario 2: Admin Login (Real Firebase)

```bash
# 1. Create admin user in Firebase (see steps above)

# 2. Disable mock auth
# Edit .env: VITE_USE_MOCK_AUTH=false

# 3. Restart server
npm run dev

# 4. Go to login
http://localhost:8081/auth/login

# 5. Enter credentials
Email: admin@eduvaza.com
Password: Admin@123

# 6. Expected result
✅ Redirects to /admin
✅ Shows admin dashboard
✅ No mock mode message in console
```

### Scenario 3: Admin Accessing Public Pages

```bash
# 1. Login as admin (either mode)

# 2. Try to visit home page
http://localhost:8081/

# Expected result
✅ Automatically redirects to /admin

# 3. Try to visit courses page
http://localhost:8081/courses

# Expected result
✅ Automatically redirects to /admin

# 4. Try to visit quizzes page
http://localhost:8081/quizzes

# Expected result
✅ Shows quiz page (allowed for all users)
```

---

## 🔐 All Test Users

### Mock Mode Users:

| Role | Email | Password | Dashboard |
|------|-------|----------|-----------|
| Super Admin | `admin@eduvaza.com` | any 6+ chars | `/admin` |
| School | `school@greenvalley.edu` | any 6+ chars | `/school` |
| Teacher | `teacher@eduvaza.com` | any 6+ chars | `/teacher` |
| Student | `student@eduvaza.com` | any 6+ chars | `/student` |

### Real Firebase Users:

You need to create these in Firebase Console following the same steps as admin user creation.

---

## 🛠️ Switching Between Modes

### Development (Mock Auth):
```env
VITE_USE_MOCK_AUTH=true
```
- ✅ No Firebase setup needed
- ✅ Instant testing
- ✅ All roles available
- ✅ Perfect for development

### Production (Real Firebase):
```env
VITE_USE_MOCK_AUTH=false
```
- ✅ Real authentication
- ✅ Secure
- ✅ Database persistence
- ✅ Production ready

**Always restart server after changing .env!**

---

## 📋 Firestore Security Rules

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Allow users to read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Allow admins to read all users
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
      
      // Allow user creation during registration
      allow create: if request.auth != null;
      
      // Allow users to update their own data
      allow update: if request.auth != null && request.auth.uid == userId;
      
      // Allow admins to update any user
      allow update: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // Schools collection
    match /schools/{schoolId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'super_admin';
    }
    
    // Courses collection
    match /courses/{courseId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🐛 Troubleshooting

### Admin Dashboard Not Loading?

**Check 1: Mock Mode**
```bash
# Verify .env setting
cat .env | grep MOCK

# Should show: VITE_USE_MOCK_AUTH=true (for mock mode)
# Or: VITE_USE_MOCK_AUTH=false (for real Firebase)
```

**Check 2: Server Restart**
```bash
# After changing .env, always restart
npm run dev
```

**Check 3: Browser Console**
```
Open DevTools (F12) → Console tab
Look for errors or "🔧 DEV MODE" message
```

**Check 4: Network Tab**
```
Open DevTools (F12) → Network tab
Check for failed requests
```

### Redirecting to Wrong Dashboard?

**Check user role:**
```javascript
// In browser console after login:
JSON.parse(localStorage.getItem('mockUser'))?.role

// Should show: "super_admin" for admin
```

### Firebase Authentication Not Working?

**Check 1: Email/Password Enabled**
- Firebase Console → Authentication → Sign-in method
- Email/Password should be enabled

**Check 2: User Exists**
- Firebase Console → Authentication → Users
- Should see admin@eduvaza.com

**Check 3: Firestore Document**
- Firebase Console → Firestore Database
- Collection: users
- Should have document with role: super_admin

**Check 4: Security Rules**
- Firebase Console → Firestore Database → Rules
- Should allow reading user documents

---

## ✅ Current Status

### What's Working:

✅ Mock authentication for all roles
✅ Admin dashboard loads correctly
✅ Auto-redirect to dashboard for authenticated users
✅ Public pages accessible for non-authenticated users
✅ Quiz page accessible for all users
✅ Real Firebase authentication ready (just need to create users)

### What You Need to Do:

For **Development/Testing:**
- ✅ Nothing! Mock mode is ready to use

For **Production:**
1. Create admin user in Firebase (see steps above)
2. Set `VITE_USE_MOCK_AUTH=false` in `.env`
3. Restart server
4. Test login with real credentials

---

## 🎉 Summary

**Mock Mode (Current):**
- Login: `admin@eduvaza.com` / `password`
- Works immediately
- Perfect for testing

**Real Firebase (Production):**
- Create admin user in Firebase Console
- Login: `admin@eduvaza.com` / `Admin@123`
- Secure and production-ready

**Auto-Redirect:**
- Admin always goes to `/admin`
- Never sees public pages (except /quizzes)
- Direct access to dashboard

---

**Everything is ready! Login with `admin@eduvaza.com` to test!** 🚀
