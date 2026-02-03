# Creating Admin User in Firebase

## Quick Setup - Create Admin User

### Option 1: Using Firebase Console (Recommended)

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/project/eduvaza-cfbec
   ```

2. **Enable Email/Password Authentication:**
   - Click "Authentication" in left sidebar
   - Click "Sign-in method" tab
   - Click "Email/Password"
   - Enable it and Save

3. **Create Admin User:**
   - Go to "Authentication" → "Users" tab
   - Click "Add user"
   - Email: `admin@eduvaza.com`
   - Password: `Admin@123` (or your choice)
   - Click "Add user"

4. **Set Admin Role in Firestore:**
   - Go to "Firestore Database" in left sidebar
   - Click "Start collection"
   - Collection ID: `users`
   - Document ID: (copy the UID from Authentication Users tab)
   - Add fields:
     ```
     id: [paste UID]
     email: admin@eduvaza.com
     name: Super Admin
     role: super_admin
     isActive: true
     createdAt: [timestamp - now]
     ```
   - Click "Save"

### Option 2: Using Registration Page

1. **Disable Mock Auth:**
   - Edit `.env` file
   - Set: `VITE_USE_MOCK_AUTH=false`
   - Restart dev server

2. **Go to Registration:**
   ```
   http://localhost:8081/auth/register
   ```

3. **Register Admin:**
   - Name: Super Admin
   - Email: admin@eduvaza.com
   - Password: Admin@123
   - Role: Super Admin
   - Click Register

4. **Update Role in Firestore:**
   - Go to Firebase Console → Firestore
   - Find the user document
   - Change `role` field to `super_admin`

### Option 3: Using Firebase CLI Script

Create a script to add admin user:

```javascript
// scripts/createAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function createAdmin() {
  try {
    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email: 'admin@eduvaza.com',
      password: 'Admin@123',
      displayName: 'Super Admin'
    });

    // Create user document in Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      id: userRecord.uid,
      email: 'admin@eduvaza.com',
      name: 'Super Admin',
      role: 'super_admin',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@eduvaza.com');
    console.log('Password: Admin@123');
    console.log('UID:', userRecord.uid);
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();
```

Run with:
```bash
node scripts/createAdmin.js
```

## Verify Admin User

1. **Check Authentication:**
   - Firebase Console → Authentication → Users
   - Should see `admin@eduvaza.com`

2. **Check Firestore:**
   - Firebase Console → Firestore Database
   - Collection: `users`
   - Should have document with `role: super_admin`

3. **Test Login:**
   - Go to: http://localhost:8081/auth/login
   - Email: admin@eduvaza.com
   - Password: Admin@123
   - Should redirect to /admin

## Firestore Security Rules

Make sure your Firestore rules allow reading user data:

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
    }
  }
}
```

## Troubleshooting

### "User not found" error:
- User not created in Firebase Authentication
- Go to Firebase Console → Authentication → Add user

### "Role not working" error:
- User document not in Firestore
- Or `role` field not set to `super_admin`
- Check Firestore Database → users collection

### "Permission denied" error:
- Firestore security rules too restrictive
- Update rules to allow user data reading

### Still using mock auth:
- Check `.env` file: `VITE_USE_MOCK_AUTH=false`
- Restart dev server after changing .env

## Quick Test

After creating admin user:

1. Set `.env`:
   ```
   VITE_USE_MOCK_AUTH=false
   ```

2. Restart server:
   ```bash
   npm run dev
   ```

3. Login:
   - Email: admin@eduvaza.com
   - Password: Admin@123

4. Should redirect to `/admin` dashboard

---

**Choose Option 1 (Firebase Console) for quickest setup!**
