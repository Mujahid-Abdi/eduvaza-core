# 🎓 EduVaza - Africa's Open Learning Platform

> Empowering education across Africa with modern technology

[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

## 🌟 Features

### 🔐 Authentication & Authorization
- Email/Password authentication
- Phone number authentication with SMS
- Role-based access control (Student, Teacher, School, Admin)
- Auto sign-in after registration
- Multi-step registration flow

### 📚 Learning Management
- Course creation and management
- Interactive quizzes with real-time results
- Lesson content (PDF, video, text)
- Progress tracking
- Course enrollment system

### 🎮 Gamification
- Badges and achievements
- Leaderboards
- Points and levels
- Streak tracking

### 🌍 Multi-language Support
- English (en)
- French (fr)
- Arabic (ar)
- Swahili (sw)

### 📱 Modern UI/UX
- Responsive design
- Dark mode support
- Beautiful animations
- Loading states
- Toast notifications

### 🔧 Technical Features
- Firebase Authentication & Firestore
- Cloudinary for file storage
- Real-time updates
- Progressive Web App (PWA) ready
- TypeScript for type safety
- Tailwind CSS for styling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Firebase account
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd eduvaza-core

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

### Firebase Setup (2 minutes)

1. **Enable Authentication**:
   - Go to [Firebase Console](https://console.firebase.google.com/project/eduvaza-cfbec)
   - Enable Email/Password authentication

2. **Enable Firestore**:
   - Create Firestore database
   - Deploy rules: `firebase deploy --only firestore:rules`

### Cloudinary Setup (1 minute)

1. Go to [Cloudinary Console](https://console.cloudinary.com)
2. Create upload preset: `eduvaza_uploads` (unsigned)

**See [QUICK_START.md](./QUICK_START.md) for detailed instructions**

## 📖 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[Complete Setup Guide](./COMPLETE_SETUP_GUIDE.md)** - Comprehensive setup instructions
- **[Firebase Setup](./FIREBASE_SETUP.md)** - Firebase configuration details
- **[Cloudinary Setup](./CLOUDINARY_SETUP.md)** - File storage configuration
- **[Storage Migration](./STORAGE_MIGRATION_COMPLETE.md)** - Migration from Firebase Storage

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Framer Motion** - Animations
- **React Router** - Routing
- **React Query** - Data fetching

### Backend Services
- **Firebase Authentication** - User authentication
- **Firestore** - Database
- **Cloudinary** - File storage & CDN
- **Firebase Analytics** - Usage tracking

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Testing
- **TypeScript** - Type checking

## 📁 Project Structure

```
eduvaza-core/
├── src/
│   ├── components/       # React components
│   │   ├── auth/        # Authentication components
│   │   ├── ui/          # UI components (Shadcn)
│   │   ├── quiz/        # Quiz components
│   │   └── ...
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilities & configs
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   └── i18n/            # Translations
├── public/              # Static assets
├── firebase.json        # Firebase config
├── firestore.rules      # Database rules
└── package.json         # Dependencies
```

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Firebase
npm run firebase:deploy  # Deploy everything
npm run firebase:deploy:hosting  # Deploy hosting only
npm run firebase:deploy:rules    # Deploy Firestore rules

# Testing & Quality
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Run ESLint
```

## 🌐 Deployment

### Deploy to Firebase Hosting

```bash
# Build and deploy
npm run firebase:deploy

# Or deploy hosting only
npm run firebase:deploy:hosting
```

Your app will be live at: `https://eduvaza-cfbec.web.app`

## 🔒 Security

- Firestore security rules configured
- Environment variables for sensitive data
- Role-based access control
- Input validation and sanitization
- HTTPS only in production

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- Cloudinary for media management
- Shadcn/ui for beautiful components
- The open-source community

## 📧 Contact

For questions or support, please contact:
- Email: abdimujahid391@gmail.com
- Firebase Project: [eduvaza-cfbec](https://console.firebase.google.com/project/eduvaza-cfbec)

---

**Built with ❤️ for African education**

🌍 Empowering learners across Africa | 🚀 Modern technology for education | 📚 Open and accessible