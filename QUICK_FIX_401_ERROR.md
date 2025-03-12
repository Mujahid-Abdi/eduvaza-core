# Quick Fix: Cloudinary 401 Error

## The Problem
```
Failed to load PDF
Unexpected server response (401) while retrieving PDF
```

## The Solution (2 minutes)

### Option 1: Fix Cloudinary Upload Preset (Recommended)

1. **Open**: https://console.cloudinary.com
2. **Go to**: Settings → Upload → Upload presets
3. **Find**: `eduvaza_uploads` preset
4. **Change**:
   - ✅ Access Mode: **Public** (not "Authenticated")
   - ✅ Signing Mode: **Unsigned**
5. **Save**
6. **Re-upload** your PDFs through the course upload form

### Option 2: Test Your Configuration

1. **Open** the test file in your browser:
   ```
   eduvaza-core/test-cloudinary-access.html
   ```
2. **Paste** your PDF URL in Test 1
3. **Click** "Test Access"
4. **Follow** the instructions if it fails

### Option 3: Use Firebase Storage Instead

If Cloudinary is too complex, switch to Firebase Storage:

1. **Enable Firebase Storage** in Firebase Console
2. **Update** security rules to allow public read
3. **Modify** upload code to use Firebase Storage

## Verify the Fix

After changing the preset, test with this URL format:
```
https://res.cloudinary.com/humsjis/raw/upload/v.../file.pdf
```

**Open it directly in browser** - it should download/display the PDF without asking for authentication.

## Why This Happens

Cloudinary's `raw` resource type (PDFs, documents) requires authentication by default. The upload preset must explicitly allow public access.

## Need Help?

1. Check: `CLOUDINARY_PDF_401_FIX.md` for detailed instructions
2. Use: `test-cloudinary-access.html` to diagnose issues
3. Read: `CLOUDINARY_SETUP.md` for complete setup guide

---

**TL;DR**: Set your Cloudinary upload preset's Access Mode to "Public" and re-upload your files.
