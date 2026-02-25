/**
 * PDF Parser Service
 * Extracts raw text from PDF files using pdfjs-dist (Node.js server-side).
 */

import { pathToFileURL } from 'url';
import { resolve } from 'path';

async function getPdfjs() {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');

  // In Node.js we must point GlobalWorkerOptions.workerSrc to the actual
  // worker file via a file:// URL. An empty string causes the "fake worker"
  // setup to fail in pdfjs-dist v5.
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
    resolve(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'),
  ).toString();

  return pdfjs;
}

export class PdfParserService {
  /**
   * Extract all text content from a PDF buffer.
   * Iterates every page and joins text items with newlines.
   */
  async extractText(buffer: Buffer): Promise<string> {
    const pdfjs = await getPdfjs();

    // pdfjs-dist requires a Uint8Array
    const data = new Uint8Array(buffer);

    const loadingTask = pdfjs.getDocument({
      data,
      useSystemFonts: true,
      // Suppress console warnings about missing font data
      verbosity: 0,
    });

    const pdf = await loadingTask.promise;
    const pageTexts: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map((item) => ('str' in item ? item.str : '')).join(' ');

      pageTexts.push(pageText);
    }

    return pageTexts.join('\n');
  }
}

export const pdfParserService = new PdfParserService();
