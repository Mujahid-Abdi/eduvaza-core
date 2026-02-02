# 🚀 EduVaza Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Step 1: Enable Firebase Services (2 minutes)

1. **Open Firebase Console**: [https://console.firebase.google.com/project/eduvaza-cfbec](https://console.firebase.google.com/project/eduvaza-cfbec)

2. **Enable Authentication**:
   - Click **Authentication** → **Get started**
   - Go to **Sign-in method** tab
   - Enable **Email/Password** (toggle ON)
   - Click **Save**

3. **Enable Firestore Database**:
   - Click **Firestore Database** → **Create database**
   - Choose **Start in production mode**
   - Select location (e.g., us-central1)
   - Click **Done**

### Step 2: Create Cloudinary Upload Preset (1 minute)

1. **Go to Cloudinary Console**: [https://console.cloudinary.com](https://console.cloudinary.com)
2. **Settings** → **Upload** → **Add upload preset**
3. Configure:
   - **Preset name**: `eduvaza_uploads`
   - **Signing Mode**: **Unsigned**
   - **Folder**: `eduvaza`
4. **Save**

### Step 3: Deploy Firestore Rules (30 seconds)

```bash
cd eduvaza-core
firebase deploy --only firestore:rules
```

### Step 4: Start Development Server (30 seconds)

```bash
npm run dev
```

Visit: http://localhost:8080

### Step 5: Test Registration (1 minute)

1. Click **Register**
2. Select your role (Student/Teacher/School)
3. Fill in details
4. Submit
5. You'll be automatically signed in! 🎉

---

## 📋 What's Configured

### ✅ Firebase Services
- **Authentication**: Email/Password + Phone
- **Firestore Database**: User data, courses, quizzes
- **Analytics**: Usage tracking
- **Hosting**: Ready for deployment

### ✅ Cloudinary Storage
- **Cloud Name**: humsjis
- **File Storage**: Avatars, course materials, school logos
- **CDN Delivery**: Fast global content delivery

### ✅ Features Ready
- Multi-step registration with auto sign-in
- Beautiful success messages
- Role-based access control
- Multi-language support (EN, FR, AR, SW)
- Responsive design
- Loading states and error handling

---

## 🎯 Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run preview               # Preview production build

# Firebase
npm run firebase:deploy       # Deploy everything
npm run firebase:deploy:hosting  # Deploy only hosting
npm run firebase:deploy:rules    # Deploy only rules

# Testing
npm run test                  # Run tests
npm run lint                 # Run linter
```

---

## 🐛 Troubleshooting

### Registration Error: "auth/operation-not-allowed"
**Fix**: Enable Email/Password in Firebase Console → Authentication

### Registration Error: "Missing or insufficient permissions"
**Fix**: Enable Firestore Database and deploy rules

### Upload Error: "Upload preset not found"
**Fix**: Create `eduvaza_uploads` preset in Cloudinary

### Build Error
**Fix**: Run `npm install --force` then `npm run build`

---

## 📚 Documentation

- **Complete Setup**: `COMPLETE_SETUP_GUIDE.md`
- **Firebase Setup**: `FIREBASE_SETUP.md`
- **Cloudinary Setup**: `CLOUDINARY_SETUP.md`
- **Storage Migration**: `STORAGE_MIGRATION_COMPLETE.md`

---

## 🎉 You're Ready!

Your EduVaza platform is configured and ready to use. Just:
1. ✅ Enable Firebase services
2. ✅ Create Cloudinary preset
3. ✅ Deploy rules
4. ✅ Start coding!

**Happy learning! 🌍✨**