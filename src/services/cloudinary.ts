// Cloudinary Upload Service
import { Cloudinary } from 'cloudinary-core';

// Initialize Cloudinary
const cloudinary = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  secure: true
});

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  created_at: string;
}

export interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: string;
  onProgress?: (progress: UploadProgress) => void;
}

class CloudinaryService {
  private cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  private uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'afedulight_uploads';

  // Get upload URL based on resource type
  private getUploadUrl(resourceType: 'image' | 'video' | 'raw' | 'auto' = 'auto'): string {
    return `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`;
  }

  // Upload file to Cloudinary with retry logic
  async uploadFile(
    file: File, 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.uploadFileAttempt(file, options);
      } catch (error) {
        lastError = error as Error;
        
        // Check if it's a network error that we should retry
        const isNetworkError = lastError.message.includes('network error') || 
                               lastError.message.includes('ERR_NETWORK_CHANGED');
        
        if (isNetworkError && attempt < maxRetries) {
          console.log(`Upload attempt ${attempt} failed, retrying...`);
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
        
        // If it's not a network error or we've exhausted retries, throw
        throw lastError;
      }
    }

    throw lastError || new Error('Upload failed after retries');
  }

  // Single upload attempt
  private uploadFileAttempt(
    file: File, 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    const {
      folder = 'afedulight',
      resourceType = 'auto',
      onProgress
    } = options;

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.uploadPreset);
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();
      
      // Set timeout to 5 minutes for large files
      xhr.timeout = 300000;

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result);
          } catch (error) {
            reject(new Error('Failed to parse upload response'));
          }
        } else {
          let errorMessage = `Upload failed with status: ${xhr.status}`;
          let errorDetails = '';
          
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            if (errorResponse.error && errorResponse.error.message) {
              errorMessage = errorResponse.error.message;
            }
            
            // Add specific error handling for common issues
            if (xhr.status === 400) {
              errorDetails = ' - Check that your Cloudinary upload preset "afedulight_uploads" exists and is set to unsigned mode.';
            } else if (xhr.status === 401) {
              errorDetails = ' - Authentication failed. Verify your Cloudinary credentials.';
            } else if (xhr.status === 403) {
              errorDetails = ' - Access forbidden. Check your Cloudinary account permissions.';
            } else if (xhr.status === 413) {
              errorDetails = ' - File too large. Try compressing the file or uploading a smaller version.';
            }
          } catch (e) {
            // Use default error message
          }
          
          console.error('Cloudinary upload error:', {
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText,
            uploadPreset: this.uploadPreset,
            cloudName: this.cloudName
          });
          
          reject(new Error(errorMessage + errorDetails));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error. Please check your connection and try again.'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timed out. Please try again with a smaller file or better connection.'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was cancelled.'));
      });

      const uploadUrl = this.getUploadUrl(resourceType);
      xhr.open('POST', uploadUrl);
      xhr.send(formData);
    });
  }

  // Upload user avatar
  async uploadAvatar(file: File, userId: string, onProgress?: (progress: UploadProgress) => void): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: `afedulight/avatars/${userId}`,
      resourceType: 'image',
      onProgress
    });
  }

  // Upload course thumbnail
  async uploadCourseThumbnail(file: File, courseId: string, onProgress?: (progress: UploadProgress) => void): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: `afedulight/courses/${courseId}/thumbnails`,
      resourceType: 'image',
      onProgress
    });
  }

  // Upload course content (videos, PDFs, etc.)
  async uploadCourseContent(file: File, courseId: string, lessonId: string, onProgress?: (progress: UploadProgress) => void): Promise<CloudinaryUploadResult> {
    const resourceType = this.getResourceType(file);
    return this.uploadFile(file, {
      folder: `afedulight/courses/${courseId}/lessons/${lessonId}`,
      resourceType,
      onProgress
    });
  }

  // Upload school logo
  async uploadSchoolLogo(file: File, schoolId: string, onProgress?: (progress: UploadProgress) => void): Promise<CloudinaryUploadResult> {
    return this.uploadFile(file, {
      folder: `afedulight/schools/${schoolId}`,
      resourceType: 'image',
      onProgress
    });
  }

  // Delete file from Cloudinary
  async deleteFile(publicId: string): Promise<void> {
    // Note: Deletion requires signed requests, typically done on backend
    // For now, we'll just remove the reference from Firestore
    console.warn('File deletion should be handled on backend for security');
  }

  // Get optimized image URL
  getOptimizedImageUrl(publicId: string, options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}): string {
    const {
      width = 400,
      height = 300,
      crop = 'fill',
      quality = 'auto',
      format = 'auto'
    } = options;

    return cloudinary.url(publicId, {
      width,
      height,
      crop,
      quality,
      format,
      secure: true
    });
  }

  // Get video thumbnail URL
  getVideoThumbnail(publicId: string, options: {
    width?: number;
    height?: number;
  } = {}): string {
    const { width = 400, height = 300 } = options;
    
    return cloudinary.url(publicId, {
      resource_type: 'video',
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'jpg',
      secure: true
    });
  }

  // Determine resource type based on file
  private getResourceType(file: File): 'image' | 'video' | 'raw' {
    const type = file.type;
    
    if (type.startsWith('image/')) {
      return 'image';
    } else if (type.startsWith('video/')) {
      return 'video';
    } else {
      return 'raw'; // For PDFs, documents, etc.
    }
  }

  // Validate file before upload
  validateFile(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  } = {}): { valid: boolean; error?: string } {
    const {
      maxSize = 50 * 1024 * 1024, // 50MB default
      allowedTypes = ['image/*', 'video/*', 'application/pdf']
    } = options;

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
      };
    }

    const isAllowedType = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isAllowedType) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`
      };
    }

    return { valid: true };
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;