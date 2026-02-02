# Firebase Setup Instructions

## ⚠️ IMPORTANT: You need to enable Firebase services manually in the Firebase Console

The errors you're seeing indicate that Firebase Authentication and Storage are not enabled yet. Follow these steps:

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/project/eduvaza-cfbec)
2. Click on **Authentication** in the left sidebar
3. Click **Get started**
4. Go to **Sign-in method** tab
5. Enable **Email/Password** authentication:
   - Click on **Email/Password**
   - Toggle **Enable** to ON
   - Click **Save**

### 2. Enable Firestore Database

1. In Firebase Console, click on **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** (we've already set up rules)
4. Select your preferred location (e.g., us-central1)
5. Click **Done**

### 3. Enable Firebase Storage

1. In Firebase Console, click on **Storage**
2. Click **Get started**
3. Review the security rules (we'll deploy our own)
4. Select the same location as your Firestore
5. Click **Done**

### 4. Deploy Security Rules (After enabling services)

Once all services are enabled, run:

```bash
firebase deploy --only firestore:rules,storage:rules
```

### 5. Test the Application

After enabling all services:

```bash
npm run dev
```

Visit http://localhost:8080 and try:
- Creating a new account
- Logging in with email/password

## Common Issues & Solutions

### Error: `auth/operation-not-allowed`
- **Solution**: Enable Email/Password authentication in Firebase Console

### Error: `Missing or insufficient permissions`
- **Solution**: Enable Firestore Database and deploy the security rules

### Error: `Storage not enabled`
- **Solution**: Enable Firebase Storage in the console

### Error: `Manifest: Syntax error`
- **Solution**: Already fixed - manifest.json has been created

## Verification Steps

After setup, you should see:
1. ✅ No console errors about missing services
2. ✅ Successful user registration
3. ✅ Automatic sign-in after registration
4. ✅ Success message display
5. ✅ Redirect to dashboard

## Need Help?

If you encounter issues:
1. Check the Firebase Console for any error messages
2. Verify all services are enabled and in the same region
3. Make sure the security rules are deployed
4. Check browser console for specific error messages

## Quick Commands

```bash
# Deploy rules after enabling services
firebase deploy --only firestore:rules,storage:rules

# Start development server
npm run dev

# Build for production
npm run build

# Deploy everything
firebase deploy
```