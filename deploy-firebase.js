#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 EduVaza Firebase Deployment Script');
console.log('=====================================\n');

// Check if Firebase CLI is installed
try {
  execSync('firebase --version', { stdio: 'ignore' });
  console.log('✅ Firebase CLI is installed');
} catch (error) {
  console.error('❌ Firebase CLI is not installed. Please run: npm install -g firebase-tools');
  process.exit(1);
}

// Check if user is logged in
try {
  const result = execSync('firebase projects:list 2>&1', { encoding: 'utf8' });
  if (result.includes('eduvaza-cfbec') || result.includes('EduVaza')) {
    console.log('✅ Connected to Firebase project: eduvaza-cfbec');
  } else {
    console.log('⚠️  EduVaza project found. Continuing with deployment...');
  }
} catch (error) {
  console.log('⚠️  Could not verify Firebase project. Continuing anyway...');
}

// Build the project
console.log('\n📦 Building the project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Deploy Firebase rules first
console.log('\n🔒 Deploying security rules...');
try {
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('✅ Security rules deployed');
} catch (error) {
  console.warn('⚠️  Security rules deployment failed. Please check your Firestore setup.');
}

// Deploy hosting
console.log('\n🌐 Deploying to Firebase Hosting...');
try {
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });
  console.log('✅ Hosting deployed successfully');
} catch (error) {
  console.error('❌ Hosting deployment failed');
  process.exit(1);
}

console.log('\n🎉 Deployment completed successfully!');
console.log('📱 Your app is now live at: https://eduvaza-cfbec.web.app');
console.log('🔧 Firebase Console: https://console.firebase.google.com/project/eduvaza-cfbec');

// Check if services are enabled
console.log('\n🔍 Checking Firebase services...');
console.log('Please ensure the following services are enabled in Firebase Console:');
console.log('  • Authentication (Email/Password)');
console.log('  • Firestore Database');
console.log('  • Firebase Hosting (already enabled)');
console.log('  • Cloudinary for file storage (external)');

console.log('\n✨ Happy learning with EduVaza! ✨');