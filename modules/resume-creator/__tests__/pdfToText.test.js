// __tests__/pdfToText.test.js
// Jest test for pdfUrlToText utility

const { parsePdfFromUrl } = require('../services/pdfParserService');
const { TEST_PDF_URL } = require('../test-utils/testResources');

describe('parsePdfFromUrl', () => {
  it('should extract text from a PDF URL', async () => {
    const text = await parsePdfFromUrl(TEST_PDF_URL);
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
    // Optionally, check for a known string in the PDF
    // expect(text).toContain('Abhay');
  });
});
