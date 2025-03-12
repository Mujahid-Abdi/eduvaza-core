// Cloudinary Configuration
import { Cloudinary } from 'cloudinary-core';

// Initialize Cloudinary
export const cloudinary = new Cloudinary({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'humsjis',
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  secure: true
});

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'humsjis',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY || '117465414766653',
  apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
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

const getCloudinaryRawPublicId = (url: string) => {
  if (!url.includes('res.cloudinary.com')) return null;

  const cloudName = cloudinaryConfig.cloudName;
  const rawMatch = url.match(
    new RegExp(`https://res\\.cloudinary\\.com/${cloudName}/raw/upload/(v\\d+/)?(.+)$`)
  );

  if (!rawMatch) return null;

  const versionToken = rawMatch[1];
  const rawPath = rawMatch[2];
  const extensionMatch = rawPath.match(/\\.([a-zA-Z0-9]+)$/);
  const format = extensionMatch?.[1];
  const publicId = format ? rawPath.slice(0, -(format.length + 1)) : rawPath;
  const version = versionToken ? Number(versionToken.replace('v', '').replace('/', '')) : undefined;

  return { publicId, version, format };
};

export const getAuthenticatedRawUrlFromCloudinaryUrl = (url: string) => {
  if (!cloudinaryConfig.apiSecret || !cloudinaryConfig.apiKey) {
    return null;
  }

  if (url.includes('/raw/authenticated/')) {
    return url;
  }

  const rawInfo = getCloudinaryRawPublicId(url);
  if (!rawInfo) return null;

  return cloudinary.url(rawInfo.publicId, {
    resource_type: 'raw',
    type: 'authenticated',
    sign_url: true,
    secure: true,
    version: rawInfo.version,
    format: rawInfo.format
  });
};
