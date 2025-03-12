# Cloudinary 400 Error - FIXED

## Problem
Getting error: `Upload failed with status: 400` when trying to upload files to Cloudinary.

## Root Cause
The upload preset name in the code (`eduvaza_unsigned`) didn't match the preset name in your `.env` file (`eduvaza_uploads`).

## Solution Applied

### 1. Updated Cloudinary Service
✅ Changed the service to read the upload preset from environment variables
✅ Improved error handling to show actual Cloudinary error messages
✅ Fixed the upload URL to use correct resource type endpoints

### 2. Code Changes
File: `eduvaza-core/src/services/cloudinary.ts`

**Before:**
```typescript
formData.append('upload_preset', 'eduvaza_unsigned'); // Hardcoded wrong name
```

**After:**
```typescript
private uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'eduvaza_uploads';
formData.append('upload_preset', this.uploadPreset); // Uses .env value
```

## Next Steps

### IMPORTANT: Create the Upload Preset in Cloudinary

1. **Go to Cloudinary Console**: https://console.cloudinary.com
2. **Login** with your account (cloud name: `humsjis`)
3. **Click Settings** (gear icon in top right)
4. **Click "Upload" tab**
5. **Scroll down to "Upload presets"**
6. **Click "Add upload preset"**
7. **Configure:**
   - **Preset name**: `eduvaza_uploads` (must match your .env)
   - **Signing mode**: **Unsigned** ⚠️ CRITICAL!
   - **Folder**: Leave empty (we set it dynamically)
   - **Use filename**: Yes
   - **Unique filename**: Yes (recommended)
   - **Overwrite**: No
   - **Resource type**: Auto
   - **Access mode**: Public
8. **Click "Save"**

### Verify the Fix

1. **Restart your dev server**:
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. **Test upload**:
   - Go to Teacher Dashboard
   - Click "Manage Courses"
   - Click "Upload Course"
   - Try uploading a cover image
   - Should see upload progress and success message

3. **Check Cloudinary**:
   - Go to Media Library in Cloudinary
   - You should see your uploaded files in `eduvaza` folder

## Troubleshooting

### Still getting 400 error?

**Check 1: Preset Name**
- Verify the preset name in Cloudinary matches exactly: `eduvaza_uploads`
- Check your `.env` file: `VITE_CLOUDINARY_UPLOAD_PRESET=eduvaza_uploads`

**Check 2: Signing Mode**
- The preset MUST be set to "Unsigned"
- Go to Settings → Upload → Edit your preset
- Change "Signing mode" to "Unsigned"

**Check 3: Cloud Name**
- Verify cloud name in `.env`: `VITE_CLOUDINARY_CLOUD_NAME=humsjis`
- Check it matches your Cloudinary dashboard

**Check 4: Restart Server**
- After changing `.env`, always restart the dev server
- Environment variables are loaded at startup

### Getting different error?

**401 Unauthorized**
- Preset is not set to "Unsigned" mode
- Fix: Edit preset and change signing mode

**404 Not Found**
- Upload preset doesn't exist
- Fix: Create the preset in Cloudinary

**Network Error**
- Check internet connection
- Check if Cloudinary is accessible
- Try uploading directly in Cloudinary dashboard

## Current Configuration

Your `.env` file should have:
```env
VITE_CLOUDINARY_CLOUD_NAME=humsjis
VITE_CLOUDINARY_API_KEY=117465414766653
VITE_CLOUDINARY_API_SECRET=w-6S-6EO_tO0dAYVUN7FILUHpxw
VITE_CLOUDINARY_UPLOAD_PRESET=eduvaza_uploads
```

## What Was Fixed

1. ✅ Upload preset now reads from environment variable
2. ✅ Better error messages show actual Cloudinary errors
3. ✅ Correct upload URL based on resource type
4. ✅ Removed incorrect `resource_type` form field
5. ✅ Added proper error response parsing

## Testing Checklist

- [ ] Upload preset created in Cloudinary
- [ ] Preset set to "Unsigned" mode
- [ ] Dev server restarted
- [ ] Cover image upload works
- [ ] Video upload works
- [ ] PDF upload works
- [ ] Files appear in Cloudinary Media Library
- [ ] Files organized in correct folders

## Success Indicators

When working correctly, you should see:
1. ✅ Upload progress bar moving
2. ✅ "Uploading... X%" message
3. ✅ Success toast notification
4. ✅ Files in Cloudinary Media Library
5. ✅ No console errors

## Support

If still having issues:
1. Check browser console for detailed error messages
2. Check Cloudinary dashboard for upload logs
3. Verify all environment variables are correct
4. Make sure upload preset exists and is unsigned
5. Try uploading a small test file first

---

**Status**: ✅ FIXED - Just need to create the upload preset in Cloudinary!
