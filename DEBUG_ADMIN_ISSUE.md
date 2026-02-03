# 🔍 Debug Admin Dashboard Issue

## Problem
User `mujahidudin3@gmail.com` can login but admin dashboard doesn't open correctly.

## Debugging Steps

### Step 1: Check Browser Console
1. Open browser (F12)
2. Go to Console tab
3. Login with `mujahidudin3@gmail.com`
4. Look for these debug messages:

```
🔥 Firebase User Data: {...}
🔥 User Role: [what role is shown here?]
ProtectedRoute - User: {...}
ProtectedRoute - User Role: [what role is shown here?]
ProtectedRoute - Allowed Roles: ['super_admin']
```

### Step 2: Check User Role in Firestore

The issue is likely that the user's role in Firestore is NOT `'super_admin'`.

**Possible Issues:**
1. Role is `'admin'` instead of `'super_admin'`
2. Role field doesn't exist in Firestore document
3. Role has extra spaces or different casing

### Step 3: Fix the Role in Firestore

#### Option A: Using Firebase Console
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `eduvaza-cfbec`
3. Go to Firestore Database
4. Find collection: `users`
5. Find document with email: `mujahidudin3@gmail.com`
6. Check the `role` field
7. If it's not `'super_admin'`, edit it to be exactly: `super_admin`

#### Option B: Using Firebase CLI
```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login
firebase login

# Use Firestore
firebase firestore:update users/{userId} --data '{"role":"super_admin"}'
```

### Step 4: Common Role Issues

**Valid Role**: `super_admin` (exactly this, lowercase with underscore)

**Invalid Roles** (won't work):
- `admin` ❌
- `Admin` ❌
- `ADMIN` ❌
- `super admin` ❌ (space instead of underscore)
- `superadmin` ❌ (no underscore)
- `super_Admin` ❌ (wrong casing)

### Step 5: Verify User Document Structure

The user document in Firestore should look like this:

```json
{
  "id": "firebase-user-id",
  "email": "mujahidudin3@gmail.com",
  "name": "User Name",
  "role": "super_admin",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

### Step 6: Quick Fix Script

If you have Firebase Admin SDK access, you can run this script:

```javascript
// fix-admin-role.js
const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore();

async function fixAdminRole() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', 'mujahidudin3@gmail.com').get();
  
  if (snapshot.empty) {
    console.log('User not found in Firestore!');
    return;
  }
  
  snapshot.forEach(async (doc) => {
    console.log('Current role:', doc.data().role);
    await doc.ref.update({ role: 'super_admin' });
    console.log('Updated role to: super_admin');
  });
}

fixAdminRole();
```

## Expected Console Output (When Working)

```
🔥 Firebase User Data: {
  id: "abc123...",
  email: "mujahidudin3@gmail.com",
  name: "Mujahid Uddin",
  role: "super_admin",
  ...
}
🔥 User Role: super_admin
ProtectedRoute - User: {...}
ProtectedRoute - User Role: super_admin
ProtectedRoute - Allowed Roles: ['super_admin']
ProtectedRoute - Role Check: false
```

## What to Look For

1. **If role is `undefined`**: User document doesn't have a role field
2. **If role is `'admin'`**: Need to change it to `'super_admin'`
3. **If role is `'student'` or other**: User was registered with wrong role
4. **If user document doesn't exist**: Need to create it in Firestore

## Quick Test After Fix

1. Logout
2. Clear browser cache (Ctrl+Shift+Delete)
3. Login again with `mujahidudin3@gmail.com`
4. Should auto-redirect to `/admin`
5. Dashboard should load correctly

## Still Not Working?

Check these:
1. Browser console for JavaScript errors
2. Network tab for failed API calls
3. Firebase rules - make sure user can read their own document
4. Try incognito/private browsing mode

---

**Next Step**: Check browser console and report what role is shown!
