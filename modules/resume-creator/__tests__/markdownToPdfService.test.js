// __tests__/markdownToPdfService.test.js
// Jest test for markdownToPdfService

const fs = require('fs');
const path = require('path');
const { markdownToPdf } = require('../services/markdownToPdfService');
const { exampleMarkdown } = require('../test-utils/exampleMarkdown');

describe('markdownToPdf', () => {
  const outputPath = path.join(__dirname, '../output_test.pdf');

  afterAll(() => {
    // Clean up generated PDF after test
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  });

  it('should generate a PDF from markdown string', async () => {
    await markdownToPdf(exampleMarkdown, outputPath);
    expect(fs.existsSync(outputPath)).toBe(true);
    const stats = fs.statSync(outputPath);
    expect(stats.size).toBeGreaterThan(0);
  }, 20000); // Increase timeout for Puppeteer
});
