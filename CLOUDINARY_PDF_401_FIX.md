# Cloudinary PDF 401 Error Fix

## Problem
PDFs uploaded to Cloudinary return a 401 (Unauthorized) error when accessed:
```
Failed to load PDF
Unexpected server response (401) while retrieving PDF "https://res.cloudinary.com/humsjis/raw/upload/..."
```

## Root Cause
By default, Cloudinary's `raw` resource type (used for PDFs and documents) requires authentication. The upload preset `eduvaza_uploads` needs to be configured to allow **public access** for raw files.

## Solution

### Step 1: Update Upload Preset in Cloudinary Dashboard

1. **Login to Cloudinary Console**: https://console.cloudinary.com
2. **Navigate to Settings** → **Upload** → **Upload presets**
3. **Find or create** the `eduvaza_uploads` preset
4. **Configure these settings**:

   **Basic Settings:**
   - ✅ **Preset name**: `eduvaza_uploads`
   - ✅ **Signing Mode**: **Unsigned** (required for client uploads)
   - ✅ **Folder**: `eduvaza` (optional)
   - ✅ **Use filename**: Enabled
   - ✅ **Unique filename**: Enabled

   **Access Control (CRITICAL):**
   - ✅ **Access Mode**: **Public** (not "Authenticated")
   - ✅ **Resource Type**: **All** (image, video, raw, auto)
   - ✅ **Delivery Type**: **Upload**

   **Advanced Settings:**
   - ✅ **Allowed formats**: Leave empty (allow all) or specify: `jpg,png,pdf,mp4,mov,avi`
   - ✅ **Max file size**: 52428800 (50MB) or adjust as needed

5. **Save** the preset

### Step 2: Verify Upload Preset Configuration

After saving, verify your preset allows public access:

```bash
# Test with curl (replace YOUR_CLOUD_NAME)
curl -X GET "https://api.cloudinary.com/v1_1/humsjis/upload_presets/eduvaza_uploads"
```

Expected response should include:
```json
{
  "name": "eduvaza_uploads",
  "unsigned": true,
  "settings": {
    "access_mode": "public"
  }
}
```

### Step 3: Alternative - Use Signed URLs (Backend Required)

If you need more security, you can generate signed URLs on the backend:

**Backend (Node.js example):**
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'humsjis',
  api_key: '117465414766653',
  api_secret: 'w-6S-6EO_tO0dAYVUN7FILUHpxw'
});

// Generate signed URL for private resource
const signedUrl = cloudinary.url('public_id', {
  resource_type: 'raw',
  type: 'authenticated',
  sign_url: true
});
```

### Step 4: Re-upload Existing PDFs (If Needed)

If PDFs were uploaded with the wrong access mode, you need to re-upload them:

1. **Delete old PDFs** from Cloudinary (or change their access mode via API)
2. **Re-upload PDFs** using the updated preset
3. **Update Firebase** with new URLs

### Step 5: Verify the Fix

1. **Upload a new PDF** through your course upload form
2. **Check the URL** - it should look like:
   ```
   https://res.cloudinary.com/humsjis/raw/upload/v1234567890/eduvaza/courses/...
   ```
3. **Open the URL directly** in a browser - it should download/display the PDF
4. **Test in the lesson viewer** - PDF should load without 401 error

## Quick Test

Test if a Cloudinary URL is publicly accessible:

```bash
# Replace with your actual PDF URL
curl -I "https://res.cloudinary.com/humsjis/raw/upload/v1770189943/eduvaza/courses/course-1770189929220/lessons/main-pdf/zuitvn4wswkp1scmjmga.pdf"
```

**Expected**: `HTTP/2 200` (success)
**Current**: `HTTP/2 401` (unauthorized)

## Alternative Solution: Use Firebase Storage

If Cloudinary continues to have issues, you can switch to Firebase Storage:

### Enable Firebase Storage
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project: `eduvaza-cfbec`
3. Navigate to **Storage** → **Get Started**
4. Choose **Start in production mode**
5. Update security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Public read access
      allow write: if request.auth != null; // Authenticated write
    }
  }
}
```

### Update Code to Use Firebase Storage

**src/services/storage.ts:**
```typescript
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

export const uploadPDF = async (file: File, path: string, onProgress?: (progress: number) => void) => {
  const storageRef = ref(storage, path);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
```

## Recommended Solution

**For Production**: Use Cloudinary with proper public access configuration (Step 1)
- ✅ Better CDN performance
- ✅ Built-in transformations
- ✅ No Firebase Storage setup needed

**For Quick Fix**: Switch to Firebase Storage
- ✅ Easier to configure
- ✅ Already integrated with Firebase
- ❌ Less features than Cloudinary

## Verification Checklist

After applying the fix:

- [ ] Upload preset `eduvaza_uploads` exists in Cloudinary
- [ ] Upload preset has **Access Mode** set to **Public**
- [ ] Upload preset has **Signing Mode** set to **Unsigned**
- [ ] Test PDF URL opens directly in browser (no 401 error)
- [ ] PDF viewer in lesson page loads PDFs successfully
- [ ] Video player works (videos should also be public)
- [ ] Course thumbnails load correctly

## Support

If issues persist:

1. **Check Cloudinary logs**: Console → Reports → Usage
2. **Verify API credentials**: Ensure they match your .env file
3. **Test with Cloudinary's upload widget**: https://cloudinary.com/documentation/upload_widget
4. **Contact Cloudinary support**: If free tier has restrictions

---

## Summary

The 401 error occurs because PDFs are uploaded as `raw` resources which require authentication by default. Fix this by setting the upload preset's **Access Mode** to **Public** in your Cloudinary dashboard.
