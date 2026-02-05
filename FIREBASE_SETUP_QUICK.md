# Firebase Setup - Quick Guide 🔥

## Current Issue
Your `.env` file has placeholder Firebase credentials. You need to add your actual Firebase project credentials.

## Quick Setup Steps

### 1. Get Firebase Credentials

1. Go to: https://console.firebase.google.com/
2. Select your project (or create new one)
3. Click **⚙️ (Settings)** → **Project settings**
4. Scroll to **"Your apps"** section
5. If no web app exists:
   - Click **"Add app"** button
   - Select **Web** (</> icon)
   - Give it a name (e.g., "EduVaza Web")
   - Click **"Register app"**
6. Copy the configuration values

### 2. Update .env File

Open `eduvaza-core/.env` and replace these values:

```env
# Replace with YOUR actual values from Firebase Console
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. Enable Required Services

In Firebase Console:

#### A. Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Click **Save**

#### B. Create Firestore Database
1. Go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a location (closest to you)
5. Click **"Enable"**

#### C. Set Firestore Rules (for development)
1. Go to **Firestore Database** → **Rules** tab
2. Replace with:

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
    
    // Allow authenticated users to read/write their own data
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### 4. Restart Dev Server

After updating `.env`:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 5. Create Test User

1. Go to Firebase Console → **Authentication** → **Users** tab
2. Click **"Add user"**
3. Enter:
   - Email: `teacher@test.com`
   - Password: `Test123!`
4. Click **"Add user"**
5. Click on the user
6. Click **"Custom claims"** → Add:
   ```json
   {"role": "teacher"}
   ```

### 6. Test Login

1. Go to: `http://localhost:8080/login`
2. Login with:
   - Email: `teacher@test.com`
   - Password: `Test123!`
3. Should redirect to teacher dashboard

## Verification Checklist

- [ ] Firebase project created
- [ ] Web app registered in Firebase
- [ ] `.env` file updated with real credentials
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore database created
- [ ] Firestore rules updated
- [ ] Dev server restarted
- [ ] Test user created with teacher role
- [ ] Can login successfully
- [ ] No Firebase errors in console

## Common Issues

### "API key not valid"
- Double-check you copied the API key correctly
- Make sure there are no extra spaces
- Restart dev server after updating `.env`

### "Permission denied"
- Check Firestore rules
- Make sure user is authenticated
- Verify user has correct role

### "Project not found"
- Check PROJECT_ID is correct
- Make sure you're using the right Firebase project

## Need Help?

Check these files:
- `COMPLETE_SETUP_GUIDE.md` - Full detailed setup
- `FIREBASE_SETUP.md` - Firebase-specific setup
- `CREATE_ADMIN_USER.md` - How to create admin users

## After Setup

Once Firebase is configured, you can:
✅ Create and login users
✅ Create quizzes
✅ Store data in Firestore
✅ Use all app features

---

**Note**: The quiz system will work once Firebase is properly configured!
