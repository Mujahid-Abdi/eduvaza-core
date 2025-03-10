# Cloudinary Setup Guide for EduVaza

## 📁 File Storage with Cloudinary

EduVaza uses **Cloudinary** for all file storage needs (avatars, course materials, school logos, etc.) instead of Firebase Storage.

### ✅ Configuration Complete

Your Cloudinary credentials are already configured:
- **Cloud Name**: humsjis
- **API Key**: 117465414766653
- **API Secret**: w-6S-6EO_tO0dAYVUN7FILUHpxw

### 🔧 Required: Create Upload Preset

You need to create an **unsigned upload preset** in your Cloudinary dashboard:

1. **Go to Cloudinary Console**: [https://console.cloudinary.com](https://console.cloudinary.com)
2. **Navigate to Settings** → **Upload**
3. **Scroll to Upload presets**
4. **Click "Add upload preset"**
5. **Configure the preset**:
   - **Preset name**: `eduvaza_uploads`
   - **Signing Mode**: **Unsigned** (important!)
   - **Folder**: `eduvaza` (optional, for organization)
   - **Access Mode**: **Public**
   - **Unique filename**: **Enabled** (recommended)
6. **Save** the preset

### 📋 Folder Structure

Cloudinary will organize files in the following structure:

```
eduvaza/
├── avatars/
│   └── {userId}/
│       └── avatar_files
├── schools/
│   └── {schoolId}/
│       └── logo_files
└── courses/
    └── {courseId}/
        ├── thumbnails/
        │   └── thumbnail_files
        └── lessons/
            └── {lessonId}/
                └── lesson_content_files
```

### 🚀 Usage Examples

#### Upload Avatar
```typescript
import { storageService } from '@/services/storage';

const uploadAvatar = async (userId: string, file: File) => {
  const url = await storageService.uploadAvatar(userId, file);
  console.log('Avatar URL:', url);
};
```

#### Upload with Progress
```typescript
const uploadWithProgress = async (file: File) => {
  const url = await storageService.uploadFile(
    file,
    'eduvaza/custom-folder',
    (progress) => {
      console.log(`Upload progress: ${progress.progress}%`);
    }
  );
};
```

#### Get Optimized Image URL
```typescript
import { storageService } from '@/services/storage';

const optimizedUrl = storageService.getOptimizedUrl(
  originalUrl,
  {
    width: 300,
    height: 300,
    quality: 'auto'
  }
);
```

### 🎨 Image Transformations

Cloudinary provides powerful image transformations:

```typescript
import { getCloudinaryUrl, getThumbnailUrl, getAvatarUrl } from '@/lib/cloudinary';

// Get optimized image
const optimized = getCloudinaryUrl(publicId, {
  width: 800,
  height: 600,
  crop: 'fill',
  quality: 'auto'
});

// Get thumbnail
const thumbnail = getThumbnailUrl(publicId, 200);

// Get avatar
const avatar = getAvatarUrl(publicId, 150);
```

### 🔒 Security Notes

1. **Upload Preset**: Must be unsigned for client-side uploads
2. **API Secret**: Never expose in client-side code (already secured in .env)
3. **Folder Structure**: Organized by user/school/course IDs for security
4. **File Deletion**: Requires backend API (not implemented client-side)

### 📊 Cloudinary Features Used

- ✅ **Direct Upload**: Client-side file uploads
- ✅ **Progress Tracking**: Real-time upload progress
- ✅ **Image Optimization**: Automatic format and quality optimization
- ✅ **Responsive Images**: Dynamic resizing and cropping
- ✅ **CDN Delivery**: Fast global content delivery
- ✅ **Folder Organization**: Structured file management

### 🛠️ Troubleshooting

#### Upload Preset Error
**Error**: "Upload preset not found"
**Solution**: Create the `eduvaza_uploads` preset in Cloudinary console (see steps above)

#### CORS Error
**Error**: "CORS policy blocked"
**Solution**: Cloudinary allows CORS by default for uploads. Check your upload preset settings.

#### File Size Limits
**Default**: 10MB for free tier
**Solution**: Upgrade Cloudinary plan or compress files before upload

### 📈 Monitoring Usage

1. **Go to Cloudinary Dashboard**: [https://console.cloudinary.com](https://console.cloudinary.com)
2. **Check Usage**: View storage, bandwidth, and transformations
3. **Set Alerts**: Configure notifications for usage limits

### 🔄 Migration from Firebase Storage

If you had files in Firebase Storage:
1. Download files from Firebase Storage
2. Upload to Cloudinary using the storage service
3. Update database URLs to point to Cloudinary
4. Remove Firebase Storage from your project

### 💡 Best Practices

1. **Compress Images**: Before uploading large images
2. **Use Transformations**: Let Cloudinary optimize images
3. **Organize Folders**: Use consistent folder structure
4. **Monitor Usage**: Keep track of storage and bandwidth
5. **Backup Important Files**: Keep local copies of critical files

### 🌟 Benefits of Cloudinary

- **No Firebase Storage Setup**: No need to enable Firebase Storage
- **Better Image Optimization**: Automatic format conversion and quality optimization
- **Global CDN**: Faster content delivery worldwide
- **Advanced Transformations**: Resize, crop, filter images on-the-fly
- **Video Support**: Upload and stream videos
- **Free Tier**: Generous free tier for development

---

## ✅ Ready to Use!

Your Cloudinary integration is complete. Just create the upload preset and start uploading files!

**Next Steps**:
1. Create the `eduvaza_uploads` preset in Cloudinary
2. Test file uploads in your application
3. Monitor usage in Cloudinary dashboard