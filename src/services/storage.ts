// Cloudinary Storage Service
import { cloudinaryConfig } from '@/lib/cloudinary';

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  url: string;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
  width?: number;
  height?: number;
}

export const storageService = {
  // Upload file to Cloudinary with progress tracking
  async uploadFile(
    file: File, 
    folder: string = 'eduvaza',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<CloudinaryUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', cloudinaryConfig.uploadPreset);
      formData.append('folder', folder);
      formData.append('cloud_name', cloudinaryConfig.cloudName);

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        if (onProgress) {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const progress: UploadProgress = {
                bytesTransferred: e.loaded,
                totalBytes: e.total,
                progress: (e.loaded / e.total) * 100
              };
              onProgress(progress);
            }
          });
        }

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`);
        xhr.send(formData);
      });
    } catch (error: any) {
      throw new Error(`Upload failed: ${error.message}`);
    }
  },

  // Upload user avatar
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const response = await this.uploadFile(file, `eduvaza/avatars/${userId}`);
    return response.secure_url;
  },

  // Upload course thumbnail
  async uploadCourseThumbnail(courseId: string, file: File): Promise<string> {
    const response = await this.uploadFile(file, `eduvaza/courses/${courseId}/thumbnails`);
    return response.secure_url;
  },

  // Upload lesson content (PDF, video, etc.)
  async uploadLessonContent(
    courseId: string, 
    lessonId: string, 
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const response = await this.uploadFile(
      file, 
      `eduvaza/courses/${courseId}/lessons/${lessonId}`,
      onProgress
    );
    return response.secure_url;
  },

  // Upload school logo
  async uploadSchoolLogo(schoolId: string, file: File): Promise<string> {
    const response = await this.uploadFile(file, `eduvaza/schools/${schoolId}`);
    return response.secure_url;
  },

  // Delete file from Cloudinary (requires backend API)
  async deleteFile(publicId: string): Promise<void> {
    // Note: Deleting files from Cloudinary requires server-side API call
    // This is a placeholder - implement backend endpoint for deletion
    console.warn('File deletion requires backend API implementation');
    throw new Error('File deletion must be implemented on the backend');
  },

  // Generate unique file path
  generateFilePath(folder: string, fileName: string): string {
    const timestamp = Date.now();
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    return `${folder}/${timestamp}_${cleanFileName}`;
  },

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[],
    folder: string = 'eduvaza',
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<CloudinaryUploadResponse[]> {
    const uploadPromises = files.map((file, index) => 
      this.uploadFile(file, folder, (progress) => {
        if (onProgress) {
          onProgress(index, progress);
        }
      })
    );

    return Promise.all(uploadPromises);
  },

  // Get optimized image URL
  getOptimizedUrl(url: string, options?: {
    width?: number;
    height?: number;
    quality?: string;
  }): string {
    // Extract public_id from Cloudinary URL
    const urlParts = url.split('/upload/');
    if (urlParts.length !== 2) return url;

    const [baseUrl, pathWithPublicId] = urlParts;
    const transformations = [];

    if (options?.width) transformations.push(`w_${options.width}`);
    if (options?.height) transformations.push(`h_${options.height}`);
    if (options?.quality) transformations.push(`q_${options.quality}`);
    
    transformations.push('f_auto'); // Auto format

    const transformString = transformations.join(',');
    return `${baseUrl}/upload/${transformString}/${pathWithPublicId}`;
  }
};