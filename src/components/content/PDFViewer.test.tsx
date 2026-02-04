import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PDFViewer } from './PDFViewer';

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
    expect(screen.getByText(/raw\/authenticated/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
