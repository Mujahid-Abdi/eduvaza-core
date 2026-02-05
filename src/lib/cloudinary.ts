// Cloudinary Configuration - Fixed for authenticated raw file access
import { Cloudinary } from 'cloudinary-core';
import CryptoJS from 'crypto-js';

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

// Extract public ID and metadata from Cloudinary URL
export const getCloudinaryRawPublicId = (url: string) => {
  if (!url.includes('res.cloudinary.com')) return null;

  const cloudName = cloudinaryConfig.cloudName;
  
  // Match both /raw/upload/ and /raw/authenticated/ patterns
  const rawMatch = url.match(
    new RegExp(`https://res\\.cloudinary\\.com/${cloudName}/raw/(?:upload|authenticated)/(v\\d+/)?(.+)$`)
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

// Generate a signed URL for authenticated Cloudinary resources
export const generateSignedUrl = (publicId: string, options: {
  resourceType?: string;
  version?: number;
  format?: string;
}) => {
  const apiSecret = cloudinaryConfig.apiSecret;
  if (!apiSecret) return null;

  const cloudName = cloudinaryConfig.cloudName;
  const timestamp = Math.floor(Date.now() / 1000);
  const expiresAt = timestamp + 3600; // 1 hour expiry
  
  const resourceType = options.resourceType || 'raw';
  const versionStr = options.version ? `v${options.version}` : '';
  const formatStr = options.format ? `.${options.format}` : '';
  
  // Build the string to sign
  const toSign = `${publicId}${formatStr}${expiresAt}${apiSecret}`;
  const signature = CryptoJS.SHA1(toSign).toString(CryptoJS.enc.Hex).substring(0, 8);
  
  // Build the signed URL
  const baseUrl = `https://res.cloudinary.com/${cloudName}/${resourceType}/authenticated`;
  const path = versionStr ? `${versionStr}/${publicId}${formatStr}` : `${publicId}${formatStr}`;
  
  return `${baseUrl}/s--${signature}--/${path}?_a=${expiresAt}`;
};

// Get accessible URL for Cloudinary raw files (PDFs, documents)
export const getAccessibleRawUrl = (url: string): string => {
  if (!url) return url;
  
  // If it's not a Cloudinary URL, return as-is
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }
  
  // If it's a public upload URL, return as-is
  if (url.includes('/raw/upload/') && !url.includes('/authenticated/')) {
    return url;
  }
  
  // Extract info from the URL
  const rawInfo = getCloudinaryRawPublicId(url);
  if (!rawInfo) return url;
  
  // Try to generate a signed URL
  const signedUrl = generateSignedUrl(rawInfo.publicId, {
    resourceType: 'raw',
    version: rawInfo.version,
    format: rawInfo.format
  });
  
  if (signedUrl) {
    return signedUrl;
  }
  
  // Fallback: try converting to public upload URL
  const cloudName = cloudinaryConfig.cloudName;
  const versionStr = rawInfo.version ? `v${rawInfo.version}/` : '';
  const formatStr = rawInfo.format ? `.${rawInfo.format}` : '';
  
  return `https://res.cloudinary.com/${cloudName}/raw/upload/${versionStr}${rawInfo.publicId}${formatStr}`;
};

// Legacy function - now redirects to getAccessibleRawUrl
export const getAuthenticatedRawUrlFromCloudinaryUrl = (url: string): string | null => {
  const accessibleUrl = getAccessibleRawUrl(url);
  return accessibleUrl !== url ? accessibleUrl : null;
};
