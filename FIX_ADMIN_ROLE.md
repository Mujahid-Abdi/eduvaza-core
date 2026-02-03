# 🔧 Fix Admin Dashboard Access Issue

## Problem
User `mujahidudin3@gmail.com` can login but admin dashboard doesn't open.

## Root Cause
The user's role in Firestore is likely **NOT** set to `'super_admin'` (the exact value required).

## ✅ Solution - 3 Steps

### Step 1: Check Current Role

1. **Login** with `mujahidudin3@gmail.com`
2. After login, you'll see a **yellow/green box** in the bottom-right corner
3. This box shows:
   - ✅ **Green box** = Role is correct (`super_admin`)
   - ⚠️ **Yellow box** = Role is wrong (needs to be fixed)

The box will show:
- Current Role: `[what it is now]`
- Expected Role: `super_admin`

### Step 2: Fix the Role in Firestore

#### Option A: Firebase Console (Easiest)

1. Go to: https://console.firebase.google.com
2. Select project: **eduvaza-cfbec**
3. Click **Firestore Database** in left menu
4. Click **users** collection
5. Find the document where `email = mujahidudin3@gmail.com`
6. Click on that document
7. Find the `role` field
8. Click **Edit** (pencil icon)
9. Change the value to exactly: `super_admin` (lowercase, with underscore)
10. Click **Update**

#### Option B: Using Code

Create a file `fix-admin.js` in the `eduvaza-core` folder:

```javascript
// fix-admin.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCydwG5JY1dajuUvRgvnjq2kLpxwLj8mk0",
  authDomain: "eduvaza-cfbec.firebaseapp.com",
  projectId: "eduvaza-cfbec",
  storageBucket: "eduvaza-cfbec.firebasestorage.app",
  messagingSenderId: "48704181755",
  appId: "1:48704181755:web:2eafa407710e3e3fcea75e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixAdminRole() {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', 'mujahidudin3@gmail.com'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('❌ User not found in Firestore!');
      console.log('You may need to create the user document first.');
      return;
    }
    
    for (const doc of snapshot.docs) {
      console.log('📄 Found user document');
      console.log('Current data:', doc.data());
      console.log('Current role:', doc.data().role);
      
      await updateDoc(doc.ref, { role: 'super_admin' });
      
      console.log('✅ Updated role to: super_admin');
      console.log('Please logout and login again to see changes.');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixAdminRole();
```

Then run:
```bash
cd eduvaza-core
node fix-admin.js
```

### Step 3: Test the Fix

1. **Logout** from the app
2. **Clear browser cache**: 
   - Chrome: Ctrl+Shift+Delete → Clear cached images and files
   - Or use Incognito/Private mode
3. **Login again** with `mujahidudin3@gmail.com`
4. You should:
   - See a **green box** in bottom-right (role is correct)
   - Be **automatically redirected** to `/admin`
   - See the **admin dashboard** load correctly

## 🔍 Debugging

### Check Browser Console

Open browser console (F12) and look for these messages:

**Good (Working):**
```
🔥 Firebase User Data: {...}
🔥 User Role: super_admin
ProtectedRoute - User Role: super_admin
ProtectedRoute - Allowed Roles: ['super_admin']
```

**Bad (Not Working):**
```
🔥 User Role: admin          ← Wrong! Should be 'super_admin'
🔥 User Role: undefined      ← Missing! Need to add role field
🔥 User Role: student        ← Wrong role! Need to change it
```

### Common Issues

| Issue | Solution |
|-------|----------|
| Role is `'admin'` | Change to `'super_admin'` in Firestore |
| Role is `undefined` | Add `role: 'super_admin'` field in Firestore |
| Role is `'student'` or `'teacher'` | Change to `'super_admin'` in Firestore |
| User document doesn't exist | Create user document in Firestore |
| Still not working | Check Firestore security rules |

### Firestore Security Rules

Make sure your `firestore.rules` allows users to read their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📝 Valid Role Values

Only these exact values work:

- ✅ `super_admin` - Admin dashboard
- ✅ `school` - School dashboard
- ✅ `teacher` - Teacher dashboard
- ✅ `student` - Student dashboard

**Invalid values** (won't work):
- ❌ `admin` (missing 'super_')
- ❌ `Admin` (wrong casing)
- ❌ `SUPER_ADMIN` (wrong casing)
- ❌ `super admin` (space instead of underscore)

## 🎯 Expected Result

After fixing the role, when you login with `mujahidudin3@gmail.com`:

1. ✅ Green box appears in bottom-right showing `super_admin` role
2. ✅ Automatically redirected to `/admin`
3. ✅ Admin dashboard loads with 6 tabs
4. ✅ Can see: Overview, Schools, Users, Courses, Quizzes, Reports

## 🆘 Still Not Working?

If it still doesn't work after fixing the role:

1. **Check console logs** - Look for error messages
2. **Try incognito mode** - Rules out cache issues
3. **Check Firestore** - Verify the role was actually updated
4. **Check Firebase Auth** - Make sure user is authenticated
5. **Share console logs** - Send the console output for help

---

**Next Step**: Login and check the colored box in bottom-right corner! 🎯
