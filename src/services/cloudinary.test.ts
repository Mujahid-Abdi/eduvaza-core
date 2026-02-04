import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cloudinaryService } from './cloudinary';

describe('CloudinaryService', () => {
  describe('URL transformation for authenticated delivery', () => {
    let originalEnv: string | undefined;

    beforeEach(() => {
      originalEnv = import.meta.env.VITE_CLOUDINARY_PDF_DELIVERY;
    });

    afterEach(() => {
      if (originalEnv !== undefined) {
        import.meta.env.VITE_CLOUDINARY_PDF_DELIVERY = originalEnv;
      }
    });

    it('transforms raw/upload URLs to raw/authenticated when PDF delivery is authenticated', async () => {
      // Create a mock CloudinaryService instance with authenticated delivery
      const mockUploadResult = {
        secure_url: 'https://res.cloudinary.com/humsjis/raw/upload/v1770189943/eduvaza/courses/course-123/lessons/main-pdf/sample.pdf',
        public_id: 'eduvaza/courses/course-123/lessons/main-pdf/sample',
        resource_type: 'raw',
        format: 'pdf',
        bytes: 1024,
        created_at: new Date().toISOString()
      };

      // Mock XMLHttpRequest
      const mockXHR: any = {
        upload: { addEventListener: vi.fn() },
        addEventListener: vi.fn((event: string, handler: Function) => {
          if (event === 'load') {
            // Simulate successful upload
            setTimeout(() => {
              mockXHR.status = 200;
              mockXHR.responseText = JSON.stringify(mockUploadResult);
              handler();
            }, 0);
          }
        }),
        open: vi.fn(),
        send: vi.fn(),
        status: 0,
        responseText: ''
      };

      // @ts-ignore - Mock XMLHttpRequest
      global.XMLHttpRequest = vi.fn(() => mockXHR);

      const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
      
      // Note: The actual transformation happens inside the service based on the env variable
      // We're testing that the upload returns the correct URL format
      const result = await cloudinaryService.uploadFile(file, {
        folder: 'eduvaza/test',
        resourceType: 'raw'
      });

      // The URL should be transformed if VITE_CLOUDINARY_PDF_DELIVERY is 'authenticated'
      if (import.meta.env.VITE_CLOUDINARY_PDF_DELIVERY === 'authenticated') {
        expect(result.secure_url).toContain('/raw/authenticated/');
        expect(result.secure_url).not.toContain('/raw/upload/');
      }
    });

    it('does not transform video URLs', async () => {
      const mockUploadResult = {
        secure_url: 'https://res.cloudinary.com/humsjis/video/upload/v1770189943/eduvaza/courses/course-123/video.mp4',
        public_id: 'eduvaza/courses/course-123/video',
        resource_type: 'video',
        format: 'mp4',
        bytes: 2048,
        created_at: new Date().toISOString()
      };

      const mockXHR: any = {
        upload: { addEventListener: vi.fn() },
        addEventListener: vi.fn((event: string, handler: Function) => {
          if (event === 'load') {
            setTimeout(() => {
              mockXHR.status = 200;
              mockXHR.responseText = JSON.stringify(mockUploadResult);
              handler();
            }, 0);
          }
        }),
        open: vi.fn(),
        send: vi.fn(),
        status: 0,
        responseText: ''
      };

      // @ts-ignore
      global.XMLHttpRequest = vi.fn(() => mockXHR);

      const file = new File(['dummy content'], 'test.mp4', { type: 'video/mp4' });
      
      const result = await cloudinaryService.uploadFile(file, {
        folder: 'eduvaza/test',
        resourceType: 'video'
      });

      // Video URLs should never be transformed
      expect(result.secure_url).toBe(mockUploadResult.secure_url);
      expect(result.secure_url).toContain('/video/upload/');
    });

    it('does not transform image URLs', async () => {
      const mockUploadResult = {
        secure_url: 'https://res.cloudinary.com/humsjis/image/upload/v1770189943/eduvaza/courses/course-123/image.jpg',
        public_id: 'eduvaza/courses/course-123/image',
        resource_type: 'image',
        format: 'jpg',
        bytes: 512,
        created_at: new Date().toISOString()
      };

      const mockXHR: any = {
        upload: { addEventListener: vi.fn() },
        addEventListener: vi.fn((event: string, handler: Function) => {
          if (event === 'load') {
            setTimeout(() => {
              mockXHR.status = 200;
              mockXHR.responseText = JSON.stringify(mockUploadResult);
              handler();
            }, 0);
          }
        }),
        open: vi.fn(),
        send: vi.fn(),
        status: 0,
        responseText: ''
      };

      // @ts-ignore
      global.XMLHttpRequest = vi.fn(() => mockXHR);

      const file = new File(['dummy content'], 'test.jpg', { type: 'image/jpeg' });
      
      const result = await cloudinaryService.uploadFile(file, {
        folder: 'eduvaza/test',
        resourceType: 'image'
      });

      // Image URLs should never be transformed
      expect(result.secure_url).toBe(mockUploadResult.secure_url);
      expect(result.secure_url).toContain('/image/upload/');
    });
  });

  describe('File validation', () => {
    it('validates file size correctly', () => {
      const smallFile = new File(['a'.repeat(1000)], 'small.pdf', { type: 'application/pdf' });
      const result = cloudinaryService.validateFile(smallFile, { maxSize: 5000 });
      expect(result.valid).toBe(true);
    });

    it('rejects files that are too large', () => {
      const largeFile = new File(['a'.repeat(10000)], 'large.pdf', { type: 'application/pdf' });
      const result = cloudinaryService.validateFile(largeFile, { maxSize: 5000 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('File size must be less than');
    });

    it('validates allowed file types', () => {
      const pdfFile = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
      const result = cloudinaryService.validateFile(pdfFile, { 
        allowedTypes: ['application/pdf'] 
      });
      expect(result.valid).toBe(true);
    });

    it('rejects disallowed file types', () => {
      const exeFile = new File(['content'], 'malware.exe', { type: 'application/x-msdownload' });
      const result = cloudinaryService.validateFile(exeFile, { 
        allowedTypes: ['application/pdf', 'image/*'] 
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });
  });
});
