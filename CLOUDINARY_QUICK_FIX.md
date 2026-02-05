# Cloudinary 401/400 Error - Quick Fix

## The Problem
- **401 Error**: PDF authentication failed (using demo account)
- **400 Error**: Upload preset not found (demo account doesn't support uploads)

## Solution: Choose One Option

### Option 1: Setup Real Cloudinary Account (5 minutes)

1. **Sign up for free**: https://cloudinary.com/users/register_free
   - Free tier: 25GB storage, 25GB bandwidth/month

2. **Get your credentials**:
   - Go to Dashboard (https://console.cloudinary.com/)
   - Copy: Cloud Name, API Key, API Secret

3. **Create upload preset**:
   - Go to Settings → Upload → Add upload preset
   - Signing Mode: **Unsigned**
   - Preset name: `eduvaza_uploads`
   - Folder: `eduvaza`
   - Click Save

4. **Update `.env` file**:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_API_KEY=your_api_key
   VITE_CLOUDINARY_API_SECRET=your_api_secret
   VITE_CLOUDINARY_UPLOAD_PRESET=eduvaza_uploads
   ```

5. **Restart dev server**:
   ```bash
   npm run dev
   ```

### Option 2: Use Firebase Storage Instead (Simpler)

Since you already have Firebase configured, you can use Firebase Storage:

**Pros**:
- Already authenticated
- No extra account needed
- Simpler setup

**Cons**:
- Less optimization features than Cloudinary
- No automatic image transformations

Would you like me to switch your app to use Firebase Storage instead?

## Testing After Fix

1. Try uploading a course with PDF/video
2. Check browser console - no 401/400 errors
3. PDF should load in viewer

## Still Having Issues?

If you see:
- **401**: API Secret is wrong or missing
- **400**: Upload preset name doesn't match
- **403**: Preset is signed (should be unsigned)
