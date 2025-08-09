// services/markdownToPdfService.js
// Service to convert markdown string to PDF using Puppeteer

const markdownIt = require('markdown-it');
const puppeteer = require('puppeteer');

const md = new markdownIt();

const defaultStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; font-size: 13px; color: #222; background-color: white; line-height: 1.4; padding: 1cm; max-width: 800px; margin: auto; }
  h1, h2, h3, h4 { font-weight: 600; color: #111; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  h2 { font-size: 16px; margin-top: 16px; margin-bottom: 4px; border-bottom: 1px solid #ccc; padding-bottom: 2px; }
  h3 { font-size: 14px; margin-top: 10px; margin-bottom: 2px; }
  p { margin-bottom: 4px; }
  ul { padding-left: 18px; margin-bottom: 4px; }
  li { margin-bottom: 3px; }
  a { color: #0366d6; text-decoration: none; }
  pre, code { background-color: #f4f4f4; border-radius: 4px; padding: 4px; font-family: 'Courier New', monospace; font-size: 12px; }
  hr { border: none; border-top: 1px solid #ccc; margin: 10px 0 6px; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #222; padding-bottom: 8px; margin-bottom: 16px; }
  .header-left h1 { font-size: 24px; font-weight: 700; }
  .header-right { text-align: right; font-size: 12px; color: #555; }
  .job-title { font-weight: 600; }
  .company { font-style: italic; color: #444; font-size: 12px; }
  @page { margin: 1cm; }
`;

/**
 * Converts a markdown string to a PDF file.
 * @param {string} markdown - The markdown content as a string.
 * @param {string} outputPath - The path to save the PDF file.
 * @param {string} [style] - Optional custom CSS style.
 * @returns {Promise<void>}
 */
async function markdownToPdf(markdown, outputPath, style = defaultStyle) {
  const html = md.render(markdown);
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Resume</title>
      <style>${style}</style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
  });
  await browser.close();
}

module.exports = { markdownToPdf };
