// Cloudinary Configuration
import { Cloudinary } from 'cloudinary-core';

// Initialize Cloudinary
export const cloudinary = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'humsjis',
  secure: true
});

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'humsjis',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '117465414766653',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'eduvaza_uploads'
};

// Helper function to get optimized image URL
export const getCloudinaryUrl = (publicId: string, options?: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
}) => {
  return cloudinary.url(publicId, {
    width: options?.width,
    height: options?.height,
    crop: options?.crop || 'fill',
    quality: options?.quality || 'auto',
    format: options?.format || 'auto',
    fetch_format: 'auto'
  });
};

// Helper function to get thumbnail URL
export const getThumbnailUrl = (publicId: string, size: number = 200) => {
  return getCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 'auto'
  });
};

// Helper function to get avatar URL
export const getAvatarUrl = (publicId: string, size: number = 150) => {
  return getCloudinaryUrl(publicId, {
    width: size,
    height: size,
    crop: 'fill',
    quality: 'auto',
    format: 'jpg'
  });
};