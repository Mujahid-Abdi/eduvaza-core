# Cloudinary PDF 401 Fix - Usage Guide

## Problem
PDFs uploaded to Cloudinary return 401 (Unauthorized) errors when accessed with URLs in the format:
```
https://res.cloudinary.com/humsjis/raw/upload/v.../file.pdf
```

## Solution
This fix automatically transforms PDF URLs from `/raw/upload/` to `/raw/authenticated/` when configured, allowing the PDFViewer to fetch them with proper credentials.

## Setup

### Step 1: Configure Environment Variable
Add to your `.env` file:

```bash
# For public access (default, no authentication needed)
VITE_CLOUDINARY_PDF_DELIVERY=public

# OR for authenticated access (transforms URLs automatically)
VITE_CLOUDINARY_PDF_DELIVERY=authenticated
```

### Step 2: Choose Your Cloudinary Configuration

#### Option A: Public Access (Recommended for Simplicity)
1. Open https://console.cloudinary.com
2. Navigate to **Settings** → **Upload** → **Upload presets**
3. Find or create the `eduvaza_uploads` preset
4. Set **Access Mode** to **Public**
5. Set **Signing Mode** to **Unsigned**
6. Save the preset
7. Use `VITE_CLOUDINARY_PDF_DELIVERY=public` (default)

**Pros:**
- Simple setup
- No URL transformation needed
- Works immediately

**Cons:**
- PDFs are publicly accessible via direct URL

#### Option B: Authenticated Access (Recommended for Security)
1. Keep your Cloudinary upload preset with **Access Mode** set to **Authenticated**
2. Set `VITE_CLOUDINARY_PDF_DELIVERY=authenticated` in your `.env` file
3. The system will automatically:
   - Transform uploaded PDF URLs from `/raw/upload/` to `/raw/authenticated/`
   - Include credentials when fetching PDFs in the PDFViewer

**Pros:**
- PDFs require authentication to access
- Better security for sensitive educational content
- Direct URL access is restricted

**Cons:**
- Requires proper CORS configuration in Cloudinary
- May need additional Cloudinary settings

## How It Works

### Upload Flow
1. User uploads a PDF through the course upload form
2. Cloudinary returns: `https://res.cloudinary.com/humsjis/raw/upload/v.../file.pdf`
3. If `VITE_CLOUDINARY_PDF_DELIVERY=authenticated`:
   - URL is automatically transformed to: `https://res.cloudinary.com/humsjis/raw/authenticated/v.../file.pdf`
4. Transformed URL is saved to Firestore

### Viewing Flow
1. User opens a lesson with a PDF
2. PDFViewer receives the URL
3. If URL contains `/raw/authenticated/`:
   - PDFViewer fetches with `withCredentials: true`
4. PDF loads successfully

## Testing

### Test URL Transformation
```typescript
import { cloudinaryService } from '@/services/cloudinary';

// Upload a PDF
const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
const result = await cloudinaryService.uploadCourseContent(
  file,
  'course-123',
  'lesson-456'
);

console.log('Uploaded URL:', result.secure_url);
// With authenticated delivery: .../raw/authenticated/...
// With public delivery: .../raw/upload/...
```

### Test PDFViewer
1. Upload a new PDF through the admin/teacher course upload form
2. Open the lesson containing that PDF
3. PDF should load without 401 errors
4. Check browser console for any errors

## Troubleshooting

### PDFs Still Return 401
**If using public delivery:**
- Verify upload preset has **Access Mode: Public**
- Re-upload PDFs after changing the preset
- Test direct URL access in browser

**If using authenticated delivery:**
- Verify `VITE_CLOUDINARY_PDF_DELIVERY=authenticated` is set
- Check that uploaded URLs contain `/raw/authenticated/`
- Verify CORS settings in Cloudinary allow your domain
- Check browser console for CORS errors

### PDFs Upload but Don't Display
- Check if URL contains the correct path (`/raw/authenticated/` or `/raw/upload/`)
- Verify PDFViewer is receiving the URL correctly
- Open browser DevTools → Network tab → Check PDF request
- Look for status codes (200 = success, 401 = unauthorized, 403 = forbidden)

### Mixed Content (Some PDFs Work, Some Don't)
- Old PDFs might have the wrong URL format
- Re-upload affected PDFs
- Or manually update URLs in Firestore

## Migration Guide

### From Public to Authenticated
1. Set `VITE_CLOUDINARY_PDF_DELIVERY=authenticated`
2. Rebuild and deploy the application
3. All new uploads will use authenticated URLs
4. For existing PDFs:
   - Option A: Re-upload them (recommended)
   - Option B: Run a migration script to update URLs in Firestore

### From Authenticated to Public
1. Update Cloudinary preset to **Access Mode: Public**
2. Set `VITE_CLOUDINARY_PDF_DELIVERY=public`
3. Rebuild and deploy the application
4. Existing authenticated URLs will still work if CORS is configured
5. New uploads will use public URLs

## Security Considerations

### Public Delivery
- Anyone with the URL can access the PDF
- Suitable for free/public courses
- No authentication barrier

### Authenticated Delivery
- URLs require valid credentials
- Better for premium/restricted content
- Cloudinary handles authentication
- May require additional Cloudinary configuration for CORS

## Code Changes Summary

### Files Modified
1. `src/services/cloudinary.ts`
   - Added `transformSecureUrl()` method
   - Transforms raw file URLs based on `VITE_CLOUDINARY_PDF_DELIVERY`
   - Only affects PDFs (resource_type: 'raw')

2. `src/components/content/PDFViewer.tsx`
   - Already had support for authenticated URLs
   - Uses `withCredentials: isCloudinaryAuthenticatedUrl(src)`

3. `.env.example`
   - Added `VITE_CLOUDINARY_PDF_DELIVERY` documentation

### Files Added
1. `src/services/cloudinary.test.ts`
   - Tests URL transformation logic
   - Tests file validation
   - Ensures videos/images are not transformed

## Related Documentation
- `CLOUDINARY_PDF_401_FIX.md` - Detailed troubleshooting guide
- `QUICK_FIX_401_ERROR.md` - Quick setup instructions
- `CLOUDINARY_SETUP.md` - Complete Cloudinary configuration

## Support
If you continue to experience issues:
1. Check all related documentation files
2. Verify environment variables are correctly set
3. Test with a fresh PDF upload
4. Check browser console and network tab for errors
5. Verify Cloudinary dashboard settings match your configuration
