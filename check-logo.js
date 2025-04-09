// Quick script to check if logo files exist
import { existsSync } from 'fs';
import { join } from 'path';

const publicDir = './public';
const requiredFiles = [
  'afedulight-logo.jpg',
  'favicon.ico',
];

const optionalFiles = [
  'pwa-192x192.png',
  'pwa-512x512.png',
];

console.log('🔍 Checking AfEdulight Logo Files...\n');

let allRequired = true;

console.log('Required Files:');
requiredFiles.forEach(file => {
  const path = join(publicDir, file);
  const exists = existsSync(path);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allRequired = false;
});

console.log('\nOptional Files (for PWA):');
optionalFiles.forEach(file => {
  const path = join(publicDir, file);
  const exists = existsSync(path);
  console.log(`  ${exists ? '✅' : '⚠️ '} ${file}`);
});

console.log('\n' + '='.repeat(50));

if (allRequired) {
  console.log('✅ All required logo files are present!');
  console.log('🚀 You can now run: npm run dev');
} else {
  console.log('❌ Missing required logo files!');
  console.log('📖 Please read: SAVE_JPG_LOGO.md for instructions');
  console.log('\nQuick steps:');
  console.log('1. Save the logo image from chat as: public/afedulight-logo.jpg');
  console.log('2. Create favicon.ico using: https://www.favicon-generator.org/');
  console.log('3. Save favicon.ico to: public/favicon.ico');
  console.log('4. Run this script again to verify');
}

console.log('='.repeat(50) + '\n');
