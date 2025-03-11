# Mock Authentication Guide

## Overview
The application now supports **Mock Authentication Mode** for development and testing without requiring Firebase setup.

## How It Works

When `VITE_USE_MOCK_AUTH=true` is set in `.env`, the application uses mock users from `mockData.ts` instead of Firebase authentication.

## Enabling Mock Auth

### Already Enabled!
Mock auth is now enabled by default in your `.env` file:

```env
VITE_USE_MOCK_AUTH=true
```

### To Disable (Use Real Firebase):
```env
VITE_USE_MOCK_AUTH=false
```

## Test Users

You can login with these mock users:

### Super Admin
```
Email: admin@eduvaza.com
Password: any password (6+ characters)
Role: super_admin
Redirects to: /admin
```

### School Admin
```
Email: school@greenvalley.edu
Password: any password (6+ characters)
Role: school
Redirects to: /school
```

### Teacher
```
Email: teacher@eduvaza.com
Password: any password (6+ characters)
Role: teacher
Redirects to: /teacher
```

### Student
```
Email: student@eduvaza.com
Password: any password (6+ characters)
Role: student
Redirects to: /student
```

## Testing Admin Dashboard

1. **Go to Login Page:**
   ```
   http://localhost:8081/auth/login
   ```

2. **Enter Admin Credentials:**
   - Email: `admin@eduvaza.com`
   - Password: `password` (or any 6+ characters)

3. **Click Login**
   - You'll see "🔧 DEV MODE: Using mock authentication" in console
   - Should redirect to `/admin`
   - Admin dashboard should load

4. **Verify Dashboard:**
   - Platform statistics visible
   - Pending school approvals
   - School management list

## How Mock Auth Works

### Login Process:
1. Checks if `VITE_USE_MOCK_AUTH=true`
2. Looks up user by email in `mockUsers` array
3. Validates password (any 6+ characters)
4. Stores user in `localStorage`
5. Returns user object

### Logout Process:
1. Removes user from `localStorage`
2. Clears authentication state

### Session Persistence:
- User data stored in `localStorage` as `mockUser`
- Persists across page refreshes
- Cleared on logout

## Switching Between Modes

### Development (Mock Auth):
```env
VITE_USE_MOCK_AUTH=true
```
- No Firebase required
- Instant login
- Uses mock users
- Perfect for testing

### Production (Real Firebase):
```env
VITE_USE_MOCK_AUTH=false
```
- Requires Firebase setup
- Real authentication
- Firestore database
- Production ready

## Console Messages

When mock auth is active, you'll see:
```
🔧 DEV MODE: Using mock authentication
🔧 DEV MODE: Logging out (clearing mock user)
```

## Troubleshooting

### Admin Dashboard Not Loading?

1. **Check .env file:**
   ```
   VITE_USE_MOCK_AUTH=true
   ```

2. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

3. **Clear browser cache:**
   - Open DevTools (F12)
   - Right-click refresh → "Empty Cache and Hard Reload"

4. **Check localStorage:**
   - Open DevTools → Application → Local Storage
   - Should see `mockUser` after login

5. **Check console:**
   - Should see "🔧 DEV MODE: Using mock authentication"
   - If not, .env change didn't take effect

### Still Not Working?

1. **Verify .env file location:**
   - Should be in `eduvaza-core/.env`
   - Not in parent directory

2. **Check file content:**
   ```bash
   cat .env | grep MOCK
   ```
   Should show: `VITE_USE_MOCK_AUTH=true`

3. **Hard restart:**
   ```bash
   # Kill all node processes
   # Then restart
   npm run dev
   ```

## Adding More Mock Users

Edit `src/services/mockData.ts`:

```typescript
export const mockUsers: User[] = [
  {
    id: 'new-user-1',
    email: 'newuser@example.com',
    name: 'New User',
    role: 'student', // or 'teacher', 'school', 'super_admin'
    createdAt: new Date(),
    isActive: true,
  },
  // ... existing users
];
```

## Security Note

⚠️ **Mock auth is for development only!**

- Never use in production
- No real security
- Any password works
- Data not persisted

For production, always use:
```env
VITE_USE_MOCK_AUTH=false
```

## Benefits of Mock Auth

✅ **Fast Development:**
- No Firebase setup needed
- Instant login
- Test all roles quickly

✅ **Easy Testing:**
- Switch between roles
- No database required
- Predictable data

✅ **Offline Development:**
- Works without internet
- No API calls
- Local storage only

## Switching Roles

To test different roles:

1. **Logout** (if logged in)
2. **Login with different email:**
   - Admin: `admin@eduvaza.com`
   - School: `school@greenvalley.edu`
   - Teacher: `teacher@eduvaza.com`
   - Student: `student@eduvaza.com`
3. **Use any password** (6+ characters)

## Production Deployment

Before deploying to production:

1. **Disable mock auth:**
   ```env
   VITE_USE_MOCK_AUTH=false
   ```

2. **Set up Firebase:**
   - Create Firebase project
   - Enable Authentication
   - Set up Firestore
   - Update Firebase config

3. **Create real users:**
   - Use Firebase Console
   - Or registration page
   - Set proper roles in Firestore

4. **Test thoroughly:**
   - Verify real authentication works
   - Check role-based access
   - Test all features

---

**Mock auth is now active! Login with `admin@eduvaza.com` to test the admin dashboard.** 🚀
