// services/pdfParserService.js
// Service to fetch a PDF from a URL and extract its text content

const axios = require('axios');
const pdfParse = require('pdf-parse');

/**
 * Fetches a PDF from a URL and extracts its text content.
 * @param {string} pdfUrl - The URL of the PDF to fetch.
 * @returns {Promise<string>} - The extracted text from the PDF.
 */
async function parsePdfFromUrl(pdfUrl) {
  const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
  const pdfBuffer = response.data;
  const data = await pdfParse(pdfBuffer);
  return data.text;
}

module.exports = { parsePdfFromUrl };
