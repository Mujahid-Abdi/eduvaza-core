import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PDFViewer, formatCloudinaryAuthHint, isCloudinaryRawUrl } from './PDFViewer';

vi.mock('pdfjs-dist', () => ({
  version: '0.0.0',
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: vi.fn(() => ({
    promise: Promise.reject({ status: 401, message: 'Unauthorized' }),
  })),
}));

describe('PDFViewer', () => {
  it('shows a Cloudinary hint on 401 errors', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<PDFViewer src="https://res.cloudinary.com/demo/raw/upload/v1/sample.pdf" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load PDF')).toBeInTheDocument();
    });

    expect(screen.getByText(/raw PDFs often return 401/i)).toBeInTheDocument();
    expect(
      screen.getByText((content) => content.includes('raw/authenticated'))
    ).toBeInTheDocument();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('formats Cloudinary authenticated URLs', () => {
    expect(
      formatCloudinaryAuthHint('https://res.cloudinary.com/demo/raw/upload/v1/sample.pdf')
    ).toBe('https://res.cloudinary.com/demo/raw/authenticated/v1/sample.pdf');

    expect(formatCloudinaryAuthHint('https://example.com/file.pdf')).toBe(
      'https://example.com/file.pdf'
    );
  });

  it('detects only valid Cloudinary raw URLs', () => {
    expect(isCloudinaryRawUrl('https://res.cloudinary.com/demo/raw/upload/v1/sample.pdf')).toBe(true);
    expect(isCloudinaryRawUrl('https://evil.com/res.cloudinary.com/raw/upload/file.pdf')).toBe(false);
    expect(isCloudinaryRawUrl('https://res.cloudinary.com/demo/raw/authenticated/v1/sample.pdf')).toBe(false);
  });

  it('does not transform already authenticated URLs', () => {
    expect(
      formatCloudinaryAuthHint('https://res.cloudinary.com/demo/raw/authenticated/v1/sample.pdf')
    ).toBe('https://res.cloudinary.com/demo/raw/authenticated/v1/sample.pdf');
  });

  it('handles non-Cloudinary URLs gracefully', () => {
    expect(formatCloudinaryAuthHint('https://example.com/file.pdf')).toBe('https://example.com/file.pdf');
    expect(formatCloudinaryAuthHint('not-a-url')).toBe('not-a-url');
  });
});
