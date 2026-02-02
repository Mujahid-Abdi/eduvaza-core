# Firebase Setup Guide for EduVaza

## Prerequisites
- Node.js installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created (eduvaza-cfbec)

## Setup Steps

### 1. Enable Firebase Services
Go to [Firebase Console](https://console.firebase.google.com/project/eduvaza-cfbec) and enable:

1. **Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Phone authentication
   - Add your domain to authorized domains

2. **Firestore Database**
   - Go to Firestore Database
   - Create database in production mode
   - Choose your preferred region

3. **Storage**
   - Go to Storage
   - Get started with default rules
   - Choose your preferred region

### 2. Configure Authentication
1. In Firebase Console > Authentication > Settings
2. Add authorized domains for your app
3. Configure phone authentication settings

### 3. Deploy Security Rules
```bash
# Deploy Firestore and Storage rules
npm run firebase:deploy:rules
```

### 4. Environment Variables
Copy `.env.example` to `.env` and update with your Firebase config:
```bash
cp .env.example .env
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Run Development Server
```bash
npm run dev
```

### 7. Deploy to Firebase Hosting
```bash
# Build and deploy
npm run firebase:deploy

# Deploy only hosting
npm run firebase:deploy:hosting
```

## Firebase Services Used

### Authentication
- Email/Password authentication
- Phone number authentication with SMS verification
- User profile management

### Firestore Database
Collections:
- `users` - User profiles and data
- `schools` - School information
- `courses` - Course content and metadata
- `quizzes` - Quiz data and questions
- `enrollments` - Student course enrollments
- `quiz_attempts` - Quiz attempt records

### Storage
Folders:
- `avatars/{userId}/` - User profile pictures
- `schools/{schoolId}/` - School logos and documents
- `courses/{courseId}/` - Course materials (PDFs, videos, images)

## Security Rules

### Firestore Rules
- Users can read/write their own data
- Teachers can manage their courses and quizzes
- Students can read courses and write their own attempts
- School admins can manage their school data

### Storage Rules
- Users can upload their own avatars
- Teachers can upload course materials
- File size limit: 50MB
- Authenticated users only

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run firebase:deploy` - Build and deploy everything
- `npm run firebase:deploy:hosting` - Deploy only hosting
- `npm run firebase:deploy:rules` - Deploy only security rules

## Troubleshooting

### Phone Authentication Issues
1. Ensure reCAPTCHA is properly configured
2. Check that your domain is in authorized domains
3. Verify phone number format (+country_code)

### Storage Upload Issues
1. Check file size limits
2. Verify user authentication
3. Check storage rules

### Firestore Permission Issues
1. Verify security rules
2. Check user authentication state
3. Ensure proper document structure

## Next Steps
1. Set up Firebase Functions for server-side logic
2. Configure Firebase Analytics
3. Set up Firebase Performance Monitoring
4. Add Firebase Crashlytics for error tracking